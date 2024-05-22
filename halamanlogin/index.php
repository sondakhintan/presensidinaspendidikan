<?php

session_start();
if (isset($_SESSION['id_user'])) {
    header("Location: ../Absensi/");
}elseif(isset($_SESSION['id_admin'])) {
    header("Location: ../loginadmin/");
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="loginnnn.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
</head>


<body>
    <div id="particles-js"></div>

    <div class="wrapper">
        <form action="loginproses.php" method="POST">
            <h1>Masuk</h1>
            <div class="input-box">
                <input type="text" placeholder="Nama Pengguna" id="username" name="username" required>
                <i class='bx bxs-user'></i>
            </div>
            <div class="input-box">
                <input type="password" placeholder="Kata Sandi" id="password" name="password" required>
                <i class='bx bxs-lock-alt'></i>
            </div>
            <!-- <div class="remember-forgot">
                <label><input type="checkbox">Remember Me</label>
                <a href="#">Forgot Password</a>
            </div> -->
            <button type="submit" class="btn">Masuk</button>
            <div class="register-link">
                <p>Belum memiliki akun? <a href="register.php">Daftar</a></p>
            </div>
        </form>
    </div>
    <script src="particles.js"></script>
    <script src="app.js"></script>
</body>

</html>