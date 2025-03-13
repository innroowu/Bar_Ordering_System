$(document).ready(function() {

    // Button hover
    $('.navigation-buttons button').hover(
        function() {
            $(this).animate({
                backgroundColor: '#0056b3',
                scale: 1.05
            }, 200);
        },
        function() {
            $(this).animate({
                backgroundColor: '#007bff',
                scale: 1
            }, 200);
        }
    );
});
