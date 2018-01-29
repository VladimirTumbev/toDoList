$(function (){
    $('.pop-up-open').on('click', function(){
        var popUpDiv = $(this).data('target');
        $(popUpDiv).toggleClass('show');
    });
    $('.pop-up-close').on('click', function(){
        var popUpDiv = $(this).data('target');
        $(popUpDiv).toggleClass('show');
    });
});
