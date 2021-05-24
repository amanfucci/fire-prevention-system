(function ($) {

    $.ajax({
        url: "assets/php/get_options.php",
        type: "get",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        cache: "false",
        success: function (data) {
            data = JSON.parse(data);
            //console.log(data);
            if (data[0]) {
                $(function () {
                    $("#inputSN").val(data[1]['valore']);
                    $("#labelDescr").html(data[1]['descrizione']);
                    if (data[1]['auto_snapshot'] == 'ON') {
                        $('#inputAuto').prop('checked', true);
                    }
                    else {
                        $('#inputAuto').prop('checked', false);
                    }
                });
            }
            else {
                alert("01, Error fetching options");
            }
        },
        error: function (data) {
            alert("02, Error fetching options");
        }
    });

    //Submit new Options
    $("#inputSubmit").click(function () {
        $("#errorSubmit").prop('hidden', true);

        sn = $("#inputSN").val();
        auto = $('#inputAuto').prop('checked') ? "'ON'" : "'OFF'";
        console.log(auto);

        if ($("#form-1").valid()) {
            $.ajax({
                url: "assets/php/set_options.php",
                type: "post",
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: "&sn=" + sn + "&auto=" + auto 
            }).done(function (data) {
                
                data = JSON.parse(data);
                //console.log(data);
                if (data[0]) {
                    $(window).attr("location", "manage_options.php")
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


    //Set form options
    $(function () {
        $("#form-1").validate({
            rules: {
                inputSN: {
                    required: true
                }
            }
        });
    });

})(jQuery);