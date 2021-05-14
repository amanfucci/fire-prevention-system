<!DOCTYPE html>

<head>
    <link href="./css/icon.css" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="./css/materialize.css" media="screen,projection" />
</head>

<body class="container">
    <nav>
        <div class="nav-wrapper">
            <a class="brand-logo truncate">Database questionario</a>
            <a href="#" data-target="mobile-menu" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        </div>
    </nav>
    <?php
    session_start();
    if(isset($_SESSION['isAdmin']))
        unset($_SESSION['isAdmin']);
    if(isset($_SESSION['Wuser']))
        unset($_SESSION['Wuser']);

    echo "<p><i class='material-icons'>priority_high</i>Accesso non autorizzato</p>";
    header("refresh:3;url=index.php");
    echo "<p>Redirecting in 3 seconds <a href='index.php'>Torna ora</a></p>";

    ?>


    <script src="js/jquery.js"></script>
    <script src="js/materialize.js"></script>
    <script src="js/init.js"></script>
</body>

</html>