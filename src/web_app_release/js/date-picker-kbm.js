/*!
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/

$(function () {

	$.ajaxSetup({ cache: false });

	//moment.locale("it"); Set time format to italian

	var selected = min = moment(new Date('2018-01-01'));
	var max = moment(new Date('2018-12-01'));
	var get_err = false;
	var cookie_selected_nosave = false;
	var cookie_range_nosave = false;
	var indicators = [], items = [], city_n = 0;

	//Overried indicators bootstrap.js
	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.attributeName === "class") {
				items.forEach((value, index) => {
					if (value.hasClass("active")) {
						//Reset indicators status
						indicators.forEach((value) => {
							value.removeClass("active");
						});
						//Set new active indicators
						indicators[index].addClass("active");
						return;
					}
				});

			}
		});
	});

	function setObserver() {
		//Manage indicators
		items.forEach(function ($value) {
			observer.observe($value[0], {
				attributes: true
			});
		});
	}
	//----------------------------------------------

	function cookie_selected_up() {
		$.cookie('selected', selected.format("YYYY-MM-DD"), { path: '/' });
	}

	//Set selected check min & max, set disabled
	function setSel(s) {
		if (s.isSameOrBefore(min)) {
			$("#bw_date_btn").prop("disabled", true);
		}
		else {
			$("#bw_date_btn").prop("disabled", false);
		}
		if (s.isSameOrAfter(max)) {
			$("#fw_date_btn").prop("disabled", true);
		}
		else {
			$("#fw_date_btn").prop("disabled", false);
		}

		if (s.isSameOrBefore(max) && s.isSameOrAfter(min)) {
			selected = s;
			cookie_selected_up();
		}

	}

	function cookie_range_up() {
		$.cookie('min', min.format("YYYY-MM-DD"), { path: '/' });
		$.cookie('max', max.format("YYYY-MM-DD"), { path: '/' });
	}

	if 	(($.cookie('min') == undefined || $.cookie('max') == undefined) || 
	!moment($.cookie('min'), "YYYY-MM-DD").isValid() ||
	!moment($.cookie('max'), "YYYY-MM-DD").isValid()) {
		cookie_range_nosave = true;
	}
	else{
		//Get Range from cookie
		min = moment($.cookie('min'), "YYYY-MM-DD");
		max = moment($.cookie('max'), "YYYY-MM-DD");
	}

	if ($.cookie('selected') == undefined || !moment($.cookie('select'), "YYYY-MM-DD").isValid()) {
		cookie_selected_nosave = true;
	}
	else {
		//Get selected from cookie
		setSel(moment($.cookie('selected'), "YYYY-MM-DD"));
	}

	//AJAX GET_RANGE - START OF Request-------------------------------
	$.ajax({
		url: "assets/php/get_range.php",
		cache: "false",
		type: "get",
		
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
			//setSel(min);
			getDayData();
		}
		else {
			if (cookie_selected_nosave) {
				setSel(min);
			}
		}
		init_selected(selected);
		init_daterange()
		cookie_range_up();

	}).fail(function (data) {
		alert("02, Error fetching available range");
	});
	//##AJAX GET_RANGE - END OF Request-------------------------------

	//AJAX GET_DAY_DATA - START OF Request----------------------------
	function getDayData() {
		$.ajax({
			url: "assets/php/get_day_data.php",
			type: "post",
			cache: "false",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: "selected=" + selected.format("YYYY-MM-DD"),

		}).done(function (data) {
			//On request received
			city_n = 0;
			var day_data = {
				"day_data": []
			};
			if (data[1] == '!') {
				//Handlebars data translation
				data.split('"').join('').split('!').join('').split("|").slice(0, -1).forEach(function (value, index) {
					var temp = value.split(";");
					day_data["day_data"][index] = {
						"id": temp[0], "name": temp[1],
						"tmin": temp[2], "tavg": temp[3], "tmax": temp[4],
						"sunny": temp[5] === "1", "snow": temp[6] === "1",
						"fog": temp[7] === "1", "rain": temp[8] === "1",
						"storm": temp[9] === "1", "hail": temp[10] === "1", "error": false
					};
					city_n++;
				});
				//Handlebars
				var carousel_template = $("#carousel-template").html();
				$('#carouselExampleCaptions').html(Handlebars.compile(carousel_template)(day_data));

				//Update indicators and items nodes
				for (var i = 0; i < city_n; i++) {
					indicators[i] = $("#indicator-" + i);
					items[i] = $("#item-" + i);
				}
				setObserver();
			}
			else {
				alert("03, Error fetching data");
				day_data["day_data"][0] = {
					"id": 0, "name": "NO DATA"
					, "tmin": "N/D", "tavg": "N/D", "tmax": "N/D",
					"sunny": false, "rain": false, "storm": false, "snow": false, "fog": false, "hail": false, "error": true
				};
				var carousel_template = $("#carousel-template").html();
				$('#carouselExampleCaptions').html(Handlebars.compile(carousel_template)(day_data));
			}
		}).fail(function (data) {
			alert("04, Error fetching data");
		});
		//##AJAX GET_DAY_DATA - END OF Request----------------------------
	}

	function init_selected(s) {
		$('#reportrange span').html(s.format('DD/MM/YY'));		//capitalize
		$('#selected_date').html(s.format('dddd D MMMM YYYY').replace(/^\w/, c => c.toUpperCase()));
		$('#selected_date_sm').html(s.format('Do MMM YYYY').replace(/^\w/, c => c.toUpperCase()));
		$('#reportrange').data('daterangepicker').setStartDate(s);
		$('#reportrange').data('daterangepicker').setEndDate(s);
		$('#reportrange_sm').data('daterangepicker').setStartDate(s);
		$('#reportrange_sm').data('daterangepicker').setEndDate(s);

		//AJAX get_day_data call
		getDayData();
	}

	function init_daterange() {
		$('#reportrange').daterangepicker({
			startDate: selected,
			endDate: selected,
			minDate: min,
			maxDate: max,
			opens: 'right',
			autoApply: true,
			linkedCalendars: false,
			alwaysShowCalendars: true,
			singleDatePicker: true,
			drops: 'down',
			parentEl: '#sidenavAccordion'
		}, (s, e) => {
			$('#reportrange span').html(s.format('DD/MM/YY'));
			$('#selected_date').html(s.format('dddd D MMMM YYYY').replace(/^\w/, c => c.toUpperCase()));
			$('#selected_date_sm').html(s.format('Do MMM YYYY').replace(/^\w/, c => c.toUpperCase()));
			$('#reportrange_sm').data('daterangepicker').setStartDate(s);
			$('#reportrange_sm').data('daterangepicker').setEndDate(e);
			setSel(s);

			//AJAX get_day_data call
			getDayData();
		});

		$('#reportrange_sm').daterangepicker({
			startDate: selected,
			endDate: selected,
			minDate: min,
			maxDate: max,
			opens: 'left',
			autoApply: true,
			linkedCalendars: false,
			alwaysShowCalendars: true,
			singleDatePicker: true,
			drops: 'down',
			parentEl: '#sidenavAccordion'
		}, (s, e) => {
			$('#reportrange span').html(s.format('DD/MM/YY'));
			$('#selected_date').html(s.format('dddd D MMMM YYYY').replace(/^\w/, c => c.toUpperCase()));
			$('#selected_date_sm').html(s.format('Do MMM YYYY').replace(/^\w/, c => c.toUpperCase()));
			$('#reportrange').data('daterangepicker').setStartDate(s);
			$('#reportrange').data('daterangepicker').setEndDate(e);
			setSel(s);

			//AJAX get_day_data call
			getDayData();
		});

		//set text @ selected
		init_selected(selected);
	}

	init_daterange();

	//Buttons set Date
	$('#bw_date_btn').click(function () {
		setSel(selected.subtract(1, 'days'));
		init_selected(selected);
	});

	$('#fw_date_btn').click(function () {
		setSel(selected.add(1, 'days'));
		init_selected(selected);
	});

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