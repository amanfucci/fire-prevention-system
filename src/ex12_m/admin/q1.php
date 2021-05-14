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
      <ul class="right hide-on-med-and-down">
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
  <table>
    <?php
    include "../connLib.php";
    if ($_SESSION['isAdmin'] && isset($_SESSION['isAdmin'])) {


      $comp = ["Nessun computer", "Portatile", "Fisso", "Portatile e fisso"];
      $sql = "
    SELECT a.*, r.*
    from risposte as r inner join anagrafiche as a
    on r.idAn = a.idAnagrafica
    order by r.idRisposta";
      $result = $conn->query($sql);
      echo "<h4>Risposte:</h4>";
      echo "<tr><th>IdR</th><th>IdP</th><th>Nome</th><th>Cognome</th><th>Computer</th>
      <th>Console</th><th>Valutazione Console</th></tr>";
      if (!empty($result) && $result->num_rows > 0) {
        // output data of each row


        while ($row = $result->fetch_assoc()) {

          echo "<tr><td>" . $row["idRisposta"] . "</td><td>" . $row["idAn"] . "</td><td>" .
            $row["nome"] . "</td><td>" . $row["cognome"]
            . "</td><td>" . $comp[$row["hasPc"]] . "</td><td>" . $row["console"] .
            "</td><td>" . $row["valConsole"] . "</td></tr>";
        }
      } else {
        echo "<p><i class='material-icons'>priority_high</i>0 risultati</p>";
      }
      $conn->close();
    } else {
      $conn->close();
      header("location: ../unauthorized.php");
    }
    ?>
  </table>
  <script src="../js/jquery.js"></script>
  <script src="../js/materialize.js"></script>
  <script src="../js/init.js"></script>
</body>

</html>