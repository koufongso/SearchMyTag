var tagList = []; // store all the tag

$(document).on("click", ".btn-add", function (event) {
    event.preventDefault();

    var content = $('#tag-content').val();
    console.log(content);
    $('#tag-content').val("");

    tagList.push(content);

    // create and display the tag
    var newTag = $('<div>').addClass('tag');
    newTag.html(`
        <span class="btn-close"> x </span> ${content} 
    `);

    $('#display-tag').append(newTag);
});


$(document).on("click",".btn-close",function(){
    $(this).closest('.tag').remove();
})