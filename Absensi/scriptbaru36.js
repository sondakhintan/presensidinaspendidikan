const video = document.getElementById('video');
const absenMessage = document.getElementById('absen-message');

Promise.all([faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
faceapi.nets.tinyFaceDetector.loadFromUri("models"),
faceapi.nets.faceRecognitionNet.loadFromUri('models'),
faceapi.nets.faceLandmark68Net.loadFromUri('models'),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);
      

    console.log(detections);
  }, 100);
});

// Fungsi untuk mendapatkan NIP berdasarkan nama yang terdeteksi
async function getNIP(nama) {
  // Simpan daftar nama dan NIP dalam objek
  const dataNIP = {
    'onal': '123456',
    'intan': '654321',
    'Hengkie_Kojongian': '19680628 199303 1013',  
    'Yeyne_Tumewu': '19660611 198609 2007',  
    'Jemry_Langie': '19720821 199808 1 002',  
    'Meyti_Angko': '19680509 199101 2001',  
    'Agustinus': '19640817 198304 1 003',  
    'Stevi_Sumaraw': '19710908 199401 2 001',  
    'Eferhard_Eroch': '19660405 199003 1 017',  
    'Jhonly_Rumondor': '19710116 200212 2 1 005',  
    'Yunita_Terok': '19720628 200501 2 005',  
    'Seska_Sumakul': '19740916 200012 2 003',  
    'Miss_Kusoy': '19800722 200510 2 016',  
    'Jein_Vola_Sumigar': '19640406 198710 2007',  
    'Martinova': '19640315 198304 2002',  
    'Fanny_Engka': '19690508 199005 2 002',  
    'Sefer_Lumolos': '19660920 199303 1 009',  
    'Fiane_Wale': '19660611 198803 2015',  
    'Sherly_Pendelaki': '19700918 199302 2002',  
    'Silvana_Wauran': '19710208 200604 2 003',  
    'Regina_Sumarauw': '19841014 200902 2 006',  
    'Marlina_Terok': '19810513 200803 2 002',  
    'Olga_Rey': '19680116 198802 2 001',  
    'Jan_Waluyan': '19670120 199101 1001',  
    'Olga_Rey': '19680116 198802 2 001',  
    'Dety_Sekoh': '19661210 198604 2003'
  };

  // Cek apakah nama yang terdeteksi ada dalam daftar
  if (dataNIP[nama]) {
    console.log(`NIP untuk ${nama} ditemukan: ${dataNIP[nama]}`);
    return dataNIP[nama];
  } else {
    console.log(`NIP untuk ${nama} tidak ditemukan`);
    return null; // Jika NIP tidak ditemukan, kembalikan null
  }
}

// Fungsi untuk mengambil absen
async function ambilAbsen() {
  const labels = ['intan', 'mario', 'onal', 'zidan', 'yunchan', 'SeferLumolos', 'FianeWales', 'JouwSampul', 'FennyPusung', 'SherliS.Pandelaki', 'SilvanaWauran', 'ReginaSumarow', 'SilaKartiRuntu', 'TresiMandey', 'RevlyP', 'OlgaRey', 'MarlinaTerok', 'JanWaluyan', 'DettySekoh'];
  const labeledFaceDescriptors = await getLabeledFaceDescriptions(labels);
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

  const resizedDetections = faceapi.resizeResults(detections, {
    width: video.width,
    height: video.height,
  });

  if (resizedDetections.length > 0 && resizedDetections[0].descriptor) {
    const result = faceMatcher.findBestMatch(resizedDetections[0].descriptor);
    if (result.label !== 'unknown') {
     // Ambil NIP berdasarkan label wajah yang dikenali
     const nip = await getNIP(result.label);
     console.log(`Label wajah terdeteksi: ${result.label}`);
     console.log(`NIP yang akan ditampilkan: ${nip}`);
     absenMessage.innerHTML = `<p>Nama: ${result.label}</p>`;
     // Update hasil NIP ke dalam elemen HTML
     const nipResultElement = document.getElementById('nipResult');
     nipResultElement.innerHTML = `<p>NIP: ${nip ? nip : 'NIP tidak ditemukan'}</p>`;

      // Mendapatkan lokasi geografis pengguna
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);

          // Ambil gambar dari video dan konversi ke format data URL
          const canvas = faceapi.createCanvasFromMedia(video);
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, video.width, video.height);
          const imageDataURL = canvas.toDataURL('image/png');

          // Panggil fungsi sendLocationAndImageToServer untuk mengirim data
          sendLocationAndImageToServer(latitude, longitude, result.label, imageDataURL);
        }, function (error) {
          console.error('Gagal mendapatkan lokasi:', error.message);
        });
      } else {
        console.error('Geolocation tidak didukung oleh perangkat Anda.');
      }
    } else {
      absenMessage.textContent = 'Wajah tidak dikenali';
    }
  } else {
    absenMessage.textContent = 'Tidak ada wajah yang terdeteksi';
  }
}


// Fungsi untuk mengirim data lokasi dan gambar wajah ke server
async function sendLocationAndImageToServer(latitude, longitude, nama, imageDataURL) {
  const formData = new FormData();
  formData.append('nama', nama);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);

  // Mengambil data dari URL gambar dan mengonversi menjadi Blob
  const imageBlob = await fetch(imageDataURL).then(res => res.blob());

  // Membuat nama file unik dengan menambahkan penanda waktu
  const timestamp = new Date().getTime(); // Waktu saat ini dalam milidetik
  const fileName = `wajah_${timestamp}.png`; // Nama file unik dengan penanda waktu

  // Simpan blob dengan nama file yang unik
  formData.append('wajah', imageBlob, fileName);

  try {
    const response = await fetch('presensi.php', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      console.log('Data lokasi dan gambar wajah berhasil disimpan.');

      // Tampilkan informasi tentang lokasi
      const mapDiv = document.getElementById('map');
      mapDiv.insertAdjacentHTML('afterend', `
        <div class="text-start mb-3">
          <p style="color : white; font-weight: bold; margin-top: 20px;">Koordinaat Absen:</p>
          <p style="color : white;">Latitude: ${latitude}</p>
          <p style="color : white;">Longitude: ${longitude}</p>
        </div>
      `);

      // Tampilkan peta
      mapDiv.style.display = 'block'; // Tampilkan peta

      // Memperbarui tampilan peta dengan lokasi yang baru
      updateMap(latitude, longitude);

    } else {
      console.error('Terjadi kesalahan saat menyimpan data lokasi dan gambar wajah.');
    }
  } catch (error) {
    console.error('Kesalahan jaringan:', error);
  }
}


// Fungsi untuk menunda eksekusi
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk mendapatkan deskripsi wajah berlabel
async function getLabeledFaceDescriptions(labels) {
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

// Event listener untuk tombol Ambil Absen
const tombolAmbilAbsen = document.getElementById('ambil-absen');
tombolAmbilAbsen.addEventListener('click', async () => {
  // Fungsi untuk mengambil absen
  ambilAbsen();
  // alert('Ambil Absen Berhasil');
  Swal.fire({
    icon: 'success',
    title: 'Ambil Absen Berhasil',
    text: '',
    showClass: {
        popup: 'swal2-show',
    },
    hideClass: {
        popup: 'swal2-hide',
    }
})
});
