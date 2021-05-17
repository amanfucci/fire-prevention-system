/*
        * MANFU - FPS
        * Copyright 2021 MANFU
        * Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
        */
(function ($) {
    var data_global;
    //Get Users
    $.ajax({
        url: "assets/php/get_users.php",
        type: "get",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        cache: "false",
        success: function (data) {
            data = JSON.parse(data);
            if (data[0]) {
                $(function () {
                    data_global = data[1];
                    //Set select
                    data[1].forEach((x, i) => {
                        data[1][i]['name'] = data[1][i]['nome'] + ' ' + data[1][i]['cognome'];
                    });
                    //console.log(data[1]);
                    $("#inputUser").selectize({
                        options: data[1],
                        valueField: 'utenteId',
                        sortField: 'name',
                        labelField: 'name',
                        searchField: ['name', 'utenteId', 'email'],
                        render: {
                            item: function (item, escape) {
                                var label = item.name + ", (Id: " + item.utenteId + ")";
                                return '<div>' +
                                    '<span class="label">' + label + '</span>' +
                                    '</div>';
                            },
                            option: function (item, escape) {
                                var label = item.name + ", (Id: " + item.utenteId + ")";
                                var caption = item.email + "<p>" + item.ruolo + "</p>";
                                return '<div>' +
                                    '<span class="label">' + label + '</span><br>' +
                                    '<span class="caption">' + caption + '</span>' +
                                    '</div>';
                            }
                        }
                    });
                    //Set default
                    $("#inputUser").selectize()[0].selectize.setValue(data[1][0]['utenteId']);
                    setChangeForm(data_global.find(e => e.utenteId == $('#inputUser').val()));

                    $("#inputUser").selectize()[0].selectize.on('change', function () {
                        //console.log(data_global.find(e => e.utenteId == $('#inputUser').val()));
                        setChangeForm(data_global.find(e => e.utenteId == $('#inputUser').val()));
                    });
                });
            }
            else {
                alert("01, Error fetching users");
            }
        },
        error: function (data) {
            alert("02, Error fetching users");
        }
    });

    //Update user
    $("#inputSubmitChange").click(function () {
        $("#errorSubmitChange").prop('hidden', true);
        user_id = $("#inputUser").val();
        first_name = $("#inputFirstNameChange").val();
        last_name = $("#inputLastNameChange").val();
        email = $("#inputEmailChange").val();
        cf = $("#inputFiscalCodeChange").val();
        phone = $("#inputPhoneNumberChange").val();
        user_type = $("#inputUserTypeChange").val();
        //console.log(first_name);
        if ($("#form-change").valid()) {

            $.ajax({
                url: "assets/php/insert_user.php",
                type: "post",
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: "&first_name=" + first_name + "&last_name=" + last_name +
                    "&email=" + email + "&cf=" + cf + "&phone="
                    + phone + "&user_type=" + user_type + "&user_id=" + user_id
            }).done(function (data) {
                //On request received
                data = JSON.parse(data);
                //console.log(data);
                if (data[0]) {
                    $(window).attr("location", "manage_users.php")
                }
                else {
                    setTimeout(function () {
                        $("#errorSubmitChange").prop('hidden', false);
                    }, 20);
                }
            }).fail(function (data) {
                alert("03, Error fetching submit response");
            });
        }
    });

    //Add new user
    $("#inputSubmit").click(function () {
        $("#errorSubmit").prop('hidden', true);
        first_name = $("#inputFirstName").val();
        last_name = $("#inputLastName").val();
        email = $("#inputEmail").val();
        cf = $("#inputFiscalCode").val();
        phone = $("#inputPhoneNumber").val();
        user_type = $("#inputUserType").val();
        //console.log(first_name);
        if ($("#form-new").valid()) {

            $.ajax({
                url: "assets/php/insert_user.php",
                type: "post",
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: "&first_name=" + first_name + "&last_name=" + last_name +
                    "&email=" + email + "&cf=" + cf + "&phone="
                    + phone + "&user_type=" + user_type
            }).done(function (data) {
                //On request received
                data = JSON.parse(data);
                //console.log(data);
                if (data[0]) {
                    $(window).attr("location", "manage_users.php")
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

    function setChangeForm(data) {
        $("#inputFirstNameChange").val(data['nome']);
        $("#inputLastNameChange").val(data['cognome']);
        $("#inputEmailChange").val(data['email']);
        $("#inputFiscalCodeChange").val(data['cf']);
        $("#inputPhoneNumberChange").val(data['telefono']);
        $("#inputUserTypeChange").val(data['ruolo']);
    }

})(jQuery);