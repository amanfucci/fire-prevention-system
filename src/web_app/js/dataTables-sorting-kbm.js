/*!
		* KBM - TN Weather
		* Copyright 2021 KBM
		* Licensed under SEE_LICENSE (https://gitlab.com/polotecnologico/5-bia-2020-2021/kbm/terranova_client/-/blob/master/LICENSE)
		*/

$.fn.dataTableExt.oSort['hPa-asc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" hPa", ""));
	y = parseFloat(b.replace(" hPa", ""));

	return (x < y) ? -1 : (x > y) ? 1 : 0 ;
};

$.fn.dataTableExt.oSort['hPa-desc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" hPa", ""));
	y = parseFloat(b.replace(" hPa", ""));

	return (x < y) ? 1 : (x > y) ? -1 : 0 ;
};

$.fn.dataTableExt.oSort['°C-asc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" °C", ""));
	y = parseFloat(b.replace(" °C", ""));

	return (x < y) ? -1 : (x > y) ? 1 : 0 ;
};

$.fn.dataTableExt.oSort['°C-desc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" °C", ""));
	y = parseFloat(b.replace(" °C", ""));

	return (x < y) ? 1 : (x > y) ? -1 : 0 ;
};

$.fn.dataTableExt.oSort['%-asc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" %", ""));
	y = parseFloat(b.replace(" %", ""));

	return (x < y) ? -1 : (x > y) ? 1 : 0 ;
};

$.fn.dataTableExt.oSort['%-desc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" %", ""));
	y = parseFloat(b.replace(" %", ""));

	return (x < y) ? 1 : (x > y) ? -1 : 0 ;
};

$.fn.dataTableExt.oSort['km-asc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" km", ""));
	y = parseFloat(b.replace(" km", ""));

	return (x < y) ? -1 : (x > y) ? 1 : 0 ;
};

$.fn.dataTableExt.oSort['km-desc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" km", ""));
	y = parseFloat(b.replace(" km", ""));

	return (x < y) ? 1 : (x > y) ? -1 : 0 ;
};

$.fn.dataTableExt.oSort['km/h-asc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" km/h", ""));
	y = parseFloat(b.replace(" km/h", ""));

	return (x < y) ? -1 : (x > y) ? 1 : 0 ;
};

$.fn.dataTableExt.oSort['km/h-desc'] = function (a, b) {
	var x, y;
	x = parseFloat(a.replace(" km/h", ""));
	y = parseFloat(b.replace(" km/h", ""));

	return (x < y) ? 1 : (x > y) ? -1 : 0 ;
};