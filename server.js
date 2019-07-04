const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const hbs = require('express-handlebars');
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
const PORT = process.env.PORT || 8080;
const app = express();
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
app.use(logger("dev"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());;
app.use(express.static("public"));
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

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
    })
})

app.listen(PORT, function () {
    console.log("App listening on port 8080");
});

