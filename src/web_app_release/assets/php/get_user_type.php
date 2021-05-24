<?php
session_start();
    if (isset($_SESSION['userType'])){
        echo json_encode([true, $_SESSION['userType']]);
    }
    else{
        echo json_encode([false]);
    }
?>
