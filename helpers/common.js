const fs = require('fs/promises');

// In-memory cache for static CSS files to eliminate redundant disk I/O on every request
const cssCache = new Map();

const findStatsObject = (obj, depth = 0) => {
    if (!obj || typeof obj !== 'object' || depth > 15) return null;
    if ('pod_solved_longest_streak' in obj || ('total_problems_solved' in obj && 'score' in obj)) {
        return obj;
    }
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (val && typeof val === 'object') {
            const found = findStatsObject(val, depth + 1);
            if (found) return found;
        }
    }
    return null;
};

// Helper function to extract and parse JSON from GFG profile HTML
const extractJsonString = (html) => {
    if (!html || typeof html !== 'string') return null;

    try {
        // Strategy 1: Next.js Flight chunks (App Router RSC payload)
        const flightRegex = /self\.__next_f\.push\(\[\s*1\s*,\s*"([\s\S]*?)"\s*\]\)/g;
        let match;
        while ((match = flightRegex.exec(html)) !== null) {
            const rawChunk = match[1];
            if (
                rawChunk.includes('pod_solved_longest_streak') ||
                (rawChunk.includes('total_problems_solved') && rawChunk.includes('score'))
            ) {
                try {
                    const decoded = JSON.parse(`"${rawChunk}"`);
                    const colonIdx = decoded.indexOf(':');
                    if (colonIdx !== -1) {
                        const jsonText = decoded.slice(colonIdx + 1);
                        const parsed = JSON.parse(jsonText);
                        const stats = findStatsObject(parsed);
                        if (stats) return stats;
                    }
                } catch (e) {
                    // Try next chunk if this one fails to parse
                }
            }
        }

        // Strategy 2: Direct scan for the JSON object enclosing pod_solved_longest_streak or total_problems_solved
        const targetKeys = ['pod_solved_longest_streak', 'total_problems_solved'];
        for (const targetKey of targetKeys) {
            let keyIdx = html.indexOf(targetKey);
            while (keyIdx !== -1) {
                let braceStart = -1;
                for (let i = keyIdx; i >= 0; i--) {
                    if (html[i] === '{' && (i === 0 || html[i - 1] !== '\\')) {
                        braceStart = i;
                        break;
                    }
                }

                if (braceStart !== -1) {
                    let depth = 0;
                    let inStr = false;
                    let esc = false;
                    let endIdx = -1;
                    for (let i = braceStart; i < html.length; i++) {
                        const c = html[i];
                        if (esc) {
                            esc = false;
                            continue;
                        }
                        if (c === '\\') {
                            esc = true;
                            continue;
                        }
                        if (c === '"') {
                            inStr = !inStr;
                            continue;
                        }
                        if (!inStr) {
                            if (c === '{') depth++;
                            else if (c === '}') {
                                depth--;
                                if (depth === 0) {
                                    endIdx = i + 1;
                                    break;
                                }
                            }
                        }
                    }

                    if (endIdx !== -1) {
                        try {
                            let jsonText = html.slice(braceStart, endIdx).replace(/\\"/g, '"');
                            const parsed = JSON.parse(jsonText);
                            const stats = findStatsObject(parsed);
                            if (stats) return stats;
                        } catch (e) {
                            // Continue searching
                        }
                    }
                }

                keyIdx = html.indexOf(targetKey, keyIdx + targetKey.length);
            }
        }

        // Strategy 3: Legacy \"userData\": fallback if data is an object
        const legacyKey = '\\"userData\\":';
        const legacyIdx = html.indexOf(legacyKey);
        if (legacyIdx !== -1) {
            let i = legacyIdx + legacyKey.length;
            while (i < html.length && html[i] !== '{') i++;
            if (i < html.length) {
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

                if (endIndex !== -1) {
                    let jsonText = html.slice(jsonStart, endIndex).replace(/\\"/g, '"');
                    const userData = JSON.parse(jsonText);
                    const stats = findStatsObject(userData);
                    if (stats) return stats;
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
};

// Helper function to extract problem stats based on difficulty
const extractProblemStats = (result) => {
    if (!result || typeof result !== 'object') {
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
            value && typeof value === 'object' ? Object.keys(value).length : 0,
        ])
    );

    return {
        School: counts.School || 0,
        Basic: counts.Basic || 0,
        Easy: counts.Easy || 0,
        Medium: counts.Medium || 0,
        Hard: counts.Hard || 0,
    };
};

const loadCSS = async (cssFilePath) => {
    if (cssCache.has(cssFilePath)) {
        return cssCache.get(cssFilePath);
    }
    const content = await fs.readFile(cssFilePath, 'utf-8');
    cssCache.set(cssFilePath, content);
    return content;
};

const escapeSvgText = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

module.exports = {
    findStatsObject,
    extractJsonString,
    extractProblemStats,
    loadCSS,
    escapeSvgText,
};
