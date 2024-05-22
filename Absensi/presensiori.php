<?php
include 'conf/conf.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data lokasi dari POST request
    $nama = $_POST["nama"]; // Ini adalah label hasil pemadanan dari kode JavaScript
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];

    // Koneksi ke database MySQL
    $mysqli = $conn;

    if ($mysqli->connect_error) {
        die("Koneksi database gagal: " . $mysqli->connect_error);
    }

    // Simpan data lokasi dan presensi ke tabel presensi
    $sqlquery = "INSERT INTO presensi (nama, latitude, longitude) VALUES ('$nama', '$latitude', '$longitude')";

    if ($mysqli->query($sqlquery) === true) {
        echo "Data lokasi dan presensi berhasil disimpan.";
    } else {
        echo "Error: " . $sqlquery . "<br>" . $mysqli->error;
    }

    $mysqli->close();
}
?>