import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import generateStats from './svg.js';

const app = express();

// Helper function to extract and parse JSON
const extractJsonString = (rawString) => {
    let jsonString = '';
    let depth = 0;

    for (let char of rawString) {
        if (char === '{') depth++;
        if (depth > 0) jsonString += char;
        if (char === '}') depth--;
        if (depth === 0 && jsonString) break;
    }

    try {
        return JSON.parse(jsonString.trim());
    } catch (err) {
        console.error('Error parsing JSON:', err);
        return null;
    }
};

// Helper function to extract problem stats
const extractProblemStats = (rawData) => {
    const problemDifficultyTag = ["School", "Basic", "Easy", "Medium", "Hard"];

    const values = {};
    let tagIndex = 0;

    for (let i = 0; i < rawData.length; i++) {
        if (rawData[i] === '(') {
            const tempStart = i + 1;
            while (rawData[i] !== ')') i++;
            const tempProblems = parseInt(rawData.substring(tempStart, i)) || 0;
            values[problemDifficultyTag[tagIndex++]] = tempProblems;
        }
    }

    return values;
};


app.get('/', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: "Add your geeksForGeeks user Name in the URL, e.g., /?username=<YOUR_USER_NAME>" });
        }

        const response = await axios.get(`https://www.geeksforgeeks.org/user/${username}/`);
        const html = response.data;
        const $ = cheerio.load(html);
        const problemNavbar = $('.problemNavbar_head__cKSRi');

        if (problemNavbar.length === 0) {
            return res.status(400).json({ error: "User does not exist or has not solved any problems on GeeksForGeeks." });
        }

        // Extract raw JSON string and parse it
        const rawJsonString = $('div').next().text().trim();
        const jsonData = extractJsonString(rawJsonString);

        if (!jsonData) {
            return res.status(500).json({ error: "Failed to parse user data." });
        }

        const pageProps = jsonData.props?.pageProps || {};
        const userInfo = pageProps.userInfo || {};

        // Gather user stats
        const values = {
            userHandle: pageProps.userHandle,
            pod_solved_longest_streak: userInfo.pod_solved_longest_streak || 0,
            pod_solved_global_longest_streak: userInfo.pod_solved_global_longest_streak || 0,
            total_problems_solved: userInfo.total_problems_solved || 0,
            total_score: userInfo.score || 0,
            monthly_score: userInfo.monthly_score || 0,
            // institute_rank: userInfo.institute_rank || 0,
            current_rating: pageProps.contestData?.current_rating || 0
        };

        // Extract problem difficulty stats
        const problemStats = extractProblemStats($(problemNavbar[0]).text());
        Object.assign(values, problemStats);

        // Calculate progress based on streaks
        values["Progress"] = values.pod_solved_global_longest_streak
            ? (100 * Math.PI * values.pod_solved_longest_streak) / values.pod_solved_global_longest_streak
            : 0;

        // Generate SVG stats
        const svg = generateStats(values);
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "s-max-age=60, stale-while-revalidate");
        res.send(svg);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching and processing the data." });
    }
});

const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});