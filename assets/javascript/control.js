var tagList = []; // store all the tag

$(document).on("click", ".btn-add", function (event) {
    event.preventDefault();
    var content = $('#tag-content').val();
    console.log(content);
    $('#tag-content').val(""); // clear the input bar

    // only perfrom action if the input is not "empty"
    if (content != "") {
        tagList.push(content);
        // create and display the tag
        var newTag = $('<div>').addClass('tag');
        newTag.html(`<span class="btn-close">&#10005</span> <span class="tag-name">${content}</span>`);
        $('#display-tag').append(newTag);
    }
});

$(document).on("click", ".btn-close", function () {
    tagList.splice(tagList.indexOf($(this).siblings().text()), 1); // remove the tag from the array
    $(this).parent('.tag').remove();
});


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
            searchGif(content);
            break;
        case "movie":
            console.log("call movie");
            searchMovie(content);
            break;
        default:
            console.log("options not defined");
    }
}

function searchGif(content) {
    var key = "JRvrNMtu2KeupmBlZMUIUYAwxz2ugM87";
    console.log(content);
    var queryURL = `http://api.giphy.com/v1/gifs/search?q=${content}&api_key=${key}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var data = response.data;

        // console.log(data);
        if (data.length == 0) {
            $('#display-result').html(`<h1>Sorry, result not found...</h1>`);
        } else {
            $('#display-result').empty();
            for (var i = 0; i < data.length; i++) {
                var newDiv = $('<div>').addClass("gif").html(`<span class="rating">Rating: ${data[i].rating.toUpperCase()}</span><br><img src=${data[i].images.fixed_height.url}>`);
                $('#display-result').prepend(newDiv);
            }
        }
    });
}


function searchMovie(content) {
    var key = "d6386a38";
    var plot = "full";
    var queryURL = `http://www.omdbapi.com/?t=${content}&plot=${plot}&apikey=${key}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        if (response.Response == "Flase") {
            $('#display-result').html(`<h1>Sorry, result not found...</h1>`);
        } else {
            displayMovie(response);
        }
    });
}

function displayMovie(response) {
    $('#display-result').empty();
    // arrage the rating
    var holder = $('<ul>');
    var rating = response.Ratings; // rating is in an array
    for (var i = 0; i < rating.length; i++) {
        holder.append(`<li>${rating[i].Source}:${rating[i].Value}</li>`);
    }

    $('#display-result').html(`
    <div class="movie-main">
        <h1 class="movie-title">${response.Title} (${response.Year})</h1>
        <h4 clas="movie-actor">Actors: ${response.Actors}</h4>
        <p class="movie-plot">${response.Plot}</p>
    </div>

    <div class="movie-side">
        <img class="movie-poster" src=${response.Poster}>
        <ul class="movie-rating">
            ${holder.html()}
        </ul>
    </div>`);
}