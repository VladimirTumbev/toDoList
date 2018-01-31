($.fn.dropdown = function() {
    $(this).on('click', function () {
        var isOut = false;
        var $this = $(this);
        var $dropDownElements = $(this).find('.dropdown-content > a');

        var openClose = function () {
            var $dropdownMenu = $this.find('.dropdown-menu');

            if ($dropdownMenu.hasClass('hidden')) {
                $dropdownMenu.removeClass('hidden');
            } else {
                $dropdownMenu.addClass('hidden');
            }
        };

        $dropDownElements.on('click', function () {
            // Change active Element
            $dropDownElements.removeClass('is-active');
            $(this).addClass('is-active');
            var dropdownListText = $(this).text();
            $this.find('.value-of-select').text(dropdownListText);
        });

        $this.mouseover(function () {
            isOut = false;
        });

        $this.mouseout(function () {
            isOut = true;
        });

        openClose();

        $(document).on('click', function (e) {
            if (isOut) {
                $this.find('.dropdown-menu').addClass('hidden');
                isOut = false;
            }
        });
    });
})();

$(function() {
    $('.dropdown').dropdown();
});
