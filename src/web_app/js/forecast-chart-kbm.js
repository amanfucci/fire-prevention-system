/*!
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/

$(function () {

	var city, city_n = 0;
	var dataSet;
	var get_err = false;
	var get_city_n_err = false;

	getCityData();

	//Hide calendar
	$('#reportrange_sm').prop("hidden", true);
	$('#reportrange').prop("hidden", true);

	function setChart(data, i) {
		if ($("#chart-" + i).length) {
			$("#chart-" + i).remove();
		}
		$("#chart-container-" + i).append("<div id='chart-" + i + "' style='height:80vh; padding:0px'></div>");
		am4core.ready(function () {

			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			// Create chart instance
			var chart = am4core.create("chart-" + i, am4charts.XYChart);
			chart.hiddenState.properties.opacity = 0;
			//am4charts.AxisRendererY.renderer.minGridDistance = 100;
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

			chart.exporting.filePrefix = "tn_chart_" + city['city'][i]['name'] + '_forecast';
			chart.exporting.title = "TerraNovaSoftware © - " + city['city'][i]['name'] + ' - '
				+ 'forecast';
			var options = chart.exporting.getFormatOptions("pdf");
			options.scale = 2;
			chart.exporting.setFormatOptions("pdf", options);
			// Create axes
			var monthAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			monthAxis.dataFields.category = "Mese";
			monthAxis.minZoomCount = 2;
			// this makes the data to be grouped

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

					valueAxis.tooltip.disabled = true;
					valueAxis.renderer.line.strokeOpacity = 1;
					valueAxis.renderer.line.strokeWidth = 2;
					valueAxis.renderer.opposite = rightBar;
					valueAxis.renderer.minGridDistance = 100;
				}

				// Create series
				var series = chart.series.push(new am4charts.LineSeries());
				series.dataFields.categoryX = "Mese";
				series.dataFields.valueY = item;
				series.xAxis = monthAxis;
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

				if (newAxis) {

					valueAxis.renderer.line.stroke = series.stroke;
					valueAxis.renderer.labels.template.fill = series.stroke;
					return valueAxis;
				}
			}
			var temperatureAxis = createAxisAndSeries("TAVG", true, "°C", true);
			createAxisAndSeries("TMin", true, "°C", true, temperatureAxis);
			createAxisAndSeries("TMax", true, "°C", true, temperatureAxis);
			createAxisAndSeries("ChanceP", false, "%", false);

			// Add legend
			chart.legend = new am4charts.Legend();
			chart.legend.scrollable = true;
			chart.legend.maxHeight = 60;
			// Add cursor
			chart.cursor = new am4charts.XYCursor();
			chart.cursor.xAxis = monthAxis;
			// Add scrollbar
			chart.scrollbarX = new am4core.Scrollbar();
			chart.scrollbarX.exportable = false;

		}); // end am4core.ready()

	}

	//##AJAX GET_CITY_FORECAST - START OF Request-------------------------
	function sendAjax(i, city_db_i) {
		$.ajax({
			url: "assets/php/get_city_forecast.php",
			type: "post",
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: "&city=" + city_db_i,
			cache: "false",

		}).done(function (data) {
			dataSet[city_db_i] = JSON.parse(data);
			setChart(dataSet[city_db_i], i);
		}).fail(function (data) {
			alert("01, Error fetching data for " + city["city"][i]["name"]);
		});
	}

	function onFirstRequestEnd() {
		dataSet = [];
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
			cache: "false",

		}).done(function (data) {
			if (data[1] == '!') {
				//Remove ! " from string, then split for |
				city_n_forecast = data.split('"').join("").split('!').join('').split('|').slice(0, -1);
				city_n = parseInt(city_n_forecast[0]);

				for (var i = 0; i < city_n; i++) {
					//Split each object for ;
					var temp = city_n_forecast[i + 1].split(";");
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
			alert("02, Error fetching data");
			city_n = 1;
			city["city"][0] = { "id": "0", "name": "NO DATA" };
			get_city_n_err = true;
			onFirstRequestEnd();
		});

	}
	//##AJAX GET_CITY_FORECAST - END OF Request-------------------------

	function getArr(obj, index) {
		var arr = [];
		for (var i = 0; i < obj.length; i++) {
			arr[i] = obj[i][index];
		}
		return arr;
	}

	function formatData(data) {
		temp = [];
		for (var i = 0; i < data.length; i++) {
			temp[i] = {
				"date": data[i][0], "MSLP": data[i][1], "Tmin": data[i][3],
				"TAVG": data[i][4], "TMax": data[i][5], "Dew Point": data[i][2], "Humidity": data[i][6],
				"AVGWind": data[i][8], "MaxWind": data[i][9], "Vis.": data[i][7]
			};
		}
		temp.sort(function (a, b) {
			return new Date(a.date) - new Date(b.date);
		});
		return temp;
	}

});