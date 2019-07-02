//populate articles div with information

console.log('java running');
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        //reconfigure to each loop
        //need div id=articles to append to in html
        $("#articles").append(
            "<p data-id='" + data[i]._id + "'>" +
            data[i].title +
            "<br />" + data[i].link + "</br>" + data[i].summary + "</p>");

    }
});
$(document).on("click", "p", function () {
    $("#comments").empty();
    //need a div for comments
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function (data) {
        console.log(data);
        $("#comments").append("<h2>" + data.title + "</h2>");
        $("#comments").append("<input id='authorinput' name='author' >");
        $("#comments").append("<textarea id='commentinput' name='comment></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Add Comment</button>");
        if (data.comment) {
            $("#authorinput").val(data.comment.author);
            $("#commentinput").val(data.comment.commentBody);

        };
    });
});

//save comment button functionality
$(document).on("click", "#savecomment", function () {
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles" + thisId,
        data: {
            author: $("#authorinput").val(),
            commentBody: $("#commentinput").val()
        }
    }).then(function (data) {
        console.log(data)
        $("#notes").empty();
    });
    $("#authorinput").val("");
    $("#commentinput").val("");
})