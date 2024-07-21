import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import generateStats from './svg.js';

const app = express();

app.get('/', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        let errorMessage = { error: "Add your geeksForGeeks user Name in the URL, e.g., /?username=<YOUR_USER_NAME>" };
        return res.send(errorMessage);
    }

    let url = `https://www.geeksforgeeks.org/user/${username}/`;

    try {
        let response = await axios.get(url);
        let html = response.data;
        let $ = cheerio.load(html);

        let values = {};
        let problemDifficultyTag = ["School", "Basic", "Easy", "Medium", "Hard"];
        let k = 0;

        let problemNavbar = $('.problemNavbar_head__cKSRi');
        let scoreCardName = $('.scoreCard_head_card_left--text__hs9G4');
        let scoreCardValues = $('.scoreCard_head_card_left--score__pC6ZA');
        let streakCount = $('.circularProgressBar_head_mid_streakCnt__MFOF1').text().split("/");

        if (problemNavbar.length === 0) {
            return res.status(400).send({ error: "User does not exist or has not solved any problems on geeksforgeeks" });
        }

        let totalProblemSolved = 0;
        let rawData = $(problemNavbar[0]).text();

        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i] === '(') {
                let tempStart = i + 1;

                while (rawData[i] !== ')') {
                    i++;
                }

                let tempProblems = parseInt(rawData.substring(tempStart, i)) ?? 0;
                values[problemDifficultyTag[k++]] = tempProblems;
                totalProblemSolved += tempProblems;
            }
        }

        values["currentStreak"] = parseInt(streakCount[0]?.trim()) ?? 0;
        values["globalLongestStreak"] = parseInt(streakCount[1]?.trim()) ?? 0;


        let scoreCardArr = ["Overall Coding Score", "Total Problem Solved", "Monthly Coding Score"];

        for (let i = 0; i < scoreCardName.length; i++) {
            if ($(scoreCardName[i]).text() === scoreCardArr[0]) {
                values["TotalScore"] = $(scoreCardValues[i]).text() ?? 0;
            } else if ($(scoreCardName[i]).text() === scoreCardArr[1]) {
                values["TotalSolved"] = $(scoreCardValues[i]).text() ?? 0;
            } else if ($(scoreCardName[i]).text() === scoreCardArr[2]) {
                values["MonthScore"] = $(scoreCardValues[i]).text() ?? 0;
            }
        }

        values["userName"] = username;
        values["totalProblemsSolved"] = totalProblemSolved;
        // 100 is the diameter of the progress circle
        values["Progress"] = (100 * Math.PI * values["currentStreak"]) / values["globalLongestStreak"];

        const svg = generateStats(values);
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "s-max-age=60, stale-while-revalidate");
        res.send(svg);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while fetching and processing the data." });
    }
});

const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server running on ${port}, http://localhost:${port}`);
});
