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
  include "../connLib.php";
  if ($_SESSION['isAdmin'] && isset($_SESSION['isAdmin'])) {

    $sql1 = "
INSERT INTO `anagrafiche` (`idAnagrafica`, `nome`, `cognome`, `citta`, `dataNascita`, `email`) VALUES
(1, 'Aldo', 'Buzi', 'Grosseto', '2002-11-07', 'aldo.buzi@gmail.com'),
(2, 'Zakaria', 'Korchi', 'Grosseto', '2000-03-10', 'zakaria.korchi@gmail.com'),
(3, 'Alessandro', 'Manfucci', '', '2002-04-09', 'ale.manfucci@gmail.com'),
(4, 'Andrea', 'Ferraro', 'Grosseto', '2002-05-09', 'andrea.ferra@gmail.com');
";

    $sql2 = "
INSERT INTO `risposte` (`idRisposta`, `hasPc`, `console`, `valConsole`, `idAn`) VALUES
(1, 3, 'xBox', 6, 1),
(2, 1, 'Wii', 9, 2),
(3, 3, 'Ps4', 0, 3),
(4, 2, 'Wii', 9, 4);";


    if ($conn->query($sql1) === TRUE && $conn->query($sql2) === TRUE)
      echo "<p><i class='material-icons'>check</i>Database popolato con successo</p>";
    else {
      echo "<p><i class='material-icons'>priority_high</i>Errore nella popolazione " . $conn->error . "</p>";
    }

    $conn->close();
    header("refresh:3;url=admin_index.php");
    echo "<p>Redirecting in 3 seconds <a href='admin_index.php'>Torna ora</a></p>";
  } else {
    $conn->close();
    header("location: ../unauthorized.php");
  }

  ?>
</body>

</html>