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

    let url = `https://auth.geeksforgeeks.org/user/${username}/practice/`;

    try {
        let response = await axios.get(url);
        let html = response.data;
        let $ = cheerio.load(html);

        let values = {};
        let problemDifficultyTag = ["School", "Basic", "Easy", "Medium", "Hard"];
        let k = 0;

        let data = $('.tabs.tabs-fixed-width.linksTypeProblem');

        if (data.length === 0) {
            return res.status(400).send({ error: "User does not exist or has not solved any problems on geeksforgeeks" });
        }

        let totalProblemSolved = 0;
        let rawData = $(data[0]).text();

        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i] === '(') {
                let tempStart = i + 1;

                while (rawData[i] !== ')') {
                    i++;
                }

                let tempProblems = parseInt(rawData.substring(tempStart, i));
                values[problemDifficultyTag[k++]] = tempProblems;
                totalProblemSolved += tempProblems;
            }
        }

        let streakCount = $('.streakCnt').text().split("/");
        values["currentStreak"] = parseInt(streakCount[0].trim());
        values["globalLongestStreak"] = parseInt(streakCount[1].trim());

        let scoreCardValues = $('.score_card_value');
        let scoreCardName = $('.score_card_name');

        let scoreCardArr = ["Overall Coding Score", "Total Problem Solved", "Monthly Coding Score"];

        for (let i = 0; i < scoreCardName.length; i++) {
            if ($(scoreCardName[i]).text() === scoreCardArr[0]) {
                values["TotalScore"] = $(scoreCardValues[i]).text();
            } else if ($(scoreCardName[i]).text() === scoreCardArr[1]) {
                values["TotalSolved"] = $(scoreCardValues[i]).text();
            } else if ($(scoreCardName[i]).text() === scoreCardArr[2]) {
                values["MonthSolved"] = $(scoreCardValues[i]).text();
            }
        }

        values["userName"] = username;
        values["totalProblemsSolved"] = totalProblemSolved;
        values["Progress"] = (80 * Math.PI * values["currentStreak"]) / values["globalLongestStreak"];

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
