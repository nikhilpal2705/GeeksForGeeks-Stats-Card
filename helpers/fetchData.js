const axios = require("axios");
const { extractJsonString, extractProblemStats } = require('./common');


// Fetch data from the new GeeksForGeeks profile page
const fetchDirectProfileData = async (username) => {
    try {
        const { data: html } = await axios.get(
            `https://www.geeksforgeeks.org/profile/${username}?tab=activity`
        );

        // Extract raw JSON string and parse it
        const userData = extractJsonString(html);

        if (!userData) {
            throw new Error("Failed to parse user data.");
        }
        const decodedUsername = decodeURIComponent(username);


        // Gather user stats
        const values = {
            userHandle: decodedUsername,
            total_score: userData.score || 0,
            monthly_score: userData.monthly_score || 0,
            total_problems_solved: userData.total_problems_solved || 0,
            pod_solved_longest_streak: userData.pod_solved_longest_streak || 0,
            pod_solved_global_longest_streak: userData.pod_solved_global_longest_streak || 0,
            pod_solved_current_streak: userData.pod_solved_current_streak || 0,
            pod_correct_submissions_count: userData.pod_correct_submissions_count || 0,
        };

        // Extract problem difficulty stats
        let response = await axios.post(
            'https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/',
            {
                handle: decodedUsername
            }
        )
        const problemStats = extractProblemStats(response.data.result);
        Object.assign(values, problemStats);

        return values;
    } catch (error) {
        console.error(`Error fetching new profile data for ${username}: ${error.message}`);
        return {};
    }
};


module.exports = {
    fetchDirectProfileData
};
