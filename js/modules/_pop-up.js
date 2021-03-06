$(function () {
    $(document).on('click', '.pop-up-open', function () {
        var popUpDiv = $(this).data('target');
        $(popUpDiv).toggleClass('show');
    });

    $(document).on('click','.pop-up-close', function () {
        var popUpDiv = $(this).data('target');
        $(popUpDiv).toggleClass('show');
    });

    var isOut = false;

    $('.pop-up-dialog').mouseover(function () {
        isOut = false;
    });

    $('.pop-up-dialog').mouseout(function () {
        isOut = true;
    });

    $(document).on('keyup', function (e) {
        if (e.keyCode === 27) {
            if ($('#addTaskPopUpNav').hasClass('show')) {
                $('#addTaskPopUpNav').removeClass('show');
            }
        }
    })

    $(document).on('click', function () {
        if (isOut) {
            $('#addTaskPopUpNav').removeClass('show');
            isOut = false;
        }
    })

    $( "#due-date" ).datepicker();
    
    $( "#reminder" ).datepicker();

});