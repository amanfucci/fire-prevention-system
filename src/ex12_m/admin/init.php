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

    <?php
    session_start();
    $hostname = $_SESSION["hostname"] = $_POST['hostname'];
    $user = $_SESSION["user"] = $_POST['user'];
    $passw = $_SESSION["passw"] = $_POST['passw'];
    $_SESSION['isCred'] = TRUE;

    if ($_SESSION['isAdmin'] && isset($_SESSION['isAdmin'])) {

        if ($_REQUEST['btn_submit'] == 'Salva credenziali') {

            $myfile = fopen("init.txt", "w+");
            fwrite($myfile, "$hostname\n");
            fwrite($myfile, "$user\n");
            fwrite($myfile, "$passw");
            fclose($myfile);
            echo "<p><i class='material-icons'>check</i>Credenziali salvate con successo</p>";
        } elseif ($_REQUEST['btn_submit'] == 'Inizializza') {

            $myfile = fopen("init.txt", "w+");
            fwrite($myfile, "$hostname\n");
            fwrite($myfile, "$user\n");
            fwrite($myfile, "$passw");
            fclose($myfile);
            echo "<p><i class='material-icons'>check</i>Credenziali salvate con successo</p>";

            //Inizializza
            $conn = new mysqli($hostname, $user, $passw);
            if ($conn->connect_error)
                die("Connessione fallita: " . $conn->connect_error);
            else {
                $conn2 = new mysqli($hostname, $user, $passw, "auto");
                if (!$conn2->connect_error) {
                    if ($conn->query("drop database questionario") === !TRUE)
                        echo "<p><i class='material-icons'>priority_high</i>Errore nell'inizializzazione: " . $conn->error . "</p>";
                }

                $sql = "create database questionario";
                // Init db
                if ($conn->query($sql) === !TRUE)
                    echo "<p><i class='material-icons'>priority_high</i>Errore nell'inizializzazione: " . $conn->error . "</p>";
                else {
                    echo "<p><i class='material-icons'>check</i>Database questionario creato con successo</p>";
                    //Init tables
                    $conn = new mysqli($hostname, $user, $passw, "questionario");
                    if ($conn->connect_error)
                        die("<p><i class='material-icons'>priority_high</i>Connessione fallita: " . $conn->connect_error . "</p>");
                    else {

                        $sql = "
                CREATE table anagrafiche (
                idAnagrafica int not null auto_increment primary key,
                nome varchar(20) not null,
                cognome varchar(20) not null,
                citta varchar(20) not null,
                dataNascita date not null,
                email varchar(70) not null UNIQUE,
                passw varchar(128))";

                        $sql2 = "
                CREATE table risposte (
                idRisposta int not null auto_increment primary key,
                hasPc int(1) not null,
                console varchar(15) not null,
                valConsole int(2) not null,
                idAn int not null references anagrafiche(idAnagrafica))";

                        if ($conn->query($sql) === TRUE && $conn->query($sql2) === TRUE) {
                            echo "<p><i class='material-icons'>check</i>Inizializzazione completata con successo</p>";
                            $_SESSION['isInit'] = TRUE;
                        } else {
                            echo "<p><i class='material-icons'>priority_high</i>Errore nell'inizializzazione: " . $conn->error . "</p>";
                        }
                    }
                }
            }
            $conn->close();
        }
        header("refresh:3;url=admin_index.php");
        echo "<p>Redirecting in 3 seconds <a href='admin_index.php'>Torna ora</a></p>";
    } else {
        $conn->close();
        header("location: ../unauthorized.php");
    }



    ?>
</body>

</html>