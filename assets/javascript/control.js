var tagList = []; // store all the tag

$(document).on("click", ".btn-add", function (event) {
    event.preventDefault();

    var content = $('#tag-content').val();
    console.log(content);
    $('#tag-content').val("");

    tagList.push(content);

    // create and display the tag
    var newTag = $('<div>').addClass('tag');
    newTag.html(`<span class="btn-close">x</span> ${content}`);

    $('#display-tag').append(newTag);
});


$(document).on("click", ".btn-close", function () {
    $(this).closest('.tag').remove();
});


$(document).on("click", ".tag", function () {
    var key = "JRvrNMtu2KeupmBlZMUIUYAwxz2ugM87";
    var content = $(this).text().slice(2);
    var queryURL = `http://api.giphy.com/v1/gifs/search?q=${content}&api_key=${key}`
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var data = response.data;
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var newDiv = $('<div>').html(`<img src=${data[i].images.fixed_height.url}>`);
            $('#display-gif').prepend(newDiv);
        }

    });
});
