(function ($) {

    $.ajaxSetup({ cache: false });

    var snapshot_data = {};

    function set_heatmap(data){

    }

    function get_snapshot_data(snapshot) {
        $.ajax({
            url: "assets/php/get_snapshot_data.php",
            type: "post",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: "snapshot='" + snapshot+"'"

        }).done(function (data) {
            //On request received
            data = JSON.parse(data);
            console.log(data);
            snapshot_data[snapshot] = data; 
        }).fail(function (data) {
            alert("02, Error fetching snapshot data");
        });

    }
    get_snapshot_data('2021-05-10 19:04:42');

})(jQuery);