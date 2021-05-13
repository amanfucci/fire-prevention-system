/*!
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/

var layout = {
	"topnav": "<nav class='topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white'id='sidenavAccordion'><!-- Navbar Brand--><!-- * * Tip * * You can use text or an image for your navbar brand.--><!-- * * * * * * When using an image, we recommend the SVG format.--><!-- * * * * * * Dimensions: Maximum height: 32px, maximum width: 240px--><a class='navbar-brand active' href=''>Fire Prevention System</a><!-- Sidenav Toggle Button--><button class='btn btn-icon btn-transparent-dark order-1 order-lg-0 mr-lg-2' id='sidebarToggle'><i class='bi bi-list'></i></button></nav>",
	"sidenav": "<div id='layoutSidenav_nav'> <nav class='sidenav shadow-right sidenav-light'> <div class='sidenav-menu'> <div class='nav accordion' id='accordionSidenav'> <!-- Sidenav Link (Home)--> <a class='nav-link' href='index.html'> <div class='nav-link-icon'> <i class='bi bi-house-fill' aria-hidden='true'></i> </div> Home </a> <!-- Sidenav Link (Charts)--> <a class='nav-link' href='charts.html'> <div class='nav-link-icon'> <i class='bi bi-bar-chart-line-fill' aria-hidden='true'></i> </div> Charts </a> <!-- Sidenav Link (Tables)--> <a class='nav-link' href='tables.html'> <div class='nav-link-icon'> <i class='bi bi-table' aria-hidden='true'></i> </div> Tables </a> <!-- Sidenav Link (Forecast)--> <a class='nav-link' href='forecast.html'> <div class='nav-link-icon'> <i class='bi bi-clock-fill' aria-hidden='true'></i> </div> Forecast </a></div> </div> </a> </nav></div>",
	"footer":" <!-- Footer --> <footer class='footer mt-auto footer-light'> <div class='container-fluid'> <div class='row'> <div class='col-md-12 small'>Copyright © 2021 Manfu</div></div></div></footer>"
};

(function ($) {

	$("#topnav-container").html(Handlebars.compile("{{{topnav}}}")(layout));
	$("#sidenav-container").html(Handlebars.compile("{{{sidenav}}}")(layout));
	$("#footer-container").html(Handlebars.compile("{{{footer}}}")(layout));

})(jQuery);