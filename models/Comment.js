const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;