<?
include "assets/php/conn_lib.php";
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
    <title>Requests - FPS</title>
    <link rel="icon" type="image/x-icon" href="img/pc_icon.png">

    <!--Theme js/css-->
    <script id="ga-gtag" type="text/javascript" async src="assets/theme/js/js.js"></script>
    <link href="assets/theme/css/styles2.css" rel="stylesheet">
    <link href="assets/theme/css/styles.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="assets/DataTables/datatables.min.css" />
    <link href="assets/DataTables/DataTables-1.10.24/css/dataTables.bootstrap4.min.css" rel="stylesheet">
    <script src="assets/theme/js/all.min.js.download"></script>

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
                                            <i class="bi bi-binoculars-fill icon-h1"></i>
                                        </div>
                                        Requests
                                    </h1>
                                    <div class="page-header-subtitle">Follow your requests
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <!-- Main page content-->
                <div class="container mt-n10">

                    <?
                    if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
                        header("location: error_401.html");
                    if ($_SESSION['user_type'] == 'utente' || $_SESSION['user_type'] == 'tecnico')
                        header("location: error_401.html");

                    $sql = [];
                    $result = [];
                    $row = [];
                    $sql[0] = "SELECT * FROM richieste inner join utenti on tecnico = utenteId where supervisore = (select utenteId from utenti where email like '" . $_SESSION['user'] . "') order by timestamp desc";
                    $result[0] = $conn->query($sql[0]);
                    $card_template = [
                        'open' => '<div class="card mb-4">
                                        <div class="card-header">',
                        'icon' => '<i class = "bi bi-clock-fill icon-h4 pr-4 text-warning"></i>',
                        'header' => '',
                        'body' => '</div>
                                    <div class="card-body">
                                    <div class="dataTable">
                                    <table class="table table-responsive-lg table-bordered table-hover nowrap" style="width: 100%;">',
                        'footer' => '</table></div></div><div class="card-footer">',
                        'close' => '</div></div>'
                    ];
                    $p2text = ['1' => 'Low', '2' => 'Medium', '3' => 'High'];
                    if (!empty($result[0]) && $result[0]->num_rows > 0) {

                        while ($row[0] = $result[0]->fetch_assoc()) {
                            $card = $card_template;
                            //Print card header
                            $card['header'] .= $row[0]['timestamp'] . ' (Id: ' . $row[0]['richiestaId'] . '), ' . $p2text[$row[0]['urgenza']] . ' Priority';
                            $card['footer'] .= 'Assigned to ' . $row[0]['nome'] . ' ' . $row[0]['cognome'] . " (Id: " . $row[0]['tecnico'] . ")"
                                . ' for the reason: \'<i>' . $row[0]['motivazione'] . '</i>\'
                                <p>Node: ' . $row[0]['sensore'] .'</p>';
                            $sql[1] = "SELECT i.interventoId as Id, i.timestamp as timestamp, i.descrizione as Description, i.risolutivo as Solved
                            FROM richieste as r
                            inner join interventi as i on richiesta = richiestaId
                            where r.richiestaId = " . $row[0]['richiestaId'] .
                            " order by i.timestamp desc";
                            $result[1] = $conn->query($sql[1]);
                            if (!empty($result[1]) && $result[1]->num_rows > 0) {
                                $first = true;
                                while ($row[1] = $result[1]->fetch_assoc()) {
                                    //Print header checkmark and card body
                                    $line = "<tr>";

                                    if ($first)
                                        $card['body'] .= "<thead><tr>";

                                    foreach ($row[1] as $k => $v) {
                                        if ($first) {
                                            $card['body'] .= "<th>" . $k . "</th>";
                                        }

                                        if ($k == "Solved") {
                                            if ($v == 1) {
                                                $v = 'Yes';
                                                $card['icon'] = '<i class = "bi-check-circle-fill icon-h4 pr-4"></i>';
                                            } else
                                                $v = 'No';
                                        }

                                        $line .= "<td>" . $v . "</td>";
                                        //If It has been resolved, print checkmark

                                    }

                                    if ($first)
                                        $card['body'] .= "</tr></thead><tbody>";

                                    $line .= "</tr>";
                                    $card['body'] .= $line;
                                    $first = false;
                                }
                            } else {
                                $card['body'] .= "<p class='no-services'>No on-site service yet</p>";
                            }
                            foreach ($card as $element) {
                                echo $element;
                            }
                        }
                    } else {
                        $card = $card_template;
                        $card['header'] .= 'No forwarded request';
                        $card['body'] .= '<a class="text-arrow-icon" href="forward_requests.php"><i class="bi bi-arrow-right-short icon-h1"></i>Go to Forward new requests</a><p class="no-services"></p>';
                        $card['icon'] = '<i class = "bi bi-x-circle-fill icon-h4 pr-4"></i>';
                        $card['footer'] .= '. . .';
                        foreach ($card as $element) {
                            echo $element;
                        }
                    }

                    ?>

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
    <!--MANFU js-->
    <script src="js/authenticate-manfu.js"></script>
    <script src="js/view-requests-manfu.js"></script>

</body>

</html>