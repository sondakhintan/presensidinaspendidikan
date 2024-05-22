<?php
include 'conf/conf.php';
session_start();

if (!isset($_SESSION['id_user'])) {
    header("Location: ../halamanlogin/");
    exit(); // Pastikan kode berhenti di sini setelah pengalihan
} elseif (isset($_SESSION['id_admin'])) {
    header("Location: ../loginadmin/");
    exit(); // Pastikan kode berhenti di sini setelah pengalihan
}

$id = $_SESSION['id_user'];

// Cari pengguna dengan username yang cocok
$query = "SELECT * FROM users WHERE id = '$id'";
$result = mysqli_query($conn, $query);

// Anda dapat mengakses data pengguna di sini jika diperlukan
$row = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Presensi | Intan</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">

    <script defer src="face-api.min.js"></script>
    <!-- <script defer src="scripttt6.js"></script> -->
    <script defer src="scriptbaru36.js"></script>

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Saira:wght@500;600;700&display=swap"
        rel="stylesheet">

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="../lib/animate/animate.min.css" rel="stylesheet">
    <link href="../lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="../css/styless.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/new.css">
    <link rel="stylesheet" href="../css/baruxxx2.css">
    <link rel="stylesheet" href="../assets/fontawesome/css/allxx.min.css">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    <script src="https://code.responsivevoice.org/responsivevoice.js"></script>


    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>


</head>

<body>
    <!-- Spinner Start -->
    <div id="spinner"
        class="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner-grow text-primary" role="status"></div>
    </div>
    <!-- Spinner End -->


    <!-- Page Header Start -->
    <div class="container-fluid page-header py-5 mt-5">
        <div class="container text-center py-5">
            <h1 class="display-2 text-white mb-4 animated slideInDown">Presensi Online</h1>
            <div class="contact-detail position-relative p-5">
                <div class="row g-5 mb-5 justify-content-center">
                    <div class="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".3s">
                        <div class="d-flex bg-light p-3 rounded">
                            <div class="flex-shrink-0 btn-square bg-secondary rounded-circle"
                                style="width: 64px; height: 64px;">
                                <i class="fa-solid fa-camera fa-2xl"></i>
                            </div>
                            <div class="ms-3">
                                <h4 class="text-primary">1. Pastikan Wajah Anda di Depan Kamera</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".5s">
                        <div class="d-flex bg-light p-3 rounded">
                            <div class="flex-shrink-0 btn-square bg-secondary rounded-circle"
                                style="width: 64px; height: 64px;">
                                <i class="fa-solid fa-pause fa-2xl"></i>
                            </div>
                            <div class="ms-3">
                                <h4 class="text-primary">2. Tunggu Sampai Wajah Terdeteksi</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 wow fadeIn" data-wow-delay=".7s">
                        <div class="d-flex bg-light p-3 rounded">
                            <div class="flex-shrink-0 btn-square bg-secondary rounded-circle"
                                style="width: 64px; height: 64px;">
                                <i class="fa-solid fa-hand-pointer fa-2xl"></i>
                            </div>
                            <div class="ms-3">
                                <h4 class="text-primary">3. Tekan Tombol Ambil Presensi</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row g-5">
                    <div class="col-lg-6 wow fadeIn" data-wow-delay=".3s">
                        <div class="p-5 h-100 rounded contact-map">
                            <video id="video" width="100%" height="100%" autoplay></video>
                        </div>
                    </div>
                    <div class="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                        <div class="p-5 rounded contact-form ">
                            <div class="mb-4 custom-box">
                                <div id="absen-message" class="bordered-box"></div>
                            </div>
                            <!-- Di dalam tag <div id="nipMessage" class="bordered-box"></div> -->
                            <div id="nipMessage" class="bordered-box">
                                <!-- Tambahkan tag <p> di bawah ini -->
                                <p id="nipResult"></p>
                            </div>

                            <div class="text-start mb-5">
                                <div id="map" style="width: 100%; height: 280px;"></div>
                            </div>
                            <div class="text-start">
                                <button id="ambil-absen" class="btn btn-primary-absen">Ambil
                                    Presensi</button>
                                <!-- <button id="refresh" class="btn btn-primary-refresh">Refresh</button> -->
                                <a class="btn btn-primary-keluar" href="logout.php">Keluar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Page Header End -->

    <script>
    document.addEventListener("DOMContentLoaded", function() {
        // Gantilah teks dengan pesan yang ingin Anda ucapkan
        const pesanSuara = "Welcome to Face Recognition Using MTCNN Algorithm.";

        // Panggil fungsi ResponsiveVoice untuk memainkan pesan suara
        responsiveVoice.speak(pesanSuara, "UK English Female", {
            volume: 1
        });
    });
    </script>


    <!-- Back to Top -->
    <a href="#" class="btn btn-secondary btn-square rounded-circle back-to-top"><i
            class="fa fa-arrow-up text-white"></i></a>


    <!-- JavaScript Libraries -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../lib/wow/wow.min.js"></script>
    <script src="../lib/easing/easing.min.js"></script>
    <script src="../lib/waypoints/waypoints.min.js"></script>
    <script src="../lib/owlcarousel/owl.carousel.min.js"></script>

    <!-- Template Javascript -->
    <script src="../js/main.js"></script>

    <script>
    // Memperbarui tampilan peta saat mendapatkan lokasi pengguna
    function updateMap(latitude, longitude) {
        const mymap = L.map('map').setView([latitude, longitude], 13);

        // Menambahkan peta tile
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

        // Menambahkan marker ke lokasi
        L.marker([latitude, longitude]).addTo(mymap)
            .bindPopup('Lokasi Absen')
            .openPopup();
    }

    // Memeriksa izin geolokasi saat halaman dimuat
    window.onload = function() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log('Geolocation berhasil diaktifkan:', position);

                // Panggil fungsi updateMap untuk menampilkan peta
                updateMap(latitude, longitude);
            }, function(error) {
                console.error('Gagal mendapatkan lokasi:', error.message);
            });
        } else {
            console.error('Geolocation tidak didukung oleh perangkat Anda.');
        }
    };
    </script>


</body>

</html>