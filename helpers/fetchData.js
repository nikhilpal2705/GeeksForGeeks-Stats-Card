const axios = require("axios");
const cheerio = require("cheerio");
const { extractJsonString, extractProblemStats } = require('./common');

async function fetchData(url) {
    try {
        const { data } = await axios.get(url);

        return cheerio.load(data);

    } catch (error) {
        throw new Error("Error fetching data");
    }
}


// Fetch data from the old GeeksForGeeks profile page
const fetchOldProfileData = async (username) => {
    try {
        const $ = await fetchData(`https://auth.geeksforgeeks.org/user/${username}/practice/`);
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
        const $ = await fetchData(`https://www.geeksforgeeks.org/user/${username}/`);
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

// Fetch data from the direct API
const fetchDirectProfileData = async (username) => {
    try {
        let response = await axios.get(`https://www.geeksforgeeks.org/gfg-assets/_next/data/pdjI7pIK3Y46qDCFuGJcp/user/${username}.json`)
        const jsonData = JSON.parse(JSON.stringify((response.data)));
        const pageProps = jsonData?.pageProps || {};
        const userInfo = pageProps.userInfo || {};
        const userSubmissionsInfo = pageProps.userSubmissionsInfo || {}


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

        const problemStats = {
            School: Object.keys(userSubmissionsInfo.School || {}).length || 0,
            Basic: Object.keys(userSubmissionsInfo.Basic || {}).length || 0,
            Easy: Object.keys(userSubmissionsInfo.Easy || {}).length || 0,
            Medium: Object.keys(userSubmissionsInfo.Medium || {}).length || 0,
            Hard: Object.keys(userSubmissionsInfo.Hard || {}).length || 0,
        }
        Object.assign(values, problemStats);
        return values;
    } catch (error) {
        console.error(`Error fetching profile data using api for ${username}: ${error.message}`);
        return null;
    }
}

module.exports = {
    fetchOldProfileData,
    fetchNewProfileData,
    fetchDirectProfileData
};
