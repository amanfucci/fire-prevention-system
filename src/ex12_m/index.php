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

    <form action="index.php" method="POST">
        <div class="row">
            <h4>Login</h4>
            <div class="input-field col s6">
                <input id="user" placeholder="email" name="user" type="text" class="validate" required/>
                <label for="user">Username</label>
            </div>
            <div class="input-field col s6">
                <input id="passw" placeholder="Crea al primo accesso" name="passw" type="password" class="validate"/>
                <label for="passw">Password</label>
            </div>
        </div>
        <div class="row">
            <input class="btn" type="submit" name="go" value="Login"></div>
    </form>

    <?php
    session_start();
    error_reporting(0);
    if (isset($_POST['user'])) {
        
        $Wuser = $_POST['user'];
        $Wpassw = $_POST['passw'];
        $Wusers = array();

        if ($Wuser == "admin") {            
            if ($Wpassw == "admin") {
                $_SESSION['Wuser'] = 'admin';
                $_SESSION['isAdmin'] = true;
                header('Location: admin/admin_index.php');
            } else {
                echo "<p><i class='material-icons'>priority_high</i>Password non corretta</p>";
            }
        } else {
            $Wpassw = hash('sha512', $Wpassw);
            $_SESSION['isAdmin'] = false;
            include "connLib.php";
            $result = $conn->query("select email as u, passw as p from anagrafiche");

            if (!empty($result) && $result->num_rows > 0) {

                while ($row = $result->fetch_assoc())
                    $WuserDB[$row['u']] = $row['p'];

                if (array_key_exists($Wuser, $WuserDB)) {
                    if (is_null($WuserDB[$Wuser]) || $WuserDB[$Wuser] == $Wpassw) {
                        $_SESSION['Wuser'] = $Wuser;
                        if (is_null($WuserDB[$Wuser]))
                            $conn->query("update anagrafiche set passw = '$Wpassw' where email = '$Wuser'");
                        header('Location: user/user_index.php');
                    } else {
                        echo "<p><i class='material-icons'>priority_high</i>Password non corretta</p>";
                    }
                } else
                    echo "<p><i class='material-icons'>priority_high</i>Nome utente inesistente</p>";
            } else {
                echo "<p><i class='material-icons'>priority_high</i>Errore di connessione - Contatta l'amministratore</p>";
            }
        }
    } else {
    }

    ?>
    <script src="./js/jquery.js"></script>
    <script src="./js/materialize.js"></script>
    <script src="./js/init.js"></script>
</body>

</html>