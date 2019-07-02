const express = require("express");
const mongojs = require("mongojs");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
app.use(express.static("../public"));
const databaseUrl = "newsdb";
const collections = ["newsdb"]
const db = mongojs(databaseUrl, collections);
db.on("error", function (err) {
    console.log("Database error:", err);
});
console.log('uh')
console.log(db);
app.get("/", function (req, res) {
    res.send("Page loaded success");
})
app.get("/all", function (req, res) {
    db.news.find({}, function (err, found) {
        if (err) { console.log(err); }
        else { res.json({ found }); }
    })
})

app.listen(8080, function () {
    console.log("App listening on port 8080");
});
// First, tell the console what server.js is doing
console.log("NEWS ARTICLES");
// Making a request via axios for reddit's "webdev" board. We are sure to use old.reddit due to changes in HTML structure for the new reddit. The page's Response is passed as our promise argument.
axios.get("https://www.latimes.com/").then(function (response) {

    // Load the Response into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("h5").each(function (i, element) {

        // Save the text of the element in a "title" variable
        var title = $(element).text();

        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).children().attr("href");

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            link: link
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
});
