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

	if 	(($.cookie('min') == undefined || $.cookie('max') == undefined) || 
	!moment($.cookie('min'), "YYYY-MM-DD").isValid() ||
	!moment($.cookie('max'), "YYYY-MM-DD").isValid()){
		cookie_range_nosave = true;
	}
	else{
		//Get Range from cookie
		min = moment($.cookie('min'), "YYYY-MM-DD");
		max = moment($.cookie('max'), "YYYY-MM-DD");
	}

	if 	(($.cookie('start') == undefined || $.cookie('end') == undefined) || 
	!moment($.cookie('start'), "YYYY-MM-DD").isValid() ||
	!moment($.cookie('end'), "YYYY-MM-DD").isValid()) {
		cookie_cursor_nosave = true;
	}
	else{

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
		cookie_cursor_up();
		cookie_range_up();
		init_daterange();

	}).fail(function (data) {
		alert("02, Error fetching available range");
		init_daterange();
	});
	//##AJAX GET_RANGE - END OF Request-------------------------------

	function setChart(data, i) {
		if ($("#chart-" + i).length) {
			$("#chart-" + i).remove();
		}
		if ($("#pie-" + i).length) {
			$("#pie-" + i).remove();
		}
		$("#chart-container-" + i).append("<div id='chart-" + i + "' style='height:80vh; padding:0px'></div>");
		$("#chart-container-" + i).append("<div id='pie-" + i + "' style='height:40vh; padding:0px'></div>");

		am4core.ready(function () {

			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			// Create chart instance
			var chart = am4core.create("chart-" + i, am4charts.XYChart);
			chart.hiddenState.properties.opacity = 0;
			chart.dateFormatter.dateFormat = "yyyy-MM-dd";
			// Add data
			chart.data = data;
			//Increase contrast
			chart.colors.step = 2;
			//Export
			chart.exporting.menu = new am4core.ExportMenu();
			chart.exporting.menu.items = [{
				label: "...",
				menu: [{ type: "pdf", label: "PDF" }]
			}];

			chart.exporting.filePrefix = "tn_chart_" + city['city'][i]['name'] + start.format('_Y_MM_DD') + '_to_' + end.format('Y_MM_DD');
			chart.exporting.title = "TerraNovaSoftware © - " + city['city'][i]['name'] + ' - '
				+ start.format('Do MMM Y') + ' to ' + end.format('Do MMM Y');
			var options = chart.exporting.getFormatOptions("pdf");
			options.scale = 2;
			chart.exporting.setFormatOptions("pdf", options);
			// Create axes
			var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

			dateAxis.baseInterval = {
				timeUnit: "day",
				count: 1
			};
			dateAxis.minZoomCount = 5;
			// this makes the data to be grouped
			dateAxis.groupData = true;
			dateAxis.groupCount = 50;

			function toggleAxes(ev) {
				var axis = ev.target.yAxis;
				var disabled = true;
				axis.series.each(function (series) {
					if (!series.isHiding && !series.isHidden) {
						disabled = false;
					}
				});
				axis.disabled = disabled;
			}

			function createAxisAndSeries(item, rightBar, UoM, show, valueAxis) {
				var newAxis = valueAxis === undefined;
				if (newAxis) {
					valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
					valueAxis.numberFormatter = new am4core.NumberFormatter();
					valueAxis.numberFormatter.numberFormat = "##.' " + UoM + "'";
					if (chart.yAxes.indexOf(valueAxis) != 0) {
						valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
					}
				}

				// Create series
				var series = chart.series.push(new am4charts.LineSeries());
				series.dataFields.dateX = "DataRequested";
				series.dataFields.valueY = item;
				series.yAxis = valueAxis;
				series.name = item;
				series.tooltipText = "{name}: [bold]{valueY} " + UoM + "[/]";
				series.tooltip.pointerOrientation = "vertical";
				series.connect = false;
				series.tensionX = 0.8;
				series.strokeWidth = 2;
				series.hidden = !show;
				series.sequencedInterpolation = true;
				series.events.on("hidden", toggleAxes);
				series.events.on("shown", toggleAxes);
				series.defaultState.transitionDuration = 1500;
				if (item == "TMax") {
					series.dataFields.openValueY = "TMin";
					series.fillOpacity = 0.3;
				}
				if (item == "MaxWind") {
					series.dataFields.openValueY = "AVGWind";
					series.fillOpacity = 0.3;
				}

				if (newAxis) {
					valueAxis.tooltip.disabled = true;
					valueAxis.renderer.line.strokeOpacity = 1;
					valueAxis.renderer.line.strokeWidth = 2;
					valueAxis.renderer.line.stroke = series.stroke;
					valueAxis.renderer.labels.template.fill = series.stroke;
					valueAxis.renderer.opposite = rightBar;
					return valueAxis;
				}
			}
			createAxisAndSeries("MSLP", false, "hPa", false);
			var temperatureAxis = createAxisAndSeries("TMin", true, "°C", true);
			createAxisAndSeries("TAVG", true, "°C", false, temperatureAxis);
			createAxisAndSeries("TMax", false, "%", false, temperatureAxis);
			createAxisAndSeries("DewPoint", false, "%", false, temperatureAxis);
			var speedAxis = createAxisAndSeries("AVGWind", true, "km/h", false);
			createAxisAndSeries("MaxWind", true, "km/h", false, speedAxis);
			createAxisAndSeries("Visibility", false, "km", false);

			// Add legend
			chart.legend = new am4charts.Legend();
			chart.legend.scrollable = true;
			chart.legend.maxHeight = 60;
			// Add cursor
			chart.cursor = new am4charts.XYCursor();
			chart.cursor.xAxis = dateAxis;
			// Add scrollbar
			chart.scrollbarX = new am4core.Scrollbar();
			chart.scrollbarX.exportable = false;

		}); // end am4core.ready()

		//Pie Chart
		am4core.ready(function () {

			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			// Create chart instance
			var chart = am4core.create("pie-" + i, am4charts.PieChart);
			var title = chart.titles.create();
			title.text = "Atmospheric events";
			title.fontSize = 25;
			title.marginBottom = 30;
			// Add data
			var obj = getEvents(data);
			chart.data = obj;
			//Export
			chart.exporting.menu = new am4core.ExportMenu();
			chart.exporting.menu.items = [{
				label: "...",
				menu: [{ type: "pdf", label: "Pdf" },
				{ type: "xlsx", label: "Excel" }
				]
			}];
			chart.exporting.filePrefix = "tn_pie_" + city['city'][i]['name'] + start.format('_Y_MM_DD') + '_to_' + end.format('Y_MM_DD');
			chart.exporting.title = "TerraNovaSoftware © - " + city['city'][i]['name'] + ' - '
				+ start.format('Do MMM Y') + ' to ' + end.format('Do MMM Y');
			var options = chart.exporting.getFormatOptions("pdf");
			options.scale = 2;
			chart.exporting.setFormatOptions("pdf", options);
			// Add and configure Series
			var pieSeries = chart.series.push(new am4charts.PieSeries());
			pieSeries.dataFields.value = "Value";
			pieSeries.dataFields.category = "Item";
			pieSeries.slices.template.stroke = am4core.color("#fff");
			pieSeries.slices.template.strokeOpacity = 1;

			// This creates initial animation
			pieSeries.hiddenState.properties.opacity = 1;
			pieSeries.hiddenState.properties.endAngle = -90;
			pieSeries.hiddenState.properties.startAngle = -90;

			chart.hiddenState.properties.radius = am4core.percent(0);


		});  //end am4core.ready()


	}

	//##AJAX GET_CITY_DATA - START OF Request-------------------------
	function sendAjax(i, city_db_i) {
		$.ajax({
			url: "assets/php/get_city_data.php",
			type: "post",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: "start=" + start.format("YYYY-MM-DD") + "&end=" + end.format("YYYY-MM-DD")
				+ "&city=" + city_db_i,
		}).done(function (data) {
			dataSet[city_db_i] = JSON.parse(data);
			setChart(dataSet[city_db_i], i);
		}).fail(function (data) {
			alert("03, Error fetching data for " + city["city"][i]["name"]);
		});
	}

	function onFirstRequestEnd() {
		dataSet = {};
		for (var i = 0; i < city_n; i++) {
			var city_db_i = city["city"][i]["id"];
			sendAjax(i, city_db_i);
		}
	}

	function getCityData() {
		city = { "city": [] };
		$.ajax({
			url: "assets/php/get_city_n.php",
			type: "get",
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
			alert("04, Error fetching data");
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

	function getArr(obj, index) {
		var arr = [];
		for (var i = 0; i < obj.length; i++) {
			arr[i] = obj[i][index];
		}
		return arr;
	}

	function getEvents(data) {
		temp = [
			{ "Item": "Hail", "Value": 0 }, { "Item": "Sunny", "Value": 0 },
			{ "Item": "Snow", "Value": 0 }, { "Item": "Fog", "Value": 0 },
			{ "Item": "Rain", "Value": 0 }, { "Item": "Storm", "Value": 0 }
		];
		for (var i = 0; i < 6; i++) {
			temp[i]["Value"] = getArr(data, temp[i]["Item"].toLowerCase()).reduce((a, b) => {
				return a + b;
			});
		}
		return temp;
	}
});