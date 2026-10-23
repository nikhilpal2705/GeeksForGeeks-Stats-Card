const axios = require("axios");
const { extractJsonString, extractProblemStats } = require('./common');

const GFG_AXIOS_OPTIONS = {
    timeout: 10000,
    headers: {
        "User-Agent": "GeeksForGeeks-Stats-Card",
    },
};

// In-memory cache with 5-minute TTL to optimize repeat requests and absorb traffic spikes
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const profileCache = new Map();

const getFromCache = (key) => {
    const cached = profileCache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > PROFILE_CACHE_TTL_MS) {
        profileCache.delete(key);
        return null;
    }
    return cached.data;
};

const setInCache = (key, data) => {
    if (profileCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = profileCache.keys().next().value;
        if (oldestKey) profileCache.delete(oldestKey);
    }
    profileCache.set(key, { timestamp: Date.now(), data });
};

const clearCache = () => {
    profileCache.clear();
};

// Fetch data from GeeksForGeeks profile page and practice API in parallel
const fetchDirectProfileData = async (username) => {
    try {
        const decodedUsername = decodeURIComponent(username).trim();
        const cacheKey = decodedUsername.toLowerCase();

        const cached = getFromCache(cacheKey);
        if (cached) {
            return JSON.parse(JSON.stringify(cached));
        }

        const encodedUsername = encodeURIComponent(decodedUsername);

        // Fetch profile HTML and difficulty submissions in parallel
        const [profileResult, submissionsResult] = await Promise.allSettled([
            axios.get(
                `https://www.geeksforgeeks.org/profile/${encodedUsername}?tab=activity`,
                GFG_AXIOS_OPTIONS
            ),
            axios.post(
                'https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/',
                { handle: decodedUsername },
                GFG_AXIOS_OPTIONS
            ),
        ]);

        if (profileResult.status !== 'fulfilled') {
            console.error(`Error fetching profile for ${decodedUsername}:`, profileResult.reason?.message);
            return null;
        }

        const html = profileResult.value.data;
        const userData = extractJsonString(html);

        if (!userData) {
            return null;
        }

        const longestStreak = Number(userData.pod_solved_longest_streak) || 0;
        let globalLongestStreak = Number(userData.pod_solved_global_longest_streak) || 0;
        if (longestStreak > globalLongestStreak) {
            globalLongestStreak = longestStreak;
        }

        // Gather user stats
        const values = {
            userHandle: decodedUsername,
            userName: userData.name || decodedUsername,
            total_score: Number(userData.score) || 0,
            monthly_score: Number(userData.monthly_score) || 0,
            total_problems_solved: Number(userData.total_problems_solved) || 0,
            pod_solved_longest_streak: longestStreak,
            pod_solved_global_longest_streak: globalLongestStreak,
            pod_solved_current_streak: Number(userData.pod_solved_current_streak) || 0,
            pod_correct_submissions_count: Number(userData.pod_correct_submissions_count) || 0,
            institute_rank: userData.institute_rank ? String(userData.institute_rank).trim() : '',
        };

        // Extract problem difficulty stats if available
        if (submissionsResult.status === 'fulfilled' && submissionsResult.value.data?.result) {
            const problemStats = extractProblemStats(submissionsResult.value.data.result);
            Object.assign(values, problemStats);
        } else {
            Object.assign(values, {
                School: 0,
                Basic: 0,
                Easy: 0,
                Medium: 0,
                Hard: 0,
            });
        }

        // Fallback: if total_problems_solved is 0 from profile, sum difficulty breakdown
        if (!values.total_problems_solved) {
            values.total_problems_solved =
                (values.School || 0) +
                (values.Basic || 0) +
                (values.Easy || 0) +
                (values.Medium || 0) +
                (values.Hard || 0);
        }

        setInCache(cacheKey, values);
        return values;
    } catch (error) {
        console.error(`Error fetching profile data for ${username}: ${error.message}`);
        return null;
    }
};

module.exports = {
    fetchDirectProfileData,
    clearCache,
};
