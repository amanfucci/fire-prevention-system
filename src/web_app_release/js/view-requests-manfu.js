
/*
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/
$(document).ready(function () {

    var fot = 'This information is copyright to MANFU ©';
    $(".table").each(function () {
        var titl = $(this).parent().parent().parent().find('.card-header').text() + ' - Civil Protection of Grosseto';
        if ($(this).parent().find('.no-services').length == 0) {
            $(this).DataTable({
                dom: 'fltiprB',
                buttons: [
                    {
                        extend: 'pdf',
                        charset: 'UTF-8',
                        bom: true,
                        title: titl,
                        messageBottom: fot
                    },
                ],
                order: [[ 1, "desc" ]],
                responsive: true,
                pagingType: 'full',
            });
        }
        else{
        }
    });
});