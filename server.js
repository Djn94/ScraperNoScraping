const express = require("express");
const mongojs = require("mongojs");
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
