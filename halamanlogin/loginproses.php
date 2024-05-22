<?php
            session_start();
            if (isset($_SESSION['id_user'])) {
                header("Location: ../Absensi/");
                exit();
            }elseif(isset($_SESSION['id_admin'])) {
                header("Location: ../loginadmin/");
                exit();
            }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="loginnnn.css">
    <title>Proses login</title>
    <!-- Tambahkan ini di bagian head -->
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    <style>
    /* CSS untuk efek transisi SweetAlert2 */
    .swal2-show {
        transform: scale(1);
        opacity: 1;
        transition: transform 0.3s, opacity 0.3s;
    }

    .swal2-hide {
        transform: scale(0.9);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
    }
    </style>
</head>

<body>
    <div id="particles-js"></div>

    <?php
include '../conf/conf.php'; // Sertakan konfigurasi database

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Form telah disubmit

    // Ambil data dari form login
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Lindungi dari SQL injection
    $username = mysqli_real_escape_string($conn, $username);

    // Cari pengguna dengan username yang cocok
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) == 1) {
        $row = mysqli_fetch_assoc($result);

        if (password_verify($password, $row['password'])) {
            if ($row['role'] == 'karyawan') {

                $_SESSION['id_user'] = $row['id'];
                $redirectURL = '../Absensi/';
                $roleText = 'Pegawai';
            } elseif ($row['role'] == 'admin') {

                $_SESSION['id_admin'] = $row['id'];
                $redirectURL = '../loginadmin/';
                $roleText = 'Admin';
            }

            echo "<script>
                Swal.fire({
                    icon: 'success',
                    title: 'Login Berhasil',
                    text: 'Selamat datang, $roleText! Klik Ok Untuk Melanjutkan',
                    showClass: {
                        popup: 'swal2-show',
                    },
                    hideClass: {
                        popup: 'swal2-hide',
                    }
                }).then(function() {
                    window.location.href = '$redirectURL';
                });
            </script>";
        } else {
            // Password salah
            showErrorMessage('Password salah');
        }
    } else {
        // Username tidak ditemukan
        showErrorMessage('Username tidak ditemukan');
    }
} else {
    // Form belum disubmit
    echo "Silakan masuk terlebih dahulu.";
}

// Tutup koneksi database
mysqli_close($conn);

function showErrorMessage($message) {
    echo "<script>
        Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: '$message',
            showClass: {
                popup: 'swal2-show',
            },
            hideClass: {
                popup: 'swal2-hide',
            }
        }).then(function() {
            window.location.href = './'; // Arahkan kembali ke halaman login
        });
    </script>";
}
?>

    <script src="particles.js"></script>
    <script src="app.js"></script>



</body>

</html>