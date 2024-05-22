<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = $_POST["nama"];

    include 'conf/conf.php';

    // Simpan data ke tabel di database
    $sql = "INSERT INTO presensi (nama) VALUES ('$nama')";

    if ($mysqli->query($sql) === true) {
        echo "Data telah disimpan ke database.";
    } else {
        echo "Error: " . $sql . "<br>" . $mysqli->error;
    }

    $mysqli->close();
}
