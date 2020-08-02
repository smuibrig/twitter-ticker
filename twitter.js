const { consumerKey, consumerSecret } = require("./secrets.json");
const https = require("https");

module.exports.getToken = function (callback) {
    // this function gets the bearerToken from twitter...
    // we will do it in class :)
    const creds = `${consumerKey}:${consumerSecret}`;
    const encodedCreds = Buffer.from(creds).toString("base64");

    const options = {
        host: "api.twitter.com",
        path: "/oauth2/token",
        method: "POST",
        headers: {
            Authorization: `Basic ${encodedCreds}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
    };

    function cb(response) {
        if (response.statusCode != 200) {
            callback(response.statusCode);
            return;
        }

        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            // console.log('body: ',body);
            const parsedBody = JSON.parse(body);
            // console.log('parsedBody: ',parsedBody);
            callback(null, parsedBody.access_token);
        });
    }

    const req = https.request(options, cb);

    req.end("grant_type=client_credentials");
};

module.exports.getTweets = function (bearerToken, callback) {
    const tweets = {
        host: "api.twitter.com",
        path:
            "/1.1/statuses/user_timeline.json?screen_name=nytimes&tweet_mode=extended",
        method: "GET",
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    };
    function cb(response) {
        if (response.statusCode != 200) {
            callback(response.statusCode);
            return;
        }

        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            const dataTwitter = JSON.parse(body);
            callback(null, dataTwitter);
        });
    }
    const req = https.request(tweets, cb);
    req.end();
};

module.exports.filterTweets = function (tweets) {
    let filtered = [];

    tweets.forEach((e) => {
        const text = e.full_text;
        const link = e.entities.urls;
        const index = text.indexOf("https");
        const headline = text.slice(0, index);

        if (link.length > 0) {
            filtered.push({ link: `${link[0].url}`, headline: `${headline}` });
        }
    });
    return filtered;
};
/*
[
    {
        link:
            "https://www.buzzfeednews.com/article/alexkantrowitz/twitter-will-allow-employees-to-work-at-home-forever",
        headline: "Twitter Will Allow Employees To Work At Home Forever",
    },
    {
        link:
            "https://www.buzzfeednews.com/article/alexkantrowitz/twitter-will-allow-employees-to-work-at-home-forever",
        headline: "Twitter Will Allow Employees To Work At Home Forever",
    },
];
*/
