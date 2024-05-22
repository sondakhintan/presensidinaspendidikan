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



// async function sendLocationToServer(latitude, longitude, nama) {
//   const formData = new FormData();
//   formData.append('nama', nama);
//   formData.append('latitude', latitude);
//   formData.append('longitude', longitude);

//   try {
//     const response = await fetch('presensi.php', {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.status === 200) {
//       console.log('Data lokasi berhasil disimpan.');

//       // Visualisasi lokasi di peta
//       const map = new google.maps.Map(document.getElementById('map'), {
//         center: { lat: latitude, lng: longitude },
//         zoom: 15, // Atur sesuai kebutuhan
//       });

//       const marker = new google.maps.Marker({
//         position: { lat: latitude, lng: longitude },
//         map: map,
//         title: 'Lokasi Absen',
//       });
//     } else {
//       console.error('Terjadi kesalahan saat menyimpan data lokasi.');
//     }
//   } catch (error) {
//     console.error('Kesalahan jaringan:', error);
//   }
// }


// async function ambilAbsen() {
//   const labels = ['intan', 'mario', 'onal', 'zidan', 'yunchan', 'SeferLumolos', 'FianeWales', 'JouwSampul', 'FennyPusung', 'SherliS.Pandelaki', 'SilvanaWauran', 'ReginaSumarow', 'SilaKartiRuntu', 'TresiMandey', 'RevlyP', 'OlgaRey', 'MarlinaTerok', 'JanWaluyan', 'DettySekoh'];
//   const labeledFaceDescriptors = await getLabeledFaceDescriptions(labels);
//   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

//   const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

//   const resizedDetections = faceapi.resizeResults(detections, {
//     width: video.width,
//     height: video.height,
//   });

//   if (resizedDetections.length > 0 && resizedDetections[0].descriptor) {
//     const result = faceMatcher.findBestMatch(resizedDetections[0].descriptor);
//     if (result.label !== 'unknown') {
//       absenMessage.textContent = `${result.label}`;

//       // Mengakses lokasi geografis
//       if ('geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition(async function (position) {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;

//           // Ambil gambar dari video dan konversi ke format data URL
//           const canvas = faceapi.createCanvasFromMedia(video);
//           const context = canvas.getContext('2d');
//           context.drawImage(video, 0, 0, video.width, video.height);
//           const imageDataURL = canvas.toDataURL('image/png');

//           // Kirim data lokasi dan gambar ke server
//           sendLocationAndImageToServer(latitude, longitude, result.label, imageDataURL);
//         });
//       } else {
//         console.error('Geolocation tidak didukung oleh perangkat Anda.');
//       }
//     } else {
//       absenMessage.textContent = 'Wajah tidak dikenali';
//     }
//   } else {
//     absenMessage.textContent = 'Tidak ada wajah yang terdeteksi';
//   }
// }


// async function sendLocationToServer(latitude, longitude, nama) {
//   const formData = new FormData();
//   formData.append('nama', nama);
//   formData.append('latitude', latitude);
//   formData.append('longitude', longitude);

//   try {
//     const response = await fetch('presensi.php', {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.status === 200) {
//       console.log('Data lokasi berhasil disimpan.');

//       // Tampilkan pesan sukses atau lakukan tindakan lain jika perlu
//     } else {
//       console.error('Terjadi kesalahan saat menyimpan data lokasi.');
//       // Tampilkan pesan error atau lakukan tindakan lain jika perlu
//     }
//   } catch (error) {
//     console.error('Kesalahan jaringan:', error);
//     // Tampilkan pesan error atau lakukan tindakan lain jika perlu
//   }
// }

// async function sendLocationAndImageToServer(latitude, longitude, nama, imageDataURL) {
//   const formData = new FormData();
//   formData.append('nama', nama);
//   formData.append('latitude', latitude);
//   formData.append('longitude', longitude);

//   // Mengambil data dari data URL dan mengonversi menjadi Blob
//   const imageBlob = await fetch(imageDataURL).then(res => res.blob());

//   // Membuat nama file unik dengan menambahkan penanda waktu
//   const timestamp = new Date().getTime(); // Waktu saat ini dalam milidetik
//   const fileName = `wajah_${timestamp}.png`; // Nama file unik dengan penanda waktu

//   // Simpan blob dengan nama file yang unik
//   formData.append('wajah', imageBlob, fileName);

//   try {
//     const response = await fetch('presensi.php', {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.status === 200) {
//       console.log('Data lokasi dan gambar wajah berhasil disimpan.');

//       // Visualisasi lokasi di peta
//       const map = new google.maps.Map(document.getElementById('map'), {
//         center: { lat: latitude, lng: longitude },
//         zoom: 15, // Atur sesuai kebutuhan
//       });

//       const marker = new google.maps.Marker({
//         position: { lat: latitude, lng: longitude },
//         map: map,
//         title: 'Lokasi Absen',
//       });
//     } else {
//       console.error('Terjadi kesalahan saat menyimpan data lokasi dan gambar wajah.');
//     }
//   } catch (error) {
//     console.error('Kesalahan jaringan:', error);
//   }
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

      // Mendapatkan lokasi geografis pengguna
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);

          // Tunggu sebentar sebelum memanggil fungsi sendLocationAndImageToServer
          await delay(1000); // Delay 1 detik

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

// JadiPUNYA
// async function sendLocationAndImageToServer(latitude, longitude, nama, imageDataURL) {
//   const formData = new FormData();
//   formData.append('nama', nama);
//   formData.append('latitude', latitude);
//   formData.append('longitude', longitude);

//   // Mengambil data dari URL gambar dan mengonversi menjadi Blob
//   const imageBlob = await fetch(imageDataURL).then(res => res.blob());

//   // Membuat nama file unik dengan menambahkan penanda waktu
//   const timestamp = new Date().getTime(); // Waktu saat ini dalam milidetik
//   const fileName = `wajah_${timestamp}.png`; // Nama file unik dengan penanda waktu

//   // Simpan blob dengan nama file yang unik
//   formData.append('wajah', imageBlob, fileName);

//   try {
//     const response = await fetch('presensi.php', {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.status === 200) {
//       console.log('Data lokasi dan gambar wajah berhasil disimpan.');

//       // Tampilkan informasi lokasi
//       const locationInfo = document.createElement('div');
//       locationInfo.innerHTML = `
//         <p>Lokasi Absen:</p>
//         <p>Latitude: ${latitude}</p>
//         <p>Longitude: ${longitude}</p>
//       `;
//       document.body.appendChild(locationInfo);
//     } else {
//       console.error('Terjadi kesalahan saat menyimpan data lokasi dan gambar wajah.');
//     }
//   } catch (error) {
//     console.error('Kesalahan jaringan:', error);
//   }
// }
// End Jadi Punya


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
