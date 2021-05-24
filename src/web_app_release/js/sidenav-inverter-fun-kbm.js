/*!
    * MANFU - FPS
    * Copyright 2021 MANFU
    * Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
    */

$(function () {
    $(window).on('resize', function () {
        if (innerWidth < 992) {
            if ($("body").hasClass("sidenav-toggled")) {
                $("body").toggleClass("sidenav-toggled")
            }
        }
        if (innerWidth >= 992) {
            if (!$("body").hasClass("sidenav-toggled")) {
                $("body").toggleClass("sidenav-toggled")
            }
        }
    });

    $(window).on('load', function () {
        if (innerWidth < 992) {
            if ($("body").hasClass("sidenav-toggled")) {
                $("body").toggleClass("sidenav-toggled")
            }
        }
        if (innerWidth >= 992) {
            if (!$("body").hasClass("sidenav-toggled")) {
                $("body").toggleClass("sidenav-toggled")
            }
        }
    });
});
