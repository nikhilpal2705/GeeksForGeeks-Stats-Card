const { fetchDirectProfileData } = require('../helpers/fetchData');
const { generateSvg } = require('../helpers/svg');

const setStatsCacheHeaders = (res) => {
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
};

const getCard = async (req, res, next) => {
    try {
        const username = req.params.username || req.query.username;
        const theme = req.query.theme;
        const raw = req.query.raw;
        if (!username) {
            return next();
        }

        const values = await fetchDirectProfileData(username);

        // If values are still null, it means both fetch attempts failed
        if (!values) {
            res.setHeader("Cache-Control", "no-store");
            return res.status(404).json({
                error: `Data for user '${username}' not found.`,
            });
        }

        // Calculate progress based on streaks
        values["ProgressBar"] = values.pod_solved_global_longest_streak
            ? (100 * Math.PI * values.pod_solved_longest_streak) / values.pod_solved_global_longest_streak
            : 0;

        if (raw === "true") {
            setStatsCacheHeaders(res);
            return res.json(values)
        }
        // Generate SVG stats and send as a response
        const svg = await generateSvg(values, theme);
        res.setHeader("Content-Type", "image/svg+xml");
        setStatsCacheHeaders(res);
        return res.send(svg);

    } catch (error) {
        const requestedUsername = req.params.username || req.query.username;
        console.error(`Error processing request for ${requestedUsername}:`, error.message);
        res.setHeader("Cache-Control", "no-store");
        return res.status(500).json({
            error: "An error occurred while fetching and processing the data.",
        });
    }
};


const notFound = async (req, res) => {
    return res.status(404).send("404 - Not Found.");
};


module.exports = {
    getCard,
    notFound,
};
