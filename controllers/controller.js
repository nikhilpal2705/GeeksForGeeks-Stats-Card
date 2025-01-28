const { fetchNewProfileData, fetchOldProfileData } = require('../helpers/fetchData');
const { generateSvg } = require('../helpers/svg');
const path = require('path');

const getCard = async (req, res, next) => {
    try {
        const username = req.params.username || req.query.username;;
        const theme = req.query.theme;
        const raw = req.query.raw;
        if (!username) {
            return next();
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
            return res.status(404).json(`Data for user '${username}' not found.`);
        }

        // Calculate progress based on streaks
        values["ProgressBar"] = values.pod_solved_global_longest_streak
            ? (100 * Math.PI * values.pod_solved_longest_streak) / values.pod_solved_global_longest_streak
            : 0;

        if (raw === "true") {
            return res.json(values)
        }
        // Generate SVG stats and send as a response
        const svg = await generateSvg(values, theme);
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "s-max-age=60, stale-while-revalidate");
        return res.send(svg);

    } catch (error) {
        console.error(`Error processing request for ${req.query.username}:`, error.message);
        res.status(500).json("An error occurred while fetching and processing the data.");
    }
}

const getDemo = async (req, res) => {
    try {
        const demoFilePath = path.join(__dirname, '../pages/demo.html');
        // Send the HTML file
        res.sendFile(demoFilePath);
    } catch (error) {
        res.status(500).send('An error occurred while loading the demo page.');
    }
};

const notFound = async (req, res) => {
    res.send("404 - Not Found.");
};


module.exports = {
    getCard,
    getDemo,
    notFound
}