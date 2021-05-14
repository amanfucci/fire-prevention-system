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

    <form action="init.php" method="POST">
        <h4>Inserisci credenziali</h4>
        <div class="row">
            <div class="input-field col s4">
                <input id="hostname" placeholder="localhost" name="hostname" type="text" class="validate" value="localhost" required />
                <label for="hostname">Server IP / Hostname</label>
            </div>
            <div class="input-field col s4">
                <input id="user" name="user" type="text" class="validate" value="root" required />
                <label for="user">Utente DB</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s4">
                <input id="passw" placeholder="" name="passw" type="text" class="validate" value="" />
                <label for="hostname">Password</label>
            </div>
            <div class="col s4">
                <input class="btn" type="submit" name="btn_submit" value="Salva credenziali" /><br>
                <input class="btn" type="submit" name="btn_submit" value="Inizializza" />
            </div>
        </div>

    </form>


    <script src="../js/jquery.js"></script>
    <script src="../js/materialize.js"></script>
    <script src="../js/init.js"></script>
</body>

</html>