<p align="center">
<h1 align="center">GeeksForGeeks Stats Card</h1>
<p align="center">Dynamically generated GeeksForGeeks stats!</p>
</p>

*****

API to get count of total problems solved on [GeeksForGeeks](https://practice.geeksforgeeks.org/) with details.

> you can use this API to show your stats on github profile or any website.

> `node.js`  `express`  `cheerio`

## Preview
<p align="center"> <a href="https://www.geeksforgeeks.org/user/nikhilpal2705/"><img src="https://gfgstatscard.vercel.app/nikhilpal2705" alt="GFG stats"/></a></p>

# How to use 
- To show in markdown (Github profile) simply copy below code and replace **`<YOUR_USERNAME>`** with your GeeksForGeeks UserName

- If you have blank space in your username dont use Blank Space use %20

> That's it, if you get any error , make sure you have solved at least 1 problem on GFG and cross check username and link 

> Send me message if any error occur [LinkedIn](https://www.linkedin.com/in/nikhilpal2705/)

#### Copy this code 👇🏻
```
[![GeeksForGeeks stats](https://gfgstatscard.vercel.app/<YOUR_USERNAME>)](https://auth.geeksforgeeks.org/user/<YOUR_USERNAME>/practice/)
```
OR

```
<img src="https://gfgstatscard.vercel.app/<YOUR_USERNAME>" alt="GFG stats"/>
```

## Make Clickable
If you want to redirect to your geeksForgeeks profile or any other replace **`<YOUR_LINK_HERE>`**.
> DONT FORGET to replace username as mentioned before

> Dont use `"` in your link , simple paste it
```
[![GeeksForGeeks stats](https://gfgstatscard.vercel.app/<YOUR_USERNAME>)](<YOUR_LINK_HERE>)
```
OR
```
<a href="https://www.geeksforgeeks.org/user/<YOUR_USERNAME>/"><img src="https://gfgstatscard.vercel.app/<YOUR_USERNAME>" alt="GFG stats"/></a>
```

## Theme
#### `theme` (default: `dark`)
If you want to use light theme you can use the `?theme=light`

```md
![](https://gfgstatscard.vercel.app/nikhilpal2705?theme=light)
```
<p align="center"> <a href="https://www.geeksforgeeks.org/user/nikhilpal2705/"><img src="https://gfgstatscard.vercel.app/nikhilpal2705?theme=light" alt="GFG stats"/></a></p>


### API End Point
```
https://gfgstatscard.vercel.app/
```

<br>

# Any contribution to this repo is highly appreciated

<br>

### Inspired by 
[geeksForGeeksStatsAPI](https://github.com/napiyo/geeksForGeeksStatsAPI)

[LeetCode-Stats-Card](https://github.com/JacobLinCool/LeetCode-Stats-Card)
