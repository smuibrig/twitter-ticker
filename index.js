const express = require("express");
const app = express();

const { getToken, getTweets, filterTweets } = require("./twitter");

app.use(express.static("ticker-ajax"));

app.get("/data.json", (req, res) => {
    console.log("i need to build up some JSON and send it back....");
    // we want to do 4 things in here...

    // 1. We want to get the bearerToken from twitter...
    getToken(function (err, bearerToken) {
        if (err) {
            console.log("error in getToken: ", err);
            return;
        }
        console.log("in index.js the token!!!", bearerToken);
        // 2. When we have said token, use it to make another req for tweets
        getTweets(bearerToken, function (err, tweets) {
            if (err) {
                console.log("error in getTweets, ", err);
                return;
            }
            // 3. We want to clean up (filter) the tweets.
            const filteredTweets = filterTweets(tweets);
            // 4. we want to send back a response. res.json(filteredTweets)
            res.json(filteredTweets);
        });
    });
});

app.listen(8080, () => console.log("twitter ticker up and running"));

// console.log("kicking things off...");

// getToken(function (token) {
//     console.log("I need the token to do something", token);
// });
