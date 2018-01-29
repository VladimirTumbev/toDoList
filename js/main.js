// toggle dropdown menu
$(function() {
    const dropdown = (() => {
        const openClose = (object) => {
            $(object).find('.dropdown-menu').toggleClass('hidden');
            $(object).closest('.dropdown').toggleClass('is-active');
        };

        const changeValue = () => {

        };

        const changeOptionValue = () => {

        };

        return {
            openClose,
        };
    })();

    $('.dropdown').on('click', function() {
        dropdown.openClose(this);
    });

    $(document).on('click', function(e) {
        if ($(e.target).closest(".dropdown.is-active").length === 0) {
            $(".dropdown-menu").addClass('hidden');
        }
    });
});

// mark dropdown item as active
$(function() {
    $('.dropdown-item').on('click', function() {
        let valueOfOption = $(this).text();
        $(this).parents('.dropdown').find('.value-of-select').text(valueOfOption);
        $(this).parent().find('.dropdown-item').removeClass('is-active');
        $(this).addClass('is-active');
    });
});

// select a tab and show list
$(function() {
    $('.tabs.is-boxed li').on('click', function() {
        $(this).closest('.tabs.is-boxed').find('li').removeClass('is-active');
        $(this).addClass ('is-active');
    });
});

$(function() {
    $('.tabs.is-boxed li').on('click', function() {
        var panelId = $(this).attr('data-panelid');
        $(this).closest('.tab-menu').find('div.tab-pane').addClass('hidden');
        $(panelId).removeClass('hidden');
    });
});