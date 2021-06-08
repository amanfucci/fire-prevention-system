/*
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/
(function ($) {
    p2text = { '1': 'Low', '2': 'Medium', '3': 'High' };
    //Get Requests
    $.ajax({
        url: "assets/php/get_requests_technician.php",
        type: "get",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        cache: "false",
        success: function (data) {
            data = JSON.parse(data);
            if (data[0]) {
                $(function () {
                    //Set select
                    data[1].forEach((x, i) => {
                        data[1][i]['name'] = data[1][i]['nome'] + ' ' + data[1][i]['cognome'];
                    });
                    //console.log(data[1]);
                    $("#inputRequest").selectize({
                        options: data[1],
                        valueField: 'richiestaId',
                        sortField: 'timestamp',
                        labelField: 'timestamp',
                        searchField: ['timestamp', 'richiestaId', 'name'],
                        render: {
                            item: function (item, escape) {
                                return '<div>' +
                                    '<span class="label">' + item.richiestaId + '</span>' +
                                    '</div>';
                            },
                            option: function (item, escape) {
                                var label = "Id: " + item.richiestaId + ", "
                                + p2text[item.urgenza] + " Priority";
                                var caption = "By " + item.name + " on " + item.timestamp + ".<br>" +
                                "Node: " + item.sensore;
                                return '<div>' +
                                    '<span class="label">' + label + '</span><br>' +
                                    '<span class="caption">' + caption + '</span>' +
                                    '</div>';
                            }
                        }
                    });
                    $("#inputRequest").selectize()[0].selectize.setValue(data[1][0]['richiestaId']);
                });
            }
            else {
                $("#staticBackdrop").modal('show');
            }
        },
        error: function (data) {
            alert("02, Error fetching requests data");
        }
    });


    $("#inputSubmit").click(function () {
        $("#errorSubmit").prop('hidden', true);

        descr = $("#inputDescr").val();
        solved = $('#inputSolved').prop('checked') ? 1 : 0;
        request = $('#inputRequest').val();
        console.log(descr);
        console.log(solved);
        console.log(request);
        //console.log(node);
        if ($("#form-1").valid()) {

            $.ajax({
                url: "assets/php/report_service.php",
                type: "post",
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: "descr=" + descr + "&solved=" + solved + "&request=" + request
            }).done(function (data) {
                //On request received
                data = JSON.parse(data);
                console.log(data);
                if (data[0]) {
                    $(window).attr("location", "view_requests_technician.php")
                }
                else {
                    setTimeout(function () {
                        $("#errorSubmit").prop('hidden', false);
                    }, 20);
                }
            }).fail(function (data) {
                alert("03, Error fetching submit response");
            });
        }
    });

})(jQuery);