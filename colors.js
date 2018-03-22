jQuery(document).ready(function(){
// Define some colours

var colours = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple"    
];

// Retrieve the words
var text = $("h1").html().split(" ");

// Empty the elment
$("h1").empty();

// Iterate over the words
$.each(text, function(i, word) {
    if(i != text.length) {
        word += " "; // Add space after word 
    }

     // Get random color
    var colourIndex = Math.floor(Math.random() * colours.length);

    $("<span>")
        .html(word)
        .css("color", colours[colourIndex])
        .appendTo($("h1"));
});
});
