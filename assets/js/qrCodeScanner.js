const elem_qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const btnScanQR = document.getElementById("btn-scan-qr");
const home_preview = document.getElementById("home_preview");
const shop_list = document.getElementById("shop_list");
const frameOverlay = document.getElementById("centered");
frameOverlay.hidden = true;

let scanning = false;

elem_qrcode.callback = res => {
  if (res) {
    // outputData.innerText = res;

    res = res.split(';;');
    res = res[1];
    url = location.origin + '/ClientPlatform/MapBuilder/mapbuilder.html?map_hash=' + encodeURIComponent(res);
    document.location.href = url;

    console.log(res);
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    frameOverlay.hidden = true;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment",height:1600,width:1200} })
    .then(function(stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      frameOverlay.hidden = false;
      home_preview.hidden = true;
      shop_list.hidden = true;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      video.videoWidth = 1200;
      video.videoHeight = 1600;
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    elem_qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
