<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
</head>

<body>
    <?php
// Inisialisasi sesi
session_start();

if(isset($_SESSION['id_user'])) {
    // Hapus semua data sesi
    session_unset();

    // Hancurkan sesi
    session_destroy();

    // Berikan pesan konfirmasi menggunakan SweetAlert
    echo "<script>
            Swal.fire({
                title: 'Logout Berhasil',
                text: 'Anda telah berhasil logout.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            }).then(function() {
                window.location = '../halamanlogin/'; // Ganti URL tujuan logout Anda
            });
          </script>";
} else {
    // Jika pengguna belum login, langsung arahkan ke halaman login
    header("Location: ../halamanlogin/"); // Ganti "login.php" dengan halaman tujuan login Anda
}
?>

</body>

</html>