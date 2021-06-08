/*
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/
(function ($) {

    //Get Nodes
    $.ajax({
        url: "assets/php/get_nodes.php",
        type: "get",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        cache: "false",
        success: function (data) {
            data = JSON.parse(data);
            if (data[0]) {
                $(function () {
                    //Set select
                    data[1].forEach((x, i) => {
                        data[1][i]['coord'] = data[1][i]['lat'] + ' ' + data[1][i]['lng'];
                        /*$("#inputNode").append(
                            '<option value=' + x.arduinoId + ' ' +
                            '>' + x.arduinoId + 
                            '</option>'
                        )*/
                    });
                    //console.log(data[1]);
                    $("#inputNode").selectize({
                        options: data[1],
                        valueField: 'arduinoId',
                        sortField: 'arduinoId',
                        labelField: 'coord',
                        searchField: ['arduinoId', 'coord'],
                        render: {
                            item: function (item, escape) {
                                return '<div>' +
                                    (item.arduinoId ? '<span class="label">' + item.arduinoId + '</span>' : '') +
                                    '</div>';
                            },
                            option: function (item, escape) {
                                var caption = item.coord || item.arduinoId;
                                var label = item.coord ? item.arduinoId : null;
                                return '<div>' +
                                    '<span class="label">' + label + '</span><br>' +
                                    (caption ? '<span class="caption">' + caption + '</span>' : '') +
                                    '</div>';
                            }
                        }
                    });
                    $("#inputNode").selectize()[0].selectize.setValue(data[1][0]['arduinoId']);
                });
            }
            else {
                alert("01, Error fetching nodes data");
            }
        },
        error: function (data) {
            alert("02, Error fetching nodes data");
        }
    });


    $("#inputSubmit").click(function () {
        $("#errorSubmit").prop('hidden', true);

        reason = $("#inputReason").val();
        priority = $("#inputPriority").val();
        node = $('#inputNode').val();
        //console.log(node);
        if ($("#form-1").valid() && node != '') {

            $.ajax({
                url: "assets/php/forward_request.php",
                type: "post",
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: "reason=" + reason + "&priority=" + priority + "&node=" + node
            }).done(function (data) {
                //On request received
                data = JSON.parse(data);
                console.log(data);
                if (data[0]) {
                    $(window).attr("location", "view_requests_supervisor.php")
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