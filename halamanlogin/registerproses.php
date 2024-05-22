<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    <title>Register Proses</title>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>

    <link rel="stylesheet" href="loginnnn.css">
</head>

<body>

    <div id="particles-js"></div>

    <?php
    // Include file konfigurasi database
    include '../conf/conf.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Form telah disubmit

        // Ambil data dari form register
        $username = $_POST['username'];
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        // Validasi password
        if ($password !== $confirm_password) {
            showError('Konfirmasi password tidak sesuai.');
        }

        // Lindungi dari SQL injection
        $username = mysqli_real_escape_string($conn, $username);

        // Cek apakah username sudah digunakan
        $checkQuery = "SELECT * FROM users WHERE username = '$username'";
        $checkResult = mysqli_query($conn, $checkQuery);

        if (mysqli_num_rows($checkResult) > 0) {
            showError('Username sudah digunakan.');
        }

        // Enkripsi password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Insert user baru ke database
        $insertQuery = "INSERT INTO users (username, password, role) VALUES ('$username', '$hashedPassword', 'karyawan')";

        if (mysqli_query($conn, $insertQuery)) {
            // Registrasi berhasil, tampilkan pesan sukses menggunakan SweetAlert
            showSuccess('Registrasi berhasil. Silakan login dengan username dan password yang sudah didaftarkan.');
        } else {
            showError('Terjadi kesalahan saat mendaftarkan akun.');
        }
    } else {
        // Jika akses langsung ke registerproses.php tanpa melalui form
        showError('Akses tidak valid.');
    }

    // Tutup koneksi database
    mysqli_close($conn);

    function showError($message) {
        $_SESSION['error'] = $message;
        
        // Menampilkan pesan error menggunakan SweetAlert
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Registrasi Gagal',
                text: '$message',
                showClass: {
                    popup: 'swal2-show',
                },
                hideClass: {
                    popup: 'swal2-hide',
                }
            }).then(function() {
                window.location.href = 'register.php';
            });
        </script>";
        
        exit();
    }

    function showSuccess($message) {
        $_SESSION['success'] = $message;
        
        // Menampilkan pesan sukses menggunakan SweetAlert
        echo "<script>
            Swal.fire({
                icon: 'success',
                title: 'Registrasi Berhasil',
                text: '$message',
                showClass: {
                    popup: 'swal2-show',
                },
                hideClass: {
                    popup: 'swal2-hide',
                }
            }).then(function() {
                window.location.href = './';
            });
        </script>";
        
        exit();
    }
    ?>

    <script src="particles.js"></script>
    <script src="app.js"></script>

</body>

</html>