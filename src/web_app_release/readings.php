<?php
include "assets/php/conn_lib.php";
if (
	!isset($_SESSION['user']) || !isset($_SESSION['user_type']) ||
	empty($_SESSION['user']) || empty($_SESSION['user_type'])
	)
	header("location: error_401.html");
?>
<!--
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/-->
<!DOCTYPE html>
<html lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="WebApp per il controllo degli incendi nella pineta di Grosseto">
	<meta name="author" content="MANFU">
	<title>Data - FPS</title>
	<link rel="icon" type="image/x-icon" href="img/pc_icon.png">

	<!--Theme js/css-->
	<script id="ga-gtag" type="text/javascript" async src="assets/theme/js/js.js"></script>
	<link href="assets/theme/css/styles2.css" rel="stylesheet">
	<link href="assets/theme/css/styles.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="assets/DataTables/datatables.min.css" />
	<link href="assets/DataTables/DataTables-1.10.24/css/dataTables.bootstrap4.min.css" rel="stylesheet">
	<script src="assets/theme/js/all.min.js.download"></script>
	<script src="assets/theme/js/feather.min.js.download"></script>

	<!--Icons-->
	<script src="assets/theme/js/feather.min.js.download"></script>
	<link rel="stylesheet" href="assets/theme/css/bootstrap-icons.css">
	<link rel="stylesheet" href="assets/theme/css/font-awesome.css">
	<!--MANFU css-->
	<link rel="stylesheet" href="css/manfu.css">
</head>

<body class="nav-fixed" data-new-gr-c-s-check-loaded="14.998.0" data-gr-ext-installed="" id="myBody">
	<!--Topnav-->
	<div id="topnav-container">
	</div>

	<div id="check_window" class="d-none d-md-block"></div>
	<div id="layoutSidenav">
		<div id="sidenav-container">
		</div>
		<div id="layoutSidenav_content">
			<main>
				<header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
					<div class="container">
						<div class="page-header-content pt-4">
							<div class="row align-items-center justify-content-between">
								<div class="col-auto mt-4">
									<h1 class="page-header-title">
										<div class="page-header-icon">
											<i class="bi bi-archive-fill icon-h1"></i>
										</div>
										Readings
									</h1>
									<div class="page-header-subtitle">View all the readings
									</div>
								</div>
							</div>
						</div>
					</div>
				</header>
				<!-- Main page content-->
				<div class="container mt-n10" id="data-content">

					<div class="card mb-4">
						<div class="card-body">
							<div class="dataTable">
								<div id="spinner_table" class="spinner-border text-primary" role="status">
									<span class="sr-only">Loading...</span>
								</div>
								<table id="table-0" class="table table-responsive-lg table-bordered table-hover nowrap" style="width: 100%; min-height: 5vh;">

								</table>
							</div>
						</div>
					</div>

				</div>

			</main>
			<div id="footer-container"></div>
		</div>
	</div>

	</div>

	<!--JQuery-->
	<script src="assets/jquery/jquery-3.5.1.min.js"></script>
	<script src="assets/jquery/jquery.cookie.js"></script>
	<!--MANFU Hb-->
	<script src="assets/handlebars/handlebars.min-v4.7.6.js"></script>
	<script src="assets/handlebars/page_layout.js"></script>
	<!--Theme js-->
	<script defer src="assets/theme/js/bootstrap.bundle.min.js"></script>
	<script defer src="assets/theme/js/scripts.js"></script>
	<script type="text/javascript" src="assets/DataTables/datatables.min.js"></script>
	<!--deck.gl-->
	<script src="assets/deck.gl/core.dist.min.js"></script>
	<script src="assets/deck.gl/carto.dist.min.js"></script>
	<script src="assets/deck.gl/mapbox-gl.js"></script>
	<!--MANFU js-->
	<script src="js/authenticate-manfu.js"></script>
	<script src="js/readings-manfu.js"></script>

</body>

</html>