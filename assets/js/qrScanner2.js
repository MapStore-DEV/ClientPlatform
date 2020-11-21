const elem_qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const frameOverlay = document.getElementById("centered");
frameOverlay.hidden = true;

let scanning = false;

elem_qrcode.callback = res => {
  if (res) {
    outputData.innerText = res;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    frameOverlay.hidden = true;
  }
};


  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment",height:1600,width:1200} })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      canvasElement.hidden = false;
      frameOverlay.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.srcObject = stream;
      video.play();
      video.videoWidth = 1200;
      video.videoHeight = 1600;
      tick();
      scan();
    });

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
