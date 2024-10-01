import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import generateStats from './svg.js';

const app = express();

// Helper function to extract and parse JSON from a string
const extractJsonString = (rawString) => {
    try {
        let jsonString = '';
        let depth = 0;

        for (let char of rawString) {
            if (char === '{') depth++;
            if (depth > 0) jsonString += char;
            if (char === '}') depth--;
            if (depth === 0 && jsonString) break;
        }

        return JSON.parse(jsonString.trim());
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
};

// Helper function to extract problem stats based on difficulty
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

// Fetch data from the old GeeksForGeeks profile page
const fetchOldProfileData = async (username) => {
    try {
        const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}/practice/`);
        const $ = cheerio.load(response.data);
        const data = $('.tabs.tabs-fixed-width.linksTypeProblem');

        if (data.length === 0) {
            throw new Error(`User ${username} does not exist or has not solved any problems on GeeksForGeeks.`);
        }

        // Extract streak count
        const streakCount = $('.streakCnt').text().split("/");

        // Initialize values with extracted streak and coding stats
        const values = {
            userHandle: username,
            pod_solved_longest_streak: parseInt(streakCount[0].trim()) || 0,
            pod_solved_global_longest_streak: parseInt(streakCount[1].trim()) || 0,
        };

        // Extract various score stats
        $('.score_card_name').each((i, element) => {
            const name = $(element).text();
            const value = $('.score_card_value').eq(i).text();

            if (name === "Overall Coding Score") {
                values.total_score = value;
            } else if (name === "Total Problem Solved") {
                values.total_problems_solved = value;
            } else if (name === "Monthly Coding Score") {
                values.monthly_score = value;
            }
        });

        // Extract problem difficulty stats
        const problemStats = extractProblemStats($(data[0]).text());
        Object.assign(values, problemStats);

        return values;
    } catch (error) {
        console.error(`Error fetching old profile data for ${username}: ${error.message}`);
        return null;
    }
};

// Fetch data from the new GeeksForGeeks profile page
const fetchNewProfileData = async (username) => {
    try {
        const response = await axios.get(`https://www.geeksforgeeks.org/user/${username}/`);
        const $ = cheerio.load(response.data);
        const problemNavbar = $('.problemNavbar_head__cKSRi');

        if (problemNavbar.length === 0) {
            throw new Error(`User ${username} does not exist or has not solved any problems on GeeksForGeeks.`);
        }

        // Extract raw JSON string and parse it
        const rawJsonString = $('div').next().text().trim();
        const jsonData = extractJsonString(rawJsonString);

        if (!jsonData) {
            throw new Error("Failed to parse user data.");
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
            current_rating: pageProps.contestData?.current_rating || 0
        };

        // Extract problem difficulty stats
        const problemStats = extractProblemStats($(problemNavbar[0]).text());
        Object.assign(values, problemStats);

        return values;
    } catch (error) {
        console.error(`Error fetching new profile data for ${username}: ${error.message}`);
        return null;
    }
};

// Route to handle incoming requests
app.get('/', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: "Add your geeksForGeeks user Name in the URL, e.g., /?username=<YOUR_USER_NAME>" });
        }

        let values;

        // Try fetching from the new profile page
        values = await fetchNewProfileData(username);

        // If fetching from the new profile fails, try the old profile
        if (!values) {
            values = await fetchOldProfileData(username);
        }

        // If values are still null, it means both fetch attempts failed
        if (!values) {
            return res.status(404).json({ error: `Data for user ${username} not found.` });
        }

        // Calculate progress based on streaks
        values["Progress"] = values.pod_solved_global_longest_streak
            ? (100 * Math.PI * values.pod_solved_longest_streak) / values.pod_solved_global_longest_streak
            : 0;

        // Generate SVG stats and send as a response
        const svg = generateStats(values);
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "s-max-age=60, stale-while-revalidate");
        return res.send(svg);

    } catch (error) {
        console.error(`Error processing request for ${req.query.username}:`, error.message);
        res.status(500).json({ error: "An error occurred while fetching and processing the data." });
    }
});

// Start the server
const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
