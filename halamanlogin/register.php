<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="loginnnn.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>


</head>

<body>
    <div id="particles-js"></div>

    <div class="wrapper">
        <form action="registerproses.php" method="POST">
            <h1>Daftar</h1>
            <div class="input-box">
                <input type="text" placeholder="Username" id="username" name="username" required>
                <i class='bx bxs-user'></i>
            </div>
            <div class="input-box">
                <input type="password" placeholder="Password" id="password" name="password" required>
                <i class='bx bxs-lock-alt'></i>
            </div>
            <div class="input-box">
                <input type="password" placeholder="Confirm Password" id="confirm_password" name="confirm_password"
                    required>
                <i class='bx bxs-lock-alt'></i>
            </div>
            <button type="submit" class="btn">Daftar</button>
            <div class="login-link">
                <p>Sudah punya akun? <a href="./"> Masuk</a></p>
            </div>
        </form>
    </div>

    <script src="particles.js"></script>
    <script src="app.js"></script>
</body>

</html>