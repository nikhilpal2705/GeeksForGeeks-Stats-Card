<p align="center">
  <h1 align="center">GeeksForGeeks Stats Card</h1>
  <p align="center">Dynamically generated GeeksForGeeks stats!</p>
</p>

*****
This API allows you to fetch the count of total problems solved on [GeeksForGeeks](https://practice.geeksforgeeks.org/) along with detailed stats. You can use this to display your stats on a GitHub profile or any website.

> Built with: `Node.js`  `Express`  `Cheerio`

## Preview
<p align="center">
  <a href="https://geeks-for-geeks-stats-card.vercel.app/">Playground: Try It Now</a>
</p>

<p align="center">
  <a href="https://www.geeksforgeeks.org/user/nikhilpal2705/">
    <img src="https://gfgstatscard.vercel.app/nikhilpal2705" alt="GFG stats" />
  </a>
</p>


---

## 🚀 How to Use
### Markdown Integration
To display your stats in Markdown (e.g., GitHub profiles), copy the code below and replace **`<YOUR_USERNAME>`** with your GeeksForGeeks username.
> If your username contains blank spaces, replace them with `%20`.

```md
[![GeeksForGeeks stats](https://gfgstatscard.vercel.app/<YOUR_USERNAME>)](https://www.geeksforgeeks.org/user/<YOUR_USERNAME>/)
```
    
Alternatively, use this HTML snippet:
    
```html
<img src="https://gfgstatscard.vercel.app/<YOUR_USERNAME>" alt="GFG stats" />
```
      
### Make It Clickable
If you'd like to redirect the stats card to your GeeksForGeeks profile or any other link, replace **`<YOUR_LINK_HERE>`** with the GfG profile URL.

```md
[![GeeksForGeeks stats](https://gfgstatscard.vercel.app/<YOUR_USERNAME>)](<YOUR_LINK_HERE>)
```

Or:

```html
<a href="https://www.geeksforgeeks.org/user/<YOUR_USERNAME>/">
  <img src="https://gfgstatscard.vercel.app/<YOUR_USERNAME>" alt="GFG stats" />
</a>
```

> **Note:** Do not use quotes (`"`) in the URL. Ensure your username and link are correct.

If you encounter issues, ensure you have solved at least one problem on GeeksForGeeks. For further assistance, contact me via [LinkedIn](https://www.linkedin.com/in/nikhilpal2705/).

---

## 🎨 Themes

You can customize the card's theme using the `?theme` parameter.
- **Default theme:** `dark`
- **Available option:** `light`

#### Example:
```md
![](https://gfgstatscard.vercel.app/<YOUR_USERNAME>?theme=light)
```
<p align="center">
  <a href="https://www.geeksforgeeks.org/user/nikhilpal2705/">
    <img src="https://gfgstatscard.vercel.app/nikhilpal2705?theme=light" alt="GFG stats" />
  </a>
</p>
  
---

## 🔍 Fetch Raw Data
If you'd like to retrieve raw JSON data instead of a rendered card, use the `raw=true` parameter.

#### Example:
```
https://gfgstatscard.vercel.app/<YOUR_USERNAME>?raw=true
```

---

## 📡 API Endpoint
```
https://gfgstatscard.vercel.app/
```

---

## 🤝 Contributions
Any contributions to improve this repository are highly appreciated! Feel free to fork the repo, open issues, or submit pull requests.

---

### 🌟 Inspired By
- [GeeksForGeeks Stats API](https://github.com/napiyo/geeksForGeeksStatsAPI)
- [LeetCode Stats Card](https://github.com/JacobLinCool/LeetCode-Stats-Card)
