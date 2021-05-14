<?php
session_start();
if (!$_SESSION['isAdmin'] || !isset($_SESSION['isAdmin']))
    header("location: ../unauthorized.php");
?>
<!DOCTYPE html>

<head>
    <link href="../css/icon.css" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="../css/materialize.css" media="screen,projection" />
</head>

<body class="container">
    <nav>
        <div class="nav-wrapper">
            <a class="brand-logo truncate">Database questionario</a>
            <a href="#" data-target="mobile-menu" class="sidenav-trigger"><i class="material-icons">menu</i></a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a href="admin_index.php">Home</a></li>
                <li><a href="init_form.php">Inizializza DB</a></li>
                <li><a href="populate.php">Popola</a></li>
                <li><a href="../logout.php">Log out</a></li>
            </ul>
        </div>
    </nav>
    <ul class="sidenav" id="mobile-menu">
        <li><a href="admin_index.php">Home</a></li>
        <li><a href="init_form.php">Inizializza DB</a></li>
        <li><a href="populate.php">Popola</a></li>
        <li><a href="../logout.php">Log out</a></li>
    </ul>
    <div class="row">
        <div class="col s6">
            <div class="card blue-grey">
                <div class="card-content white-text">
                    <span class="card-title">Inserimento dati</span>

                </div>
                <div class="card-action">
                    <ul>
                        <li><a href="insertAna_form.php">Inserisci anagrafica</a></li>
                        <li><a href="insertRisposta_form.php">Inserisci riposta</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col s6">
            <div class="card blue-grey">
                <div class="card-content white-text">
                    <span class="card-title">Query</span>

                </div>
                <div class="card-action">
                    <ul>
                        <li><a href="q1.php">Visualizza le risposte</a></li>
                        <li><a href="q2.php">Visualizza chi non ha risposte</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/jquery.js"></script>
    <script src="../js/materialize.js"></script>
    <script src="../js/init.js"></script>
</body>



</html>