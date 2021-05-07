/*!
		* KBM - TN Weather
		* Copyright 2021 KBM
		* Licensed under SEE_LICENSE (https://gitlab.com/polotecnologico/5-bia-2020-2021/kbm/terranova_client/-/blob/master/LICENSE)
		*/

$(function () {

	var start = min = moment(new Date('2018-01-01'));
	var end = max = moment(new Date('2018-12-01'));
	var city, city_n = 0;
	var dataSet;
	var get_err = false;
	var get_city_n_err = false;
	var cookie_cursor_nosave = false;
	var cookie_range_nosave = false;


	function cookie_cursor_up() {
		$.cookie('start', start.format("YYYY-MM-DD"), { path: '/' });
		$.cookie('end', end.format("YYYY-MM-DD"), { path: '/' });
	}

	function cookie_range_up() {
		$.cookie('min', min.format("YYYY-MM-DD"), { path: '/' });
		$.cookie('max', max.format("YYYY-MM-DD"), { path: '/' });
	}

	if (($.cookie('min') == undefined || $.cookie('max') == undefined) ||
		!moment($.cookie('min'), "YYYY-MM-DD").isValid() ||
		!moment($.cookie('max'), "YYYY-MM-DD").isValid()) {
		cookie_range_nosave = true;
	}
	else {
		//Get Range from cookie
		min = moment($.cookie('min'), "YYYY-MM-DD");
		max = moment($.cookie('max'), "YYYY-MM-DD");
	}

	if
		(($.cookie('start') == undefined || $.cookie('end') == undefined) ||
		!moment($.cookie('start'), "YYYY-MM-DD").isValid() ||
		!moment($.cookie('end'), "YYYY-MM-DD").isValid()) {
		cookie_cursor_nosave = true;
	}
	else {

		//Get Cursor from cookie
		start = moment($.cookie('start'), "YYYY-MM-DD");
		end = moment($.cookie('end'), "YYYY-MM-DD");
	}
	//AJAX GET_RANGE - START OF Request-------------------------------
	$.ajax({
		url: "assets/php/get_range.php",
		type: "get",
		cache: "false",
		beforeSend: function (event, files, index, xhr, handler, callBack) {
			$.ajax({
				async: false,
				url: 'assets/php/conn_close.php' // add path
			});
		}
	}).done(function (data) {
		//On request received
		var res = data.split('"').join('').split(";");
		var min_new = moment(new Date(res[0]));
		var max_new = moment(new Date(res[1]));

		//on range update - set cursors to extremes
		cookie_selected_nosave = (!min.isSame(min_new) || !max.isSame(max_new)) &&
			(!min_new.isValid() || !max_new.isValid());

		min = min_new;
		max = max_new;

		if (!min.isValid() || !max.isValid()) {
			get_err = true;
			alert("01, Error fetching available range");
			min = moment(new Date('2018-01-01'));
			max = moment(new Date('2018-12-01'));
		}
		else {
			if (cookie_cursor_nosave) {
				start = min;
				end = max;
			}
		}
		cookie_cursor_up()
		cookie_range_up();
		init_daterange();

	}).fail(function (data) {
		alert("02, Error fetching available range");
		init_daterange();
	});
	//##AJAX GET_RANGE - END OF Request-------------------------------


	function setTable(data, i) {
		//$.fn.DataTable.ext.pager.numbers_length = 5;
		var titl = city['city'][i]['name'] + ' - '
			+ start.format('Do MMM Y') + ' to ' + end.format('Do MMM Y');

		var fot = 'This information is copyright to TerraNovaSoftware ©';
		var UoM = ['hPa', '°C', '°C', '°C', '°C', '%', 'km', 'km/h', 'km/h'];
		var icon2Text = ['Hail', 'Sun', 'Snow', 'Fog', 'Rain', 'Storm'];
		if ($.fn.dataTable.isDataTable('#table-' + i)) {
			$('#table-' + i).DataTable().destroy();
		}
		$('#table-' + i).DataTable({
			data: data,
			dom: 'ltiprB',
			buttons: [
				{
					extend: 'print',
					charset: 'UTF-8',
					bom: true,
					title: titl,
					messageBottom: fot,
					customize: function (win) {
						$(win.document.body).find('thead')
							.prepend(
								'<img src="http://localhost/terranova/terranova_client/web_app/img/tn_logo.png" style="opacity: 0.7;padding:5px" />'
							);
					},
					exportOptions: {
						format: {
							header: function (data, column, node) {
								// Add UoM to header
								if (column >= 10)
									data = icon2Text[column - 10];
								return data;
							}
						}
					}
				},
				{
					extend: 'excel',
					charset: 'UTF-8',
					bom: true,
					title: titl,
					messageBottom: fot,
					exportOptions: {
						format: {
							header: function (data, column, node) {
								// Add UoM to header
								if (column >= 1 && column <= 9)
									data += ' [' + UoM[column - 1] + ']';
								else if (column >= 10)
									data = icon2Text[column - 10];
								return data;
							},
							body: function (data, row, column, node) {
								// Strip UoM from cells
								if (column >= 1 && column <= 9)
									data = parseInt(data.replace(/[km/hPa°C%]/g, ''));
								else if (column >= 10)
									data = data.length > 0 ? 1 : 0;
								return data;
							}
						}
					}

				},],
			responsive: true,
			'pagingType': 'full',
			columns: [
				{ title: "Date" },
				{ title: "MSLP", "sType": "hPa" },
				{ title: "DewPt", "sType": "°C" },
				{ title: "TMin", "sType": "°C" },
				{ title: "TAVG", "sType": "°C" },
				{ title: "TMax", "sType": "°C" },
				{ title: "Hum.", "sType": "%" },
				{ title: "Vis.", "sType": "km" },
				{ title: "Wind", "sType": "km/h" },
				{ title: "Gusts", "sType": "km/h" },
				{ title: "<h1 class='bi bi-cloud-hail-fill icon-h2' alt='ciao'></h1>" },
				{ title: "<h1 class='bi bi-sun-fill icon-h2' aria-hidden='true'></h1>" },
				{ title: "<h1 class='bi bi-cloud-snow-fill icon-h2' aria-hidden='true'></h1>" },
				{ title: "<h1 class='bi bi-cloud-fog2-fill icon-h2' aria-hidden='true'></h1>" },
				{ title: "<h1 class='bi bi-cloud-rain-fill icon-h2' aria-hidden='true'></h1>" },
				{ title: "<h1 class='bi bi-cloud-lightning-rain-fill icon-h2' aria-hidden='true'></h1>" },
			]
		});

	}

	//##AJAX GET_CITY_DATA - START OF Request-------------------------
	function sendAjax(i, city_db_i) {

		$.ajax({
			url: "assets/php/get_city_data_legacy.php",
			type: "post",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: "start=" + start.format("YYYY-MM-DD") + "&end=" + end.format("YYYY-MM-DD")
				+ "&city=" + city_db_i,
			cache: "false",
			beforeSend: function (event, files, index, xhr, handler, callBack) {
				$.ajax({
					async: false,
					url: 'assets/php/conn_close.php' // add path
				});
			}
		}).done(function (data) {
			if (data[1] == '!') {

				//DataTable data translation
				data.split('"').join('').split('!').join('').split("|").slice(0, -1).forEach(function (value, index) {

					var temp = value.split(";");
					//Check for errors
					if (parseInt(temp[1]) < -3000) {
						for (var k = 1; k <= 15; k++) {
							temp[k] = "0";
						}
					}

					//Add units of measurement and padding
					temp[1] += " hPa";
					for (var k = 2; k <= 5; k++) {
						temp[k] = padVal(temp[k], 2);
						temp[k] += " °C";
					}
					temp[6] = padVal(temp[6], 2);
					temp[6] += " %";
					temp[7] = padVal(temp[7], 2);
					temp[7] += " km";
					temp[8] = padVal(temp[8], 2);
					temp[8] += " km/h";
					temp[9] = padVal(temp[9], 2);
					temp[9] += " km/h";

					//Add checkmark
					for (var k = 10; k <= 15; k++) {
						if (parseInt(temp[k]))
							temp[k] = "&#10003";
						else
							temp[k] = "";
					}

					dataSet[city_db_i][index] = temp;
				});
			}
			else {
				alert("03, Error fetching data for " + city["city"][i]["name"]);
			}
			setTable(dataSet[city_db_i], i);

		}).fail(function (data) {
			alert("04, Error fetching data for " + city["city"][i]["name"]);
			setTable(dataSet[city_db_i], i);
		});
	}

	function onFirstRequestEnd() {
		dataSet = {};
		for (var i = 0; i < city_n; i++) {
			var city_db_i = city["city"][i]["id"];
			dataSet[city_db_i] = [];
			sendAjax(i, city_db_i);
		}
	}

	function getCityData() {
		city = { "city": [] };

		$.ajax({
			url: "assets/php/get_city_n.php",
			type: "get",
			cache: "false",
			beforeSend: function (event, files, index, xhr, handler, callBack) {
				$.ajax({
					async: false,
					url: 'assets/php/conn_close.php' // add path
				});
			}
		}).done(function (data) {
			if (data[1] == '!') {
				//Remove ! " from string, then split for |
				city_n_data = data.split('"').join("").split('!').join('').split('|').slice(0, -1);
				city_n = parseInt(city_n_data[0]);

				for (var i = 0; i < city_n; i++) {
					//Split each object for ;
					var temp = city_n_data[i + 1].split(";");
					city["city"][i] = { "id": temp[0], "name": temp[1] }
				}
			}
			else {
				city_n = 1;
				city["city"][0] = { "id": "0", "name": "NO DATA" };
				get_city_n_err = true;
			}
			//Handlebars
			var card_template = $("#card-template").html();
			$('#data-content').html(Handlebars.compile(card_template)(city));
			onFirstRequestEnd();

		}).fail(function (data) {
			alert("05, Error fetching data");
			city_n = 1;
			city["city"][0] = { "id": "0", "name": "NO DATA" };
			get_city_n_err = true;
			onFirstRequestEnd();
		});

	}
	//##AJAX GET_CITY_DATA - END OF Request-------------------------

	function init_cursor(start, end) {
		$('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
		$('#reportrange').data('daterangepicker').setStartDate(start);
		$('#reportrange').data('daterangepicker').setEndDate(end);
		$('#reportrange_sm').data('daterangepicker').setStartDate(start);
		$('#reportrange_sm').data('daterangepicker').setEndDate(end);

		getCityData();
	}

	function init_daterange() {
		$('#reportrange').daterangepicker({
			startDate: start,
			endDate: end,
			minDate: min,
			maxDate: max,
			opens: 'right',
			autoApply: true,
			linkedCalendars: false,
			alwaysShowCalendars: true,
			drops: 'down',
			parentEl: '#sidenavAccordion'
		}, (s, e) => {
			$('#reportrange span').html(s.format('DD/MM/YYYY') + ' - ' + e.format('DD/MM/YYYY'));
			$('#reportrange_sm').data('daterangepicker').setStartDate(s);
			$('#reportrange_sm').data('daterangepicker').setEndDate(e);
			start = s;
			end = e;
			cookie_cursor_up();

			getCityData();
		});

		$('#reportrange_sm').daterangepicker({
			startDate: start,
			endDate: end,
			minDate: min,
			maxDate: max,
			opens: 'left',
			autoApply: true,
			linkedCalendars: false,
			alwaysShowCalendars: true,
			drops: 'down',
			parentEl: '#sidenavAccordion'
		}, (s, e) => {
			$('#reportrange span').html(s.format('DD/MM/YYYY') + ' - ' + e.format('DD/MM/YYYY'));
			$('#reportrange').data('daterangepicker').setStartDate(s);
			$('#reportrange').data('daterangepicker').setEndDate(e);
			start = s;
			end = e;
			cookie_cursor_up();

			getCityData();
		});
		//set text @ start
		init_cursor(start, end);

	}

	function padVal(val, width) {
		var padding = "0000000000";
		var toPad = width - val.length;
		var minus = false;

		if (val[0] == "-") {
			minus = true;
			val = val.slice(1, val.length);
			toPad++;
		}

		if (toPad > 0) {
			val = padding.slice(0, toPad) + val;
			if (minus)
				val = "-" + val;
		}
		return val;
	}

	//close date-range menus when window < lg
	$(window).on('resize', function () {
		if ($('#reportrange_sm').is(":hidden")) {
			$('#reportrange_sm').data('daterangepicker').hide();
		}
		if ($('#reportrange').is(":hidden")) {
			$('#reportrange').data('daterangepicker').hide();
		}
	});
	//--

});