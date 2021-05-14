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

    <form action="insertRisposta.php" method="POST">
        <h4>Inserisci risposta</h4>

        <div class="row">
            <div class="input-field col s6">
                <select name="idAna">
                    <?php
                    include "../connLib.php";
                    $string = '';
                    if (!$_SESSION['isAdmin'])
                        $string = "where email like \"$_SESSION[Wuser]\"";
                    $sql = "SELECT idAnagrafica as i, nome as n, cognome as c from anagrafiche $string";
                    $result = $conn->query($sql);

                    if (!empty($result) && $result->num_rows > 0) {
                        // output data of each row

                        while ($row = $result->fetch_assoc()) {
                            echo "<option value='" . $row['i'] . "'>" . $row['i'] . ' ' . $row['n'] . ' ' . $row['c'] . "</option>";
                        }
                    } else {
                        echo "<option value=''>Nessuna persona inserita</option>";
                    }
                    $conn->close();
                    ?>
                </select>
                <label>Soggetto del questionario</label>
            </div>

            <div class="col s6">
                <label>Tipo Computer</label><br>
                <label><input type="checkbox" name="comp[]" value="1" /><span>Portatile</span></label>
                <label><input type="checkbox" name="comp[]" value="2" /><span>Fisso</span></label>
            </div>
        </div>

        <div class="row">

            <div class="input-field col s4">
                <select id="console" name="console">
                    <option value="Wii">Wii</option>
                    <option value="Ps4">Ps4</option>
                    <option value="xBox">xBox</option>
                    <option value="Nintendo">Nintendo</option>
                </select>
                <label for="console">Tipo Console</label>
            </div>

            <div class="col s4">
                <label>Valutazione Console</label><br>
                <?php
                for ($i = 0; $i < 11; $i++)
                    echo '<label><input type="radio" name="valConsole" value="' . $i . '" required/><span>'
                        . $i . "</span></label>";
                ?>
            </div>
            <div class="input-field col s4">
                <input class="btn" type="submit" name="go" />
            </div>
        </div>
    </form>

    <script src="../js/jquery.js"></script>
    <script src="../js/materialize.js"></script>
    <script src="../js/init.js"></script>
</body>

</html>