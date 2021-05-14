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
    <form action="insertAna.php" method="POST">
        <h4>Inserisci anagrafica</h4>

        <div class="row">
            <div class="input-field col s4">
                <input id="nome" name="nome" type="text" autocapitalize="on" class="validate" required />
                <label for="nome">Nome</label>
            </div>
            <div class="input-field col s4">
                <input id="cognome" name="cognome" type="text" class="validate" required />
                <label for="cognome">Cognome</label>
            </div>
        </div>

        <div class="row">
            <div class="input-field col s4">
                <input id="citta" name="citta" type="text" class="validate" required />
                <label for="citta">Citta'</label>
            </div>
            <div class="input-field col s4">
                <input id="dataNascita" name="dataNascita" type="date" class="validate" required />
                <label for="dataNascita">Data di nascita</label>
            </div>
        </div>

        <div class="row">
            <div class="input-field col s4">
                <input id="email" placeholder="example@example.com" name="email" type="email" class="validate" required />
                <label for="email">Email</label>
            </div>
            <input class="btn" type="submit" name="go">
        </div>
    </form>

    <script src="../js/jquery.js"></script>
    <script src="../js/materialize.js"></script>
    <script src="../js/init.js"></script>
</body>

</html>