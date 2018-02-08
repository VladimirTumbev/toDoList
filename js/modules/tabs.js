// select a tab and show list
$(function() {
    $('.tabs.is-boxed li').on('click', function() {
        $(this).closest('.tabs.is-boxed').find('li').removeClass('is-active');
        $(this).addClass('is-active');
    });
});

$(function() {
    $('.tabs.is-boxed li').on('click', function() {
        var panelId = $(this).attr('data-panelid');
        $(this).closest('.tab-menu').find('div.tab-pane').addClass('hidden');
        $(panelId).removeClass('hidden');
    });
});