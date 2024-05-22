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
      absenMessage.textContent = `${result.label}`;

      // Mengakses lokasi geografis
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Ambil gambar dari video dan konversi ke format data URL
          const canvas = faceapi.createCanvasFromMedia(video);
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, video.width, video.height);
          const imageDataURL = canvas.toDataURL('image/png');

          // Kirim data lokasi dan gambar ke server
          sendLocationAndImageToServer(latitude, longitude, result.label, imageDataURL);
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

async function sendLocationAndImageToServer(latitude, longitude, nama, imageDataURL) {
  const formData = new FormData();
  formData.append('nama', nama);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);

  // Mengambil data dari data URL dan mengonversi menjadi Blob
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
      console.error('Terjadi kesalahan saat menyimpan data lokasi dan gambar wajah.');
    }
  } catch (error) {
    console.error('Kesalahan jaringan:', error);
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


// // Event listener untuk tombol Ambil Absen
// const tombolrefresh = document.getElementById('refresh');
// tombolrefresh.addEventListener('click', async () => {
//   // Fungsi untuk mengambil absen
//   ambilAbsen();


//   Swal.fire({
//       icon: 'success',
//       title: 'Refresh Berhasil',
//       text: 'Refresh Berhasil, pastikan wajah anda di depan kamera dan tunggu beberapa saat sampai wajah anda terdeteksi!',
//       showClass: {
//           popup: 'swal2-show',
//       },
//       hideClass: {
//           popup: 'swal2-hide',
//       }
//   })

//   // alert('Refresh Berhasil, pastikan wajah anda di depan kamera dan tunggu beberapa saat sampai wajah anda terdeteksi!');
// });

