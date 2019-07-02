const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
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
app.get("/", function (req, res) {
    res.send("Page loaded success");
})
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
            db.Article.create(results).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                throw err;
            })
        });
        res.send("scrape finished")
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.listen(PORT, function () {
    console.log("App listening on port 8080");
});

