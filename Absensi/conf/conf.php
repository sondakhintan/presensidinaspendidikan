<?php
// Sambungkan ke database
$db_host = "localhost"; // Ganti dengan host database Anda
$db_user = "root"; // Ganti dengan username database Anda
$db_pass = ""; // Ganti dengan password database Anda
$db_name = "intanmuka"; // Ganti dengan nama database Anda

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
