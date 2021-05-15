/*!
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/



(function ($) {
	var sidenav_user_type = {
		"amministratore": '<!DOCTYPE html><div id="layoutSidenav_nav"><nav class="sidenav shadow-right sidenav-light"><div class="sidenav-menu"><div class="nav accordion" id="accordionSidenav"><!-- Sidenav Link (Home)--> <a class="nav-link" href="index.html"><div class="nav-link-icon"><i class="bi bi-map-fill"></i></div>Home </a><!-- Sidenav Link (User Area)--> <a class="nav-link" href="user_area.php"><div class="nav-link-icon"><i class="bi bi-person-fill"></i></div>User Area </a><a class="nav-link collapsed" href="javascript:void(0);" data-toggle="collapse" data-target="#collapse_data" aria-expanded="false" aria-controls="collapse_data"><div class="nav-link-icon"><i class="bi bi-archive-fill"></i></div>Data<div class="sidenav-collapse-arrow"><i class="fa fa-angle-down"></i></div></a><div class="collapse" id="collapse_data" data-parent="#accordionSidenav"><nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu"><!-- Sidenav Link (Data List)--> <a class="nav-link" href="readings.php">Readings </a><!-- Sidenav Link (Nodes List)--> <a class="nav-link" href="nodes.php">Nodes </a><!-- Sidenav Link (Snapshot List)--> <a class="nav-link" href="snapshots.php">Snapshots</a></nav></div></div></div></nav></div>',
		"tecnico": '',
		"utente": '<!DOCTYPE html><div id="layoutSidenav_nav"><nav class="sidenav shadow-right sidenav-light"><div class="sidenav-menu"><div class="nav accordion" id="accordionSidenav"><!-- Sidenav Link (Home)--> <a class="nav-link" href="index.html"><div class="nav-link-icon"><i class="bi bi-map-fill"></i></div>Home </a><!-- Sidenav Link (User Area)--> <a class="nav-link" href="user_area.php"><div class="nav-link-icon"><i class="bi bi-person-fill"></i></div>User Area </a><a class="nav-link collapsed" href="javascript:void(0);" data-toggle="collapse" data-target="#collapse_data" aria-expanded="false" aria-controls="collapse_data"><div class="nav-link-icon"><i class="bi bi-archive-fill"></i></div>Data<div class="sidenav-collapse-arrow"><i class="fa fa-angle-down"></i></div></a><div class="collapse" id="collapse_data" data-parent="#accordionSidenav"><nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu"><!-- Sidenav Link (Data List)--> <a class="nav-link" href="readings.php">Readings </a><!-- Sidenav Link (Nodes List)--> <a class="nav-link" href="nodes.php">Nodes </a><!-- Sidenav Link (Snapshot List)--> <a class="nav-link" href="snapshots.php">Snapshots</a></nav></div></div></div></nav></div>',
		"supervisore": ""
	}
	var layout = {
		"topnav": "<nav class='topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white'id='sidenavAccordion'><!-- Navbar Brand--><!-- * * Tip * * You can use text or an image for your navbar brand.--><!-- * * * * * * When using an image, we recommend the SVG format.--><!-- * * * * * * Dimensions: Maximum height: 32px, maximum width: 240px--><a class='navbar-brand active' href=''>Fire Prevention System</a><!-- Sidenav Toggle Button--><button class='btn btn-icon btn-transparent-dark order-12 order-lg-0 ml-auto ml-lg-0' id='sidebarToggle'><i class='bi bi-list'></i></button><a class='btn btn-icon btn-transparent-dark order-1 order-lg-1' href='login.html'><i data-feather='log-in'></i></a><button class='btn btn-icon btn-transparent-dark order-2 order-lg-2' id='logOut'><i data-feather='log-out'></i></button></nav>",
		"footer": "<!-- Footer --> <footer class='footer mt-auto footer-light'> <div class='container-fluid'> <div class='row'> <div class='col-md-12 small'>Copyright © 2021 Manfu</div></div></div></footer>",
		"sidenav": '<div id="layoutSidenav_nav"><nav class="sidenav shadow-right sidenav-light"><div class="sidenav-menu"><div class="nav accordion" id="accordionSidenav"><!-- Sidenav Link (Home)--> <a class="nav-link" href="index.html"><div class="nav-link-icon"><i class="bi bi-map-fill"></i></div>Home</a></div></div></nav></div>'
	};
	if (!!$.cookie('user_type') && !!$.cookie('user'))
		layout['sidenav'] = sidenav_user_type[$.cookie('user_type')];

	$("#topnav-container").html(Handlebars.compile("{{{topnav}}}")(layout));
	$("#sidenav-container").html(Handlebars.compile("{{{sidenav}}}")(layout));
	$("#footer-container").html(Handlebars.compile("{{{footer}}}")(layout));

})(jQuery);
