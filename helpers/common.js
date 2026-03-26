const fs = require('fs/promises');

// Helper function to extract and parse JSON from a string
const extractJsonString = (html) => {
    try {
        const key = '\\"userData\\":';
        const startIndex = html.indexOf(key);
        if (startIndex === -1) throw new Error("userData not found");

        let i = startIndex + key.length;

        // Find the first opening brace for the JSON object.
        while (i < html.length && html[i] !== '{') i++;
        if (i >= html.length) {
            throw new Error("userData JSON start not found");
        }

        const jsonStart = i;
        let braceCount = 0;
        let endIndex = -1;
        let inString = false;
        let isEscaped = false;

        while (i < html.length) {
            const char = html[i];

            if (isEscaped) {
                isEscaped = false;
            } else if (char === '\\') {
                isEscaped = true;
            } else if (char === '"') {
                inString = !inString;
            } else if (!inString) {
                if (char === '{') braceCount++;
                if (char === '}') braceCount--;

                if (braceCount === 0) {
                    endIndex = i + 1;
                    break;
                }
            }

            i++;
        }

        if (endIndex === -1) {
            throw new Error("userData JSON end not found");
        }

        let jsonText = html.slice(jsonStart, endIndex);
        jsonText = jsonText.replace(/\\"/g, '"');
        const userData = JSON.parse(jsonText);
        return userData?.data ?? null;
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
};

// Helper function to extract problem stats based on difficulty
const extractProblemStats = (result) => {
    if (!result || typeof result !== "object") {
        return {
            School: 0,
            Basic: 0,
            Easy: 0,
            Medium: 0,
            Hard: 0,
        };
    }

    const counts = Object.fromEntries(
        Object.entries(result).map(([key, value]) => [
            key,
            value && typeof value === "object" ? Object.keys(value).length : 0,
        ])
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
    return fs.readFile(cssFilePath, 'utf-8');
};

const escapeSvgText = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");



module.exports = {
    extractJsonString,
    extractProblemStats,
    loadCSS,
    escapeSvgText,
};
