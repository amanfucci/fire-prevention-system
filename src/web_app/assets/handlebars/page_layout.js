/*!
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/



(function ($) {
	var sidenav_user_type = {
		"amministratore": '<!DOCTYPE html><div id="layoutSidenav_nav"><nav class="sidenav shadow-right sidenav-light"><div class="sidenav-menu"><div class="nav accordion" id="accordionSidenav"><!-- Sidenav Link (Home)--> <a class="nav-link" href="index.html"><div class="nav-link-icon"><i class="bi bi-map-fill" aria-hidden="true"></i></div>Home </a><!-- Sidenav Link (User Area)--> <a class="nav-link" href="user_area.html"><div class="nav-link-icon"><i class="bi bi-person-fill" aria-hidden="true"></i></div>User Area </a><a class="nav-link collapsed" href="javascript:void(0);" data-toggle="collapse" data-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages"><div class="nav-link-icon"><i class="bi bi-archive-fill"></i></div>Data<div class="sidenav-collapse-arrow"><i class="fa fa-angle-down"></i></div></a><div class="collapse" id="collapsePages" data-parent="#accordionSidenav" style=""><nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu"><!-- Sidenav Link (Data List)--> <a class="nav-link" href="readings.html">Readings </a><!-- Sidenav Link (Nodes List)--> <a class="nav-link" href="nodes.html">Nodes </a><!-- Sidenav Link (Snapshot List)--> <a class="nav-link" href="snapshots.html">Snpashots</a></nav></div></div></div></nav></div>',
		"tecnico": '',
		"utente": "",
		"supervisore": ""
	}
	var layout = {
		"topnav": "<nav class='topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white'id='sidenavAccordion'><!-- Navbar Brand--><!-- * * Tip * * You can use text or an image for your navbar brand.--><!-- * * * * * * When using an image, we recommend the SVG format.--><!-- * * * * * * Dimensions: Maximum height: 32px, maximum width: 240px--><a class='navbar-brand active' href=''>Fire Prevention System</a><!-- Sidenav Toggle Button--><button class='btn btn-icon btn-transparent-dark order-0 order-lg-0' id='sidebarToggle'><i class='bi bi-list'></i></button><a class='btn btn-icon btn-transparent-dark order-1 order-lg-1' href='login.html'><i data-feather='log-in'></i></a><button class='btn btn-icon btn-transparent-dark order-2 order-lg-2' onclick='log_out()'><i data-feather='log-out'></i></button></nav>",
		"footer": "<!-- Footer --> <footer class='footer mt-auto footer-light'> <div class='container-fluid'> <div class='row'> <div class='col-md-12 small'>Copyright © 2021 Manfu</div></div></div></footer>",
		"sidenav": "<div id='layoutSidenav_nav'> <nav class='sidenav shadow-right sidenav-light'> <div class='sidenav-menu'> <div class='nav accordion' id='accordionSidenav'> <!-- Sidenav Link (Home)--> <a class='nav-link' href='index.html'> <div class='nav-link-icon'> <i class='bi bi-map-fill' aria-hidden='true'></i> </div> Home </a> <!-- Sidenav Link (Charts)--> <a class='nav-link' href='charts.html'> <div class='nav-link-icon'> <i class='bi bi-bar-chart-line-fill' aria-hidden='true'></i> </div> Charts </a> <!-- Sidenav Link (Tables)--> <a class='nav-link' href='tables.html'> <div class='nav-link-icon'> <i class='bi bi-table' aria-hidden='true'></i> </div> Tables </a> <!-- Sidenav Link (Forecast)--> <a class='nav-link' href='forecast.html'> <div class='nav-link-icon'> <i class='bi bi-clock-fill' aria-hidden='true'></i> </div> Forecast</a></div></div></a></nav></div>"
	};
	if (!!$.cookie('user_type') && !!$.cookie('user'))
		layout['sidenav'] = sidenav_user_type[$.cookie('user_type')];

	$("#topnav-container").html(Handlebars.compile("{{{topnav}}}")(layout));
	$("#sidenav-container").html(Handlebars.compile("{{{sidenav}}}")(layout));
	$("#footer-container").html(Handlebars.compile("{{{footer}}}")(layout));

})(jQuery);
