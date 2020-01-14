const GIF_DEFAULT_OFFSET = 10;
const GIF_DEFAULT_LIMIT = 10;

/* load the tag from the tagList, if it not defined, initialize it and stroe it to the local storage
*/
function loadTags() {
    var tagList = JSON.parse(localStorage.getItem("tagList"));
    if (tagList == null) {
        tagList = [];
        localStorage.setItem("tagList", JSON.stringify(tagList));
    } else {
        for (var i = 0; i < tagList.length; i++) {
            var newTag = $('<div>').addClass('tag');
            newTag.html(`<span class="close">&#10005</span> <span class="tag-name">${tagList[i]}</span> <span class="icon-heart icon-heart-on" data-state="on">&#10084</span>`);
            $('#display-tag').append(newTag);
        }
    }
}

/* add new tag and display it
*/
$(document).on("click", "#add", function (event) {
    event.preventDefault();
    var content = $('#tag-content').val();
    console.log(content);
    $('#tag-content').val(""); // clear the input bar

    // only perfrom action if the input is not "empty"
    if (content != "") {
        // update local storage
        // create and display the tag
        var newTag = $('<div>').addClass('tag');
        newTag.html(`<span class="close">&#10005</span> <span class="tag-name">${content}</span> <span class="icon-heart icon-heart-off" data-state="off">&#10084</span>`);
        $('#display-tag').append(newTag);
    }
});


/* remove tag from the panel
*/
$(document).on("click", ".close", function () {
    // update local storage
    $(this).parent('.tag').remove();
});


/* added/removed the tag to/from the (favourite) tagList
*/
$(document).on("click", ".icon-heart", function () {

    var tagList = JSON.parse(localStorage.getItem("tagList"));
    var content = $(this).prev().text();
    console.log(content);

    if ($(this).attr("data-state") == "off") {
        // added to favourite
        $(this).attr("data-state", "on"); // changed state
        $(this).removeClass("icon-heart-off");
        $(this).addClass("icon-heart-on");

        tagList.push(content); // add to favourite
        localStorage.setItem("tagList", JSON.stringify(tagList)); // update local storage
 
    }else if($(this).attr("data-state") == "on"){
        // removed from favourite
        $(this).attr("data-state", "off"); // changed state
        $(this).removeClass("icon-heart-on");
        $(this).addClass("icon-heart-off");

        tagList.splice(tagList.indexOf(content), 1); // remove from favourite
        localStorage.setItem("tagList", JSON.stringify(tagList)); // update local storage
    }
})


/* search tag content based on the search option
*/
$(document).on("click", ".tag-name", search);

function search() {
    var content = $(this).text();
    // get the search option
    var inputs = $('.options-input');
    for (var i = 0; i < inputs.length; i++) {
        if ($(inputs[i]).prop("checked") == true) {
            var opt = $(inputs[i]).prop("value");
            break;
        }
    }

    // base on the opt, call the corresponding search function
    switch (opt) {
        case "gif":
            console.log("call gif");
            searchGif(content, 0);
            break;
        case "movie":
            console.log("call movie");
            searchMovie(content);
            break;
        default:
            console.log("options not defined");
    }
}


/* use api to search relevant gif
*/
function searchGif(content, offSet) {
    if (offSet == 0) {
        $('#display-result').empty(); // first search, clear the previous result
    }
    var key = "JRvrNMtu2KeupmBlZMUIUYAwxz2ugM87";
    // console.log(`content:${content}, offSet:${offSet}`);
    var queryURL = `http://api.giphy.com/v1/gifs/search?q=${content}&offset=${offSet}&limit=${GIF_DEFAULT_LIMIT}&api_key=${key}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var data = response.data;
        // console.log(data);
        if (data.length == 0) {
            if (offSet == 0) {
                $('#display-result').append(`<h1>Sorry, gif not found...</h1>`); // first search, no result
            } else {
                $('#display-result').append(`<h1>This is the last gif...</h1>`); // show more result, no more result
            }
        } else {
            for (var i = 0; i < data.length; i++) {
                var newDiv = $('<div>').addClass("gif").html(`<span class="rating">Rating: ${data[i].rating.toUpperCase()}</span><br><img src=${data[i].images.fixed_height.url}>`);
                $('#display-result').append(newDiv);
            }

            $('#display-more').html(`<span class="show-more">Show more result >>></span>`);
        }

        offSet += GIF_DEFAULT_OFFSET;
        $('.show-more').on("click", () => { searchGif(content, offSet) });
    });
}

/* use api to search movie
*/
function searchMovie(content) {
    var key = "d6386a38";
    var plot = "full";
    var queryURL = `https://www.omdbapi.com/?t=${content}&plot=${plot}&apikey=${key}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (response.Response == "False") {
            $('#display-result').html(`<h1>Sorry, movie not found...</h1>`);
        } else {
            console.log(response);
            displayMovie(response);
        }
    });
}

function displayMovie(response) {
    $('#display-more').empty();
    $('#display-result').empty();
    // arrage the rating
    var holder = $('<div>');
    var rating = response.Ratings; // rating is in an array
    for (var i = 0; i < rating.length; i++) {
        holder.append(`<p>${rating[i].Source}: ${rating[i].Value}</p>`);
    }

    $('#display-result').html(`
    <div class="movie">
        <div class="movie-main">
            <h1 class="movie-title">${response.Title} (${response.Year})</h1>
            <h5 class="movie-dircetor">Director: ${response.Director}</h5>
            <h5 class="movie-writer">Writer: ${response.Writer}</h5>
            <h5 clas="movie-actor">Actors: ${response.Actors}</h4>
            <p class="movie-plot">${response.Plot}</p>
        </div><!--
        --><div class="movie-side">
            <img class="movie-poster" src=${response.Poster}>
            <div class="movie-rating">
                ${holder.html()}
            </div>
        </div>
    </div>`);
}


$(document).ready(loadTags);