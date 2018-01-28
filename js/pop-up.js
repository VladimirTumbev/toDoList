$(function (){
    $('.pop-up-open').on('click', function(){
        var popUpDiv = $(this).data('target');
        $(popUpDiv).removeClass('hidden');
    });
    $('.pop-up-close').on('click', function(){
        var popUpDiv = $(this).data('target');
        $(popUpDiv).addClass('hidden');
    });
});
