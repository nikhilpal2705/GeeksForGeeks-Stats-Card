const fs = require('fs');

// Helper function to extract and parse JSON from a string
const extractJsonString = (html) => {
    try {
        const key = '\\"userData\\":';
        const startIndex = html.indexOf(key);
        if (startIndex === -1) throw new Error("userData not found");

        let i = startIndex + key.length;

        // find the first {
        while (html[i] !== '{') i++;

        const jsonStart = i;

        let braceCount = 0;
        let endIndex = i;

        while (i < html.length) {
            if (html[i] === '{') braceCount++;
            else if (html[i] === '}') braceCount--;

            if (braceCount === 0) {
                endIndex = i + 1;
                break;
            }
            i++;
        }

        let jsonText = html.slice(jsonStart, endIndex);
        // unescape \" → "
        jsonText = jsonText.replace(/\\"/g, '"');
        const userData = JSON.parse(jsonText)
        return userData.data;
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
};

// Helper function to extract problem stats based on difficulty
const extractProblemStats = (result) => {
    const counts = Object.fromEntries(
        Object.entries(result).map(([key, value]) => [key, Object.keys(value).length])
    );

    const problemStats = {
        School: counts.School || 0,
        Basic: counts.Basic || 0,
        Easy: counts.Easy || 0,
        Medium: counts.Medium || 0,
        Hard: counts.Hard || 0,
    }
    return problemStats;
};
const loadCSS = (cssFilePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(cssFilePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};



module.exports = {
    extractJsonString,
    extractProblemStats,
    loadCSS
}