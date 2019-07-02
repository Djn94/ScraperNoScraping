const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = 8080;
const app = express();
app.use(logger("dev"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());;
app.use(express.static("../public"));
mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true })
// db.on("error", function (err) {
//     console.log("Database error:", err);
// });

// app.get("/", function (req, res) {
//     res.send("Page loaded success");
// })
// app.get("/all", function (req, res) {
//     db.news.find({}, function (err, found) {
//         if (err) { console.log(err); }
//         else { res.json({ found }); }
//     })
// })
app.get("/scrape", function (req, res) {
    console.log("NEWS ARTICLES");
    axios.get("https://www.latimes.com/").then(function (response) {

        const $ = cheerio.load(response.data);

        const results = [];

        $("h5").each(function (i, element) {

            const title = $(element).text();
            //add const for article summary, maybe pic
            const link = $(element).children().attr("href");
            results.push({
                title: title,
                link: link
            });
            db.Article.create(result).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                throw err;
            })
        });
        res.send("scrape finished")
    });
});



app.listen(8080, function () {
    console.log("App listening on port 8080");
});

