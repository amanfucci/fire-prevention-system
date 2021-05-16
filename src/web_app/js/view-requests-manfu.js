
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
                responsive: true,
                pagingType: 'full',
            });
        }
        else{
        }
    });
});