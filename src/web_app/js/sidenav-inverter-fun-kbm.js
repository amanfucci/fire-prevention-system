/*!
    * KBM - TN Weather
    * Copyright 2021 KBM
    * Licensed under SEE_LICENSE (https://gitlab.com/polotecnologico/5-bia-2020-2021/kbm/terranova_client/-/blob/master/LICENSE)
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
