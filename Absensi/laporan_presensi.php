<?php
include 'conf/conf.php';

// Koneksi ke database MySQL
$mysqli = $conn;

if ($mysqli->connect_error) {
    die("Koneksi database gagal: " . $mysqli->connect_error);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Presensi</title>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.5.2/css/buttons.dataTables.min.css">
</head>

<body>

    <?php
    // Ambil data presensi dari tabel presensi
    $sql = "SELECT * FROM presensi order by id DESC";
    $result = $mysqli->query($sql);

    // Jika terdapat data presensi
    if ($result->num_rows > 0) {
        echo "<h1>Laporan Presensi</h1>";
        echo "<table id='dataTable' border='1'>";
        echo "<thead>
            <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Waktu</th>
                <th>Latitude</th>
                <th>Longitude</th>
            </tr>
          </thead>";
        echo "<tbody>";

        while ($row = $result->fetch_assoc()) {
            echo "<tr>
                <td>" . $row["id"] . "</td>
                <td>" . $row["nama"] . "</td>
                <td>" . $row["waktu"] . "</td>
                <td>" . $row["latitude"] . "</td>
                <td>" . $row["longitude"] . "</td>
            </tr>";
        }

        echo "</tbody>";
        echo "</table>";
    } else {
        echo "Belum ada data presensi.";
    }

    $mysqli->close();
    ?>

    <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.flash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.print.min.js"></script>

    <script>
        $(document).ready(function() {
            $('#dataTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ]
            });
        });
    </script>
</body>

</html>