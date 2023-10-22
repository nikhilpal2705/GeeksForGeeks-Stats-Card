const generateStats = (data) => {
    return (`<svg width="500" height="400" viewBox="0 0 500 400" version="1.1" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink" id="root">
<title id="_bq">${data.userName} | GFG Stats Card</title>
<style id="default-colors">
    svg {
        opacity: 0
    }

    :root {
        --bg-0: #fff;
        --bg-1: #e5e5e5;
        --bg-2: #d3d3d3;
        --bg-3: #d3d3d3;
        --bg-4: #E2FFE9;
        --text-0: #000;
        --text-1: #808080;
        --text-2: #808080;
        --text-3: #808080;
        --text-4: #E2FFE9;
        --color-0: #ffa116;
        --color-1: #5cb85c;
        --color-2: #f0ad4e;
        --color-3: #d9534f;
        --color-4: #2F8D46;
    }
</style>
<rect id="background" />
<g id="icon">
    <g id="_1a">
        <svg fill="#26a269" width="128px" height="128px" viewBox="-0.48 -0.48 24.96 24.96" role="img"
            xmlns="http://www.w3.org/2000/svg" stroke="#26a269" stroke-width="0.00024000000000000003">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z">
                </path>
            </g>
        </svg>
    </g>
</g><a href="https://auth.geeksforgeeks.org/user/${data.userName}/practice/" target="_blank" id="username"><text
        id="username-text">${data.userName}</text></a><text id="ranking">${''}</text>
<g id="total-streak">
    <circle id="total-streak-bg" />
    <circle id="total-streak-ring" /><text id="total-streak-text">${data.currentStreak} /${data.globalLongestStreak}</text>
    <text id="streak-text">STREAK</text>
    <text id="days-text">days</text>
</g>
<g id="solved">
    <g id="school-solved"><text id="school-solved-type">School</text><text
            id="school-solved-count">${data.School}</text>
    </g>
    <g id="basic-solved"><text id="basic-solved-type">Basic</text><text id="basic-solved-count">${data.Basic}</text>
    </g>
    <g id="easy-solved"><text id="easy-solved-type">Easy</text><text id="easy-solved-count">${data.Easy}</text>
    </g>
    <g id="medium-solved"><text id="medium-solved-type">Medium</text><text
            id="medium-solved-count">${data.Medium}</text>
    </g>
    <g id="hard-solved"><text id="hard-solved-type">Hard</text><text id="hard-solved-count">${data.Hard}</text>
    </g>
</g>
<g id="total-activity">
    <line x1="10" y1="0" x2="490" y2="0" id="_1b" />
    <line x1="0" y1="0" x2="0" y2="64" id="_1c" />
    <line x1="0" y1="0" x2="0" y2="64" id="_1d" />
    <g id="overall-score">
        <text id="overall-score-title">Overall Coding Score</text><text id="overall-score-count">${data.TotalScore ? data.TotalScore : '_ _'}</text>
    </g>
    <g id="total-solved">
        <text id="total-solved-title">Total Problem Solved</text><text id="total-solved-count">${data.TotalSolved ? data.TotalSolved : '_ _'}</text>
    </g>
    <g id="month-solved">
        <text id="month-solved-title">Monthly Coding Score</text><text id="month-solved-count">${data.MonthSolved ? data.MonthSolved : '_ _'}</text>
    </g>
</g>
<style id="_lx">
    @namespace svg url(http://www.w3.org/2000/svg);

    #root {
        fill: none
    }

    #background {
        transform: translate(0.5px, 0.5px);
        stroke: var(--bg-2);
        fill: var(--bg-0);
        stroke-width: 1;
        width: 499px;
        height: 319px;
        rx: 4px
    }

    #icon {
        transform: translate(20px, 15px) scale(0.27)
    }

    #_1a {
        stroke: none;
        fill: var(--text-0);
        fill-rule: evenodd
    }

    #username {
        transform: translate(65px, 40px)
    }

    #username-text {
        fill: var(--text-0);
        font-size: 24px;
        font-weight: bold
    }

    #ranking {
        transform: translate(480px, 40px);
        fill: var(--text-1);
        font-size: 18px;
        font-weight: bold;
        text-anchor: end
    }

    #total-streak {
        transform: translate(30px, 100px)
    }

    #total-streak-bg {
        cx: 40px;
        cy: 40px;
        r: 45px;
        stroke: var(--bg-4);
        stroke-width: 7px;
    }

    #total-streak-ring {
        cx: 40px;
        cy: 40px;
        r: 45px;
        transform: rotate(-90deg);
        transform-origin: 40px 40px;
        stroke-dasharray: ${data.Progress} 1000;
        stroke: var(--color-4);
        stroke-width: 7px;
        stroke-linecap: round;
    }

    #total-streak-text {
        transform: translate(40px, 40px);
        font-size: 20px;
        alignment-baseline: central;
        dominant-baseline: central;
        text-anchor: middle;
        fill: var(--text-0);
        font-weight: bold;
    }

    #streak-text {
        transform: translate(40px, 15px);
        font-size: 12px;
        alignment-baseline: central;
        dominant-baseline: central;
        text-anchor: middle;
        fill: var(--text-4);
    }

    #days-text {
        transform: translate(40px, 60px);
        font-size: 12px;
        alignment-baseline: central;
        dominant-baseline: central;
        text-anchor: middle;
        fill: var(--text-4);
    }


    #solved {
        transform: translate(160px, 90px)
    }

    #school-solved {
        transform: translate(0, 0px)
    }

    #school-solved-type {
        fill: var(--text-0);
        font-size: 18px;
        font-weight: bold;
    }

    #school-solved-count {
        transform: translate(300px, 0px);
        fill: var(--text-1);
        font-size: 16px;
        font-weight: bold;
        text-anchor: end;
    }

    #basic-solved {
        transform: translate(0, 30px)
    }

    #basic-solved-type {
        fill: var(--text-0);
        font-size: 18px;
        font-weight: bold;
    }

    #basic-solved-count {
        transform: translate(300px, 0px);
        fill: var(--text-1);
        font-size: 16px;
        font-weight: bold;
        text-anchor: end;
    }

    #easy-solved {
        transform: translate(0, 60px)
    }

    #easy-solved-type {
        fill: var(--text-0);
        font-size: 18px;
        font-weight: bold;
    }

    #easy-solved-count {
        transform: translate(300px, 0px);
        fill: var(--text-1);
        font-size: 16px;
        font-weight: bold;
        text-anchor: end;
    }

    #medium-solved {
        transform: translate(0, 90px)
    }

    #medium-solved-type {
        fill: var(--text-0);
        font-size: 18px;
        font-weight: bold;
    }

    #medium-solved-count {
        transform: translate(300px, 0px);
        fill: var(--text-1);
        font-size: 16px;
        font-weight: bold;
        text-anchor: end;
    }

    #hard-solved {
        transform: translate(0, 120px)
    }

    #hard-solved-type {
        fill: var(--text-0);
        font-size: 18px;
        font-weight: bold;
    }

    #hard-solved-count {
        transform: translate(300px, 0px);
        fill: var(--text-1);
        font-size: 16px;
        font-weight: bold;
        text-anchor: end;
    }

    #total-activity {
        transform: translate(0px, 240px)
    }

    #_1b {
        stroke: var(--bg-1);
        stroke-width: 1.5
    }

    #overall-score {
        transform: translate(90px, 20px);
        text-anchor: middle;
    }

    #overall-score-title {
        fill: var(--text-1);
        font-size: 0.9rem;
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    #overall-score-count {
        transform: translate(0px, 35px);
        fill: var(--text-0);
        font-size: 2rem;
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    #total-solved {
        transform: translate(250px, 20px);
        text-anchor: middle;
    }

    #total-solved-title {
        fill: var(--text-1);
        font-size: 0.9rem;
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    #total-solved-count {
        transform: translate(0px, 35px);
        fill: var(--text-0);
        font-size: 2rem;
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    #month-solved {
        transform: translate(410px, 20px);
        text-anchor: middle;
    }

    #month-solved-title {
        fill: var(--text-1);
        font-size: 0.9rem;
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    #month-solved-count {
        transform: translate(0px, 35px);
        fill: var(--text-0);
        font-size: 2rem;
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    #_1c {
        stroke: var(--bg-1);
        stroke-width: 1;
        transform: translate(170px, 8px);
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    #_1d {
        stroke: var(--bg-1);
        stroke-width: 1;
        transform: translate(324px, 8px);
        opacity: 0;
        animation: fade_in 1 0.3s 1.7s forwards
    }

    @font-face {
        font-family: "Baloo 2";
        src: url("data:font/woff2;charset=utf-8;base64,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") format("woff2")
    }

    * {
        font-family: "Baloo 2"
    }

    @keyframes fade_in {
        from {
            opacity: 0
        }

        to {
            opacity: 1
        }
    }

    #icon {
        opacity: 0;
        animation: fade_in 0.3s ease 0.00s 1 forwards
    }

    #username {
        opacity: 0;
        animation: fade_in 0.3s ease 0.10s 1 forwards
    }

    #ranking {
        opacity: 0;
        animation: fade_in 0.3s ease 0.20s 1 forwards
    }

    #total-streak-bg {
        opacity: 0;
        animation: fade_in 0.3s ease 0.30s 1 forwards
    }

    #total-streak-ring {
        opacity: 0;
        animation: fade_in 0.3s ease 0.40s 1 forwards
    }

    #total-streak-text {
        opacity: 0;
        animation: fade_in 0.3s ease 0.50s 1 forwards
    }

    #streak-text {
        opacity: 0;
        animation: fade_in 0.3s ease 0.50s 1 forwards
    }

    #days-text {
        opacity: 0;
        animation: fade_in 0.3s ease 0.50s 1 forwards
    }

    #school-solved-type {
        opacity: 0;
        animation: fade_in 0.3s ease 0.20s 1 forwards
    }

    #school-solved-count {
        opacity: 0;
        animation: fade_in 0.3s ease 0.30s 1 forwards
    }

    #basic-solved-type {
        opacity: 0;
        animation: fade_in 0.3s ease 0.50s 1 forwards
    }

    #basic-solved-count {
        opacity: 0;
        animation: fade_in 0.3s ease 0.60s 1 forwards
    }

    #easy-solved-type {
        opacity: 0;
        animation: fade_in 0.3s ease 0.80s 1 forwards
    }

    #easy-solved-count {
        opacity: 0;
        animation: fade_in 0.3s ease 0.90s 1 forwards
    }

    #medium-solved-type {
        opacity: 0;
        animation: fade_in 0.3s ease 1.10s 1 forwards
    }

    #medium-solved-count {
        opacity: 0;
        animation: fade_in 0.3s ease 1.20s 1 forwards
    }

    #hard-solved-type {
        opacity: 0;
        animation: fade_in 0.3s ease 1.40s 1 forwards
    }

    #hard-solved-count {
        opacity: 0;
        animation: fade_in 0.3s ease 1.50s 1 forwards
    }

    @keyframes circle_293 {
        0% {
            opacity: 0;
            stroke-dasharray: 0 1000
        }

        50% {
            opacity: 1
        }

        100% {
            opacity: 1;
            stroke-dasharray: ${data.Progress} 10000
        }
    }

    #total-streak-ring {
        animation: circle_293 1.2s ease 0.7s 1 forwards
    }

    :root {
        --bg-0: #101010;
        --bg-1: #404040;
        --bg-2: #404040;
        --bg-3: #404040;
        --bg-4: #E2FFE9;
        --text-0: #f0f0f0;
        --text-1: #dcdcdc;
        --text-2: #dcdcdc;
        --text-3: #dcdcdc;
        --text-4: #E2FFE9;
        --color-0: #ffa116;
        --color-1: #5cb85c;
        --color-2: #f0ad4e;
        --color-3: #d9534f;
        --color-4: #2F8D46;
    }

    #background {
        fill: var(--bg-0)
    }

    #total-streak-bg {
        stroke: var(--bg-4)
    }

    #username {
        fill: var(--text-0)
    }

    #username-text {
        fill: var(--text-0)
    }

    #total-streak-text {
        fill: var(--text-0)
    }

    #streak-text {
        fill: var(--text-4)
    }

    #days-text {
        fill: var(--text-4)
    }

    #school-solved-type {
        fill: var(--text-0)
    }

    #basic-solved-type {
        fill: var(--text-0)
    }

    #easy-solved-type {
        fill: var(--text-0)
    }

    #medium-solved-type {
        fill: var(--text-0)
    }

    #hard-solved-type {
        fill: var(--text-0)
    }

    #ranking {
        fill: var(--text-1)
    }

    #school-solved-count {
        fill: var(--text-1)
    }

    #basic-solved-count {
        fill: var(--text-1)
    }

    #easy-solved-count {
        fill: var(--text-1)
    }

    #medium-solved-count {
        fill: var(--text-1)
    }

    #hard-solved-count {
        fill: var(--text-1)
    }

    #total-streak-ring {
        stroke: var(--color-4)
    }
    #background {
        stroke-width: 0;
        width: 500px;
        height: 320px;
        transform: translate(0px, 0px)
    }

    svg {
        opacity: 1
    }

    #background {
        rx: 10px
    }
</style>
</svg>`)

}
export default generateStats;