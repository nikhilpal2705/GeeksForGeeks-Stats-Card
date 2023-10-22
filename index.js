import express, { raw } from 'express';
import request from 'request';
import cheerio from 'cheerio';
import generateStats from './svg.js';
const app = express();

app.get('/', function (req, res) {
    let userName = req.query.userName;
    if (!userName) {
        let errorMessage = { "error": "add your geeksForGeeks user Name in link eg /?userName=<YOUR_USER_NAME>" };
        res.send(errorMessage);
    } else {
        let url = "https://auth.geeksforgeeks.org/user/" + userName + "/practice/";
        request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
                let values = {};
                let problemDificultyTag = ["School", "Basic", "Easy", "Medium", "Hard"];
                let k = 0;
                // GFG updated UI
                let data = $('.tabs.tabs-fixed-width.linksTypeProblem');
                if (data.length == 0) {
                    res.status(400).send({ error: "userName does not exist or not solved any problem on geeksforgeeks" });
                } else {
                    let totalProblemSolved = 0;

                    let rawData = $(data[0]).text();
                    for (let i = 0; i < rawData.length; i++) {
                        if (rawData[i] == '(') {
                            let tempStart = i + 1;
                            while (rawData[i] != ')') {
                                i++;
                            }
                            let tempProblems = parseInt(rawData.substring(tempStart, i));
                            values[problemDificultyTag[k++]] = tempProblems;
                            totalProblemSolved += tempProblems;

                        }
                    }

                    let streakCount = $('.streakCnt').text().split("/")
                    values["currentStreak"] = parseInt(streakCount[0].trim())
                    values["globalLongestStreak"] = parseInt(streakCount[1].trim())

                    let scoreCardValues = $('.score_card_value')
                    let scoreCardName = $('.score_card_name')

                    let scoreCardArr = ["Overall Coding Score", "Total Problem Solved", "Monthly Coding Score"]
                    for (let i = 0; i < scoreCardName.length; i++) {
                        if ($(scoreCardName[i]).text() == scoreCardArr[0]) {
                            values["TotalScore"] = $(scoreCardValues[i]).text()
                        } else if ($(scoreCardName[i]).text() == scoreCardArr[1]) {
                            values["TotalSolved"] = $(scoreCardValues[i]).text()
                        } else if ($(scoreCardName[i]).text() == scoreCardArr[2]) {
                            values["MonthSolved"] = $(scoreCardValues[i]).text()
                        }
                    }


                    values["userName"] = userName;
                    values["totalProblemsSolved"] = totalProblemSolved;
                    values["Progress"] = 80 * Math.PI * values["currentStreak"] / values["globalLongestStreak"]

                    let svg = generateStats(values);
                    res.setHeader("Content-Type", "image/svg+xml");
                    res.setHeader("Cache-Control", "s-max-age=60, stale-while-revalidate");
                    res.send(svg);
                }
            } else {
                console.log(error);
            }

        });
    }
});


const port = process.env.PORT || 2001;
app.listen(port, () =>
    console.log(`Server running on ${port}, http://localhost:${port}`)
);

export default app;