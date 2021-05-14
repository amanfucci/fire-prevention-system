<?php
session_start();

if(isset($_SESSION['isAdmin']))
    unset($_SESSION['isAdmin']);
if(isset($_SESSION['Wuser']))
    unset($_SESSION['Wuser']);

    header('Location: index.php');
?>