<?php
include 'conf/conf.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data lokasi dari POST request
    $nama = $_POST["nama"];
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];

    // Simpan gambar wajah
    $gambarWajah = $_FILES["wajah"];
    $targetDirectory = "uploads/"; // Direktori penyimpanan gambar

    // Dapatkan nama file yang diunggah
    $fileName = basename($gambarWajah["name"]);

    // Tentukan path lengkap untuk file yang diunggah
    $targetFile = $targetDirectory . $fileName;

    // Pindahkan file yang diunggah ke direktori target
    if (move_uploaded_file($gambarWajah["tmp_name"], $targetFile)) {
        echo "File berhasil diunggah.";
    } else {
        echo "Terjadi kesalahan saat mengunggah file.";
    }

    // Dapatkan path lengkap ke gambar yang diunggah
    $targetFilePath = realpath($targetFile);

    // Koneksi ke database MySQL
    $mysqli = $conn;

    if ($mysqli->connect_error) {
        die("Koneksi database gagal: " . $mysqli->connect_error);
    }

    // Simpan data lokasi, presensi, dan path gambar ke tabel presensi
    $sqlquery = "INSERT INTO presensi (nama, latitude, longitude, wajah) VALUES ('$nama', '$latitude', '$longitude', '$targetFile')";

    if ($mysqli->query($sqlquery) === true) {
        echo "Data lokasi, presensi, dan gambar wajah berhasil disimpan.";
    } else {
        echo "Error: " . $sqlquery . "<br>" . $mysqli->error;
    }

    $mysqli->close();
}
