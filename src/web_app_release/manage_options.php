<?php
include "assets/php/conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: error_401.html");
if ($_SESSION['user_type'] != 'amministratore')
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
    <title>Users - FPS</title>
    <link rel="icon" type="image/x-icon" href="img/pc_icon.png">

    <!--Theme js/css-->
    <script id="ga-gtag" type="text/javascript" async src="assets/theme/js/js.js"></script>
    <link href="assets/theme/css/styles2.css" rel="stylesheet">
    <link href="assets/theme/css/styles.css" rel="stylesheet">
    <link href="assets/DataTables/DataTables-1.10.24/css/dataTables.bootstrap4.min.css" rel="stylesheet">
    <link href="assets/daterangepicker/daterangepicker.css" rel="stylesheet">
    <script src="assets/theme/js/all.min.js.download"></script>
    <link href="assets/theme/css/selectize.bootstrap4.css" rel="stylesheet">
    <!--Icons-->
    <link rel="stylesheet" href="assets/theme/css/bootstrap-icons.css">
    <script src="assets/theme/js/feather.min.js.download"></script>
    <!--MANFU css -->
    <link rel="stylesheet" href="css/manfu.css">
    <style>
        .selectize-input {
            height: calc(1em + 1.75rem + 2px);
            display: block;
            width: 100%;
            height: calc(1em + 1.75rem + 2px);
            padding: 0.875rem 1.125rem;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1;
            color: #69707a;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #c5ccd6;
            border-radius: 0.35rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .selectize-dropdown-content {
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.35rem;
        }

        .selectize-dropdown-content div {
            padding: 0.875rem 1.125rem;
        }

        .selectize-input [data-value] .email {
            opacity: 0.5;
        }

        .selectize-input [data-value] .name+.email {
            margin-left: 5px;
        }

        .selectize-dropdown .caption {
            font-size: 12px;
            display: block;
            opacity: 0.5;
        }
    </style>
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
                                            <i class="bi bi-shield-lock-fill icon-h1"></i>
                                        </div>
                                        Options
                                    </h1>
                                    <div class="page-header-subtitle">Manage App Options
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
                            <form id='form-1'>
                                <div class="form-row">
                                    <!-- Form Group (Snapshot Interval)-->
                                    <div class="form-group">
                                        <label for="inputSN" class="text-dark font-weight-500">Snapshot Interval</label>
                                        <p id="labelDescr"></p>
                                        <input class="form-control" min=5 max=180 step=5 type="number" name="inputSN" id="inputSN" required>
                                    </div>

                                </div>
                                <!-- Form Group (Auto Snapshot On)-->
                                <div class="custom-control custom-checkbox ml-2">
                                    <input class="custom-control-input" id="inputAuto" type="checkbox" value="1">
                                    <label class="custom-control-label" for="inputAuto">Auto Snapshot</label>
                                </div>
                                <!-- Form Group (Submit box)-->
                                <div class="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                                    <a class="btn btn-primary" id="inputSubmit">Submit</a>
                                    <a class="align-text-bottom isDisabled" hidden id="errorSubmit">Error updating options please contact the IT department</a>
                                </div>
                            </form>
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
    <script src="assets/jquery/jquery-validate/jquery.validate.min.js"></script>
    <script src="assets/jquery/jquery-validate/additional-methods.min.js"></script>

    <!--Date Picker js-->
    <script src="assets/daterangepicker/moment-with-locales.min.js"></script>
    <script src="assets/daterangepicker/daterangepicker.min.js"></script>
    <!--MANFU Hb-->
    <script src="assets/handlebars/handlebars.min-v4.7.6.js"></script>
    <script src="assets/handlebars/page_layout.js"></script>
    <!--Theme js-->
    <script defer src="assets/theme/js/bootstrap.bundle.min.js"></script>
    <script defer src="assets/theme/js/scripts.js"></script>
    <script defer src="assets/theme/js/selectize.min.js"></script>
    <!--MANFU js-->
    <script src="js/authenticate-manfu.js"></script>
    <script src="js/manage-options-manfu.js"></script>

</body>

</html>