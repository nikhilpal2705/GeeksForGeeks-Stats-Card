const { fetchDirectProfileData } = require('../helpers/fetchData');
const { generateSvg } = require('../helpers/svg');

const setStatsCacheHeaders = (res) => {
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
};

const STATIC_EXT_REGEX = /\.(ico|png|jpg|jpeg|gif|svg|css|js|json|txt|xml|map|woff|woff2)$/i;

const getCard = async (req, res, next) => {
    try {
        const username = req.params.username || req.query.username;
        const theme = req.query.theme;
        const raw = req.query.raw;
        const streakType = (req.query.streak || req.query.streak_type || '').toLowerCase();

        if (!username || typeof username !== 'string' || !username.trim()) {
            return next();
        }

        const trimmedUser = username.trim();

        // Reject static asset requests captured by /:username route
        if (STATIC_EXT_REGEX.test(trimmedUser)) {
            res.setHeader("Cache-Control", "no-store");
            return res.status(404).send("404 - Not Found.");
        }

        const values = await fetchDirectProfileData(trimmedUser);

        // If values are null, it means fetch attempts failed or user does not exist
        if (!values) {
            res.setHeader("Cache-Control", "no-store");
            return res.status(404).json({
                error: `Data for user '${trimmedUser}' not found.`,
            });
        }

        // Determine which streak to highlight (longest by default, or current if requested)
        const isCurrentStreak = streakType === 'current';
        const activeStreak = isCurrentStreak ? values.pod_solved_current_streak : values.pod_solved_longest_streak;
        values.streak = activeStreak;
        values.streak_type = isCurrentStreak ? 'current' : 'longest';

        // Calculate progress based on streaks safely
        const globalStreak = values.pod_solved_global_longest_streak;
        values.ProgressBar = globalStreak > 0
            ? Math.min(100 * Math.PI, (100 * Math.PI * activeStreak) / globalStreak)
            : 0;

        if (raw === "true") {
            setStatsCacheHeaders(res);
            return res.json(values);
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
