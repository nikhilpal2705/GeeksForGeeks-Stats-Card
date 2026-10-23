const assert = require('assert');
const http = require('http');
const { extractJsonString, extractProblemStats, loadCSS, escapeSvgText } = require('../helpers/common');
const { fetchDirectProfileData, clearCache } = require('../helpers/fetchData');
const { generateSvg } = require('../helpers/svg');
const app = require('../server');

async function runTests() {
    console.log('--- Starting GeeksForGeeks Stats Card Tests ---');

    // Test 1: extractJsonString with Next.js Flight chunk format
    console.log('Test 1: extractJsonString parsing Next.js Flight chunks');
    const mockFlightHtml = `
    <!DOCTYPE html><html><body>
    <script>self.__next_f.push([1,"6:[\\"$\\",\\"$L29\\",null,{\\"articleCount\\":{\\"name\\":\\"Test User\\",\\"score\\":450,\\"monthly_score\\":10,\\"total_problems_solved\\":120,\\"pod_solved_longest_streak\\":95,\\"pod_solved_global_longest_streak\\":1900,\\"pod_solved_current_streak\\":5,\\"institute_rank\\":42},\\\"userData\\\":{\\\"message\\\":\\\"data retrieved successfully\\\",\\\"data\\\":\\\"$6:props:articleCount\\\"}}]\\n"])</script>
    </body></html>
    `;
    const parsedStats = extractJsonString(mockFlightHtml);
    assert(parsedStats !== null, 'parsedStats should not be null');
    assert.strictEqual(parsedStats.score, 450);
    assert.strictEqual(parsedStats.pod_solved_longest_streak, 95);
    assert.strictEqual(parsedStats.pod_solved_global_longest_streak, 1900);
    assert.strictEqual(parsedStats.pod_solved_current_streak, 5);
    assert.strictEqual(parsedStats.institute_rank, 42);
    console.log('✓ Test 1 passed');

    // Test 2: extractProblemStats
    console.log('Test 2: extractProblemStats');
    const mockSubmissions = {
        School: { p1: 1 },
        Basic: { p2: 1, p3: 1 },
        Easy: { p4: 1, p5: 1, p6: 1 },
        Medium: { p7: 1 },
        Hard: {}
    };
    const difficultyStats = extractProblemStats(mockSubmissions);
    assert.deepStrictEqual(difficultyStats, {
        School: 1,
        Basic: 2,
        Easy: 3,
        Medium: 1,
        Hard: 0
    });
    const emptyStats = extractProblemStats(null);
    assert.deepStrictEqual(emptyStats, { School: 0, Basic: 0, Easy: 0, Medium: 0, Hard: 0 });
    console.log('✓ Test 2 passed');

    // Test 3: escapeSvgText
    console.log('Test 3: escapeSvgText');
    assert.strictEqual(escapeSvgText('Tom & Jerry <"fun">\''), 'Tom &amp; Jerry &lt;&quot;fun&quot;&gt;&#39;');
    console.log('✓ Test 3 passed');

    // Test 4: generateSvg rendering
    console.log('Test 4: generateSvg rendering with dark and light themes');
    const mockCardData = {
        userHandle: 'testuser',
        total_score: 500,
        monthly_score: 0, // ensure 0 does not render as '_ _'
        total_problems_solved: 150,
        pod_solved_longest_streak: 85,
        pod_solved_global_longest_streak: 1900,
        pod_solved_current_streak: 10,
        School: 2,
        Basic: 8,
        Easy: 50,
        Medium: 80,
        Hard: 10,
        institute_rank: '12',
        ProgressBar: (100 * Math.PI * 85) / 1900
    };

    const darkSvg = await generateSvg(mockCardData, 'dark');
    assert(darkSvg.includes('testuser | GFG Stats Card'), 'Dark SVG should contain title');
    assert(darkSvg.includes('>85 / 1900<'), 'Dark SVG should render streak without broken newlines');
    assert(darkSvg.includes('<text id="overall-score-count">500</text>'), 'Should render score');
    assert(darkSvg.includes('<text id="month-score-count">0</text>'), 'Should render 0 instead of _ _ for monthly score');
    assert(darkSvg.includes('<text id="ranking">#12</text>'), 'Should render institute rank');

    const lightSvg = await generateSvg(mockCardData, 'light');
    assert(lightSvg.includes('testuser | GFG Stats Card'), 'Light SVG should render correctly');
    console.log('✓ Test 4 passed');

    // Test 5: fetchDirectProfileData live fetch for nikhilpal2705
    console.log('Test 5: Live fetchDirectProfileData for nikhilpal2705');
    clearCache();
    const liveData = await fetchDirectProfileData('nikhilpal2705');
    assert(liveData !== null, 'liveData should not be null');
    assert.strictEqual(liveData.userHandle, 'nikhilpal2705');
    assert(liveData.pod_solved_longest_streak > 0, `pod_solved_longest_streak should be > 0 (got ${liveData.pod_solved_longest_streak})`);
    assert(liveData.total_problems_solved > 0, `total_problems_solved should be > 0 (got ${liveData.total_problems_solved})`);
    assert(liveData.total_score > 0, `total_score should be > 0 (got ${liveData.total_score})`);
    console.log(`✓ Test 5 passed (Streak: ${liveData.pod_solved_longest_streak}/${liveData.pod_solved_global_longest_streak}, Problems: ${liveData.total_problems_solved}, Score: ${liveData.total_score})`);

    // Test 6: In-memory cache
    console.log('Test 6: In-memory cache verification');
    const t0 = Date.now();
    const cachedData = await fetchDirectProfileData('nikhilpal2705');
    const cacheElapsed = Date.now() - t0;
    assert.deepStrictEqual(cachedData, liveData);
    assert(cacheElapsed < 50, `Cache hit should take < 50ms (took ${cacheElapsed}ms)`);
    console.log(`✓ Test 6 passed (Cache hit returned in ${cacheElapsed}ms)`);

    // Test 7: HTTP endpoints via local server
    console.log('Test 7: HTTP server endpoints');
    const server = http.createServer(app);
    await new Promise(resolve => server.listen(0, resolve));
    const port = server.address().port;

    try {
        // Landing page
        const landingRes = await fetch(`http://localhost:${port}/`);
        assert.strictEqual(landingRes.status, 200);
        const landingText = await landingRes.text();
        assert(landingText.includes('GeeksforGeeks Stats Card'), 'Landing page should render title');

        // Raw stats API
        const rawRes = await fetch(`http://localhost:${port}/nikhilpal2705?raw=true`);
        assert.strictEqual(rawRes.status, 200);
        const rawJson = await rawRes.json();
        assert.strictEqual(rawJson.userHandle, 'nikhilpal2705');
        assert(rawJson.pod_solved_longest_streak > 0, 'raw streak should be > 0');

        // SVG stats API
        const svgRes = await fetch(`http://localhost:${port}/nikhilpal2705`);
        assert.strictEqual(svgRes.status, 200);
        assert(svgRes.headers.get('content-type').includes('image/svg+xml'), 'Content-Type should be image/svg+xml');
        const svgBody = await svgRes.text();
        assert(svgBody.includes('nikhilpal2705'), 'SVG should contain username');
        assert(svgBody.includes(`${rawJson.pod_solved_longest_streak} / ${rawJson.pod_solved_global_longest_streak}`), 'SVG should contain streak');

        // Static file exclusion (e.g. robots.txt should 404, not treat as username)
        const static404 = await fetch(`http://localhost:${port}/robots.txt`);
        assert.strictEqual(static404.status, 404);

        // Non-existent user
        const nonExistentRes = await fetch(`http://localhost:${port}/user_definitely_not_exist_xyz123_404`);
        assert.strictEqual(nonExistentRes.status, 404);

        console.log('✓ Test 7 passed');
    } finally {
        await new Promise(resolve => server.close(resolve));
    }

    console.log('\nAll 7 tests passed successfully!');
}

runTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
