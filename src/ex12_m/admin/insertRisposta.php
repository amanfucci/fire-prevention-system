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
    $table = "risposte";

    $id = $_POST['idAna'];
    $comp = array_sum(isset($_POST['comp']) ? $_POST['comp'] : array(0));
    $cons = $_POST['console'];
    $valCons = isset($_POST['valConsole']) ? $_POST['valConsole'] : 0;

    $isQ = $conn->query("select count(idAn)as a from risposte where idAn = $id")->fetch_assoc()['a'];
    if ($isQ >= 1)
      $conn->query("delete from risposte where idAn = $id");

    $sql = "insert into $table (hasPc, console, valConsole, idAn) values ($comp, '$cons', $valCons, $id);";
    if ($conn->query($sql) === TRUE) {
      echo "<p><i class='material-icons'>priority_high</i>Risposta al questionario aggiunta</p>";
    } else {
      echo "<p><i class='material-icons'>priority_high</i>Errore: " . $conn->error . "</p>";
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