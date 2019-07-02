const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_h23n30qs:7ckhars6aq49t2nodg898hv1cv@ds245927.mlab.com:45927/heroku_h23n30qs";

const app = express();
app.use(logger("dev"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());;
app.use(express.static("public"));
mongoose.connect(MONGODB_URI);
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


        $("h5").each(function (i, element) {
            const results = [];

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
//omg it pulls articles from my data base which also means they're being stored correctly omggg
app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("comment").then(
        function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body).then(function (dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id },
            { Comment: dbComment._id }, { new: true });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

