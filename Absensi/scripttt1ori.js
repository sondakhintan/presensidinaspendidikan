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



async function sendLocationToServer(latitude, longitude, nama) {
  const formData = new FormData();
  formData.append('nama', nama);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);

  try {
    const response = await fetch('presensi.php', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      console.log('Data lokasi berhasil disimpan.');

      // Visualisasi lokasi di peta
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 15, // Atur sesuai kebutuhan
      });

      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Lokasi Absen',
      });
    } else {
      console.error('Terjadi kesalahan saat menyimpan data lokasi.');
    }
  } catch (error) {
    console.error('Kesalahan jaringan:', error);
  }
}

// // Fungsi untuk mengambil absen (KODINGAN ORI)
// async function ambilAbsen() {
//   const labels = ['intan', 'mario', 'onal', 'zidan'];
//   const labeledFaceDescriptors = await getLabeledFaceDescriptions(labels);
//   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

//   const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

//   const resizedDetections = faceapi.resizeResults(detections, {
//     width: video.width,
//     height: video.height,
//   });

//   if (resizedDetections.length > 0) {
//     const result = faceMatcher.findBestMatch(resizedDetections[0].descriptor);
//     if (result.label !== 'unknown') {
//       absenMessage.textContent = `${result.label}`;

//       // Mengakses lokasi geografis
//       if ('geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition(function (position) {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;

//           // Kirim data lokasi ke server
//           sendLocationToServer(latitude, longitude, result.label);
//         });
//       } else {
//         console.error('Geolocation tidak didukung oleh perangkat Anda.');
//       }

//       // Kirim label (nama) ke server PHP
//       // sendPresensi(result.label);
//     } else {
//       absenMessage.textContent = 'Wajah tidak dikenali';
//     }
//   } else {
//     absenMessage.textContent = 'Tidak ada wajah yang terdeteksi';
//   }
//   // return result.label;
// }


async function ambilAbsen() {
  const labels = ['intan', 'mario', 'onal', 'zidan'];
  const labeledFaceDescriptors = await getLabeledFaceDescriptions(labels);
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

  const resizedDetections = faceapi.resizeResults(detections, {
    width: video.width,
    height: video.height,
  });

  if (resizedDetections.length > 0) {
    const result = faceMatcher.findBestMatch(resizedDetections[0].descriptor);
    if (result.label !== 'unknown') {
      absenMessage.textContent = `${result.label}`;

      // Mengambil gambar wajah dari video stream
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Konversi gambar ke dalam bentuk blob
      canvas.toBlob(async function(blob) {
        // Buat objek FormData untuk mengirim data ke server
        const formData = new FormData();
        formData.append('nama', result.label);
        formData.append('latitude', 'nilai_latitude'); 
        formData.append('longitude', 'nilai_longitude'); 
        formData.append('wajah', blob, 'wajah.png');

        try {
          // Kirim data ke server menggunakan fetch
          const response = await fetch('presensi.php', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            console.log('Data berhasil dikirim');
          } else {
            console.error('Gagal mengirim data');
          }
        } catch (error) {
          console.error('Terjadi kesalahan:', error);
        }
      }, 'image/png');
    } else {
      absenMessage.textContent = 'Wajah tidak dikenali';
    }
  } else {
    absenMessage.textContent = 'Tidak ada wajah yang terdeteksi';
  }
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


// Event listener untuk tombol Ambil Absen
const tombolrefresh = document.getElementById('refresh');
tombolrefresh.addEventListener('click', async () => {
  // Fungsi untuk mengambil absen
  ambilAbsen();


  Swal.fire({
      icon: 'success',
      title: 'Refresh Berhasil',
      text: 'Refresh Berhasil, pastikan wajah anda di depan kamera dan tunggu beberapa saat sampai wajah anda terdeteksi!',
      showClass: {
          popup: 'swal2-show',
      },
      hideClass: {
          popup: 'swal2-hide',
      }
  })

  // alert('Refresh Berhasil, pastikan wajah anda di depan kamera dan tunggu beberapa saat sampai wajah anda terdeteksi!');
});

