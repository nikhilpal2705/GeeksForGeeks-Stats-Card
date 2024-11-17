import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const generateStats = async (data, theme = 'dark') => {
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

    // Load the dynamic CSS
    const cssFilePath = path.join(fileURLToPath(import.meta.url), `../public/${theme === 'light' ? 'light.css' : 'dark.css'}`);
    const themeCSS = await loadCSS(cssFilePath);

    const svgFilePath = path.join(fileURLToPath(import.meta.url), '../public/svg.css');
    const svgCSS = await loadCSS(svgFilePath);

    return (`
    <svg width="500" height="320" viewBox="0 0 500 320" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" id="root">
        <title id="_bq">${data.userHandle} | GFG Stats Card</title>
        <style id="default-colors">
            ${themeCSS}
            :root{
                --progress-dasharray: ${data.ProgressBar}
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
        </g><a href="https://www.geeksforgeeks.org/user/${data.userHandle}/" target="_blank" id="username"><text
                id="username-text">${data.userHandle}</text></a><text id="ranking">${''}</text>
        <g id="total-streak">
            <circle id="total-streak-bg" />
            <circle id="total-streak-ring" /><text id="total-streak-text">${data.pod_solved_longest_streak}
                /${data.pod_solved_global_longest_streak}</text>
            <text id="streak-text">STREAK</text>
            <text id="days-text">days</text>
        </g>
        <g id="solved">
            <g id="school-solved"><text id="school-solved-type">School</text>
                <text id="school-solved-count">${data.School}</text>
            </g>
            <g id="basic-solved"><text id="basic-solved-type">Basic</text>
                <text id="basic-solved-count">${data.Basic}</text>
            </g>
            <g id="easy-solved"><text id="easy-solved-type">Easy</text>
                <text id="easy-solved-count">${data.Easy}</text>
            </g>
            <g id="medium-solved"><text id="medium-solved-type">Medium</text>
                <text id="medium-solved-count">${data.Medium}</text>
            </g>
            <g id="hard-solved"><text id="hard-solved-type">Hard
                </text><text id="hard-solved-count">${data.Hard}</text>
            </g>
        </g>
        <g id="total-activity">
            <line x1="10" y1="0" x2="490" y2="0" id="_1b" />
            <line x1="0" y1="0" x2="0" y2="64" id="_1c" />
            <line x1="0" y1="0" x2="0" y2="64" id="_1d" />
            <g id="overall-score">
                <text id="overall-score-title">Coding Score</text>
                <text id="overall-score-count">${data.total_score || '_ _'}</text>
            </g>
            <g id="total-solved">
                <text id="total-solved-title">Problem Solved</text>
                <text id="total-solved-count">${data.total_problems_solved || '_ _'}</text>
            </g>
            <g id="month-score">
                <text id="month-score-title">${data.current_rating ? "Contest Rating" : "Monthly Coding Score"}</text>
                <text id="month-score-count">${data.current_rating ? data.current_rating : (data.monthly_score || '_ _')}
                </text>
            </g>
        </g>
        <style id="_lx">
            ${svgCSS}
        </style>
    </svg>
`)

}
export default generateStats;