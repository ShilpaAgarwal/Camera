let videoElem = document.querySelector("video");
// let audioElem = document.querySelector("audio");
let recordBtn = document.querySelector("button");
let picBtn = document.querySelector(".click");
let filterLayer = document.querySelector(".filter-layer");
let filterInner = document.querySelectorAll(".filter-inner");
let timing = document.querySelector(".timing");
let filterColor = "";
let counter = 0;
let clearObj;
let constraint = {
    audio: true,
    video: true,
};
// represent future recording
let recording = [];
let isRecording = false;
let isPaused = false;
let mediaRecordingObjectForCurrStream;

// gives a promise that asks browser to gives the access to media devices,
// which are given as input in constraint
let userMediaPromise = navigator.mediaDevices.getUserMedia(constraint);
userMediaPromise
    .then(function (stream) {
        // browser stream is given to audio and video
        videoElem.srcObject = stream;

        // audioElem.srcObject = stream;
        // after this recording can be enabled
        mediaRecordingObjectForCurrStream = new MediaRecorder(stream);
        // camera recording add -> recording array
        mediaRecordingObjectForCurrStream.ondataavailable = function (e) {
            
            recording.push(e.data);
        };
        //download
        mediaRecordingObjectForCurrStream.addEventListener(
            "stop",
            function (e) {
                // recording -> url convert
                // type -> MIME type (extension)
                let blob = new Blob(recording, { type: "video/mp4" });
                // convert it to url
                let url = window.URL.createObjectURL(blob);
                // directly download the media
                let a = document.createElement("a");
                a.download = "file.mp4";
                // providing the current url, to anchor, so it gets downloaded
                a.href = url;
                a.click();
                recording = [];
                
            }
        );
        
    })
    .catch(function (err) {
        alert("Please give access to audio and video ");
    });
recordBtn.addEventListener("click", function () {
    // checking if permission for camera and audio is there
    if (mediaRecordingObjectForCurrStream == undefined) {
        alert("First give access to audio and video");
        return;
    }
    // is recording is not started, start it
    if (isRecording == false) {
        mediaRecordingObjectForCurrStream.start();
        recordBtn.innerText = "Recording...";
        startTimer();
    }
    // is recording is started, stop it
    else {
        mediaRecordingObjectForCurrStream.stop();
        recordBtn.innerText = "Record";
        stopTimer();
    }
    isRecording = !isRecording;
});
picBtn.addEventListener("click", function (e) {
    // create canvas
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    console.log(videoElem.videoWidth);
    let tool = canvas.getContext("2d");
    tool.drawImage(videoElem, 0, 0);
    
    if(filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height)
    }
    // download the imahe
    let a = document.createElement("a");
    let url = canvas.toDataURL();
    a.download = "file.png";
    a.href = url;
    a.click();
    a.remove();
})

for(let i=0; i<filterInner.length; i++) {
    filterInner[i].addEventListener("click", function() {
        filterColor = filterInner[i].style.backgroundColor;
        filterLayer.style.backgroundColor = filterColor; 
        // filterLayer.style.width = videoElem.videoWidth;
        // console.log(videoElem.videoWidth);
        // console.log(filterLayer.style.width);
    })
}

function startTimer() {
    timing.style.display = "block";
    function fn() {
        // hours
        let hours = Number.parseInt(counter/3600);
        hours = hours<10? `0${hours}`:hours;
        let min = Number.parseInt(counter%3600/60);
        min = min<10? `0${min}`:min;
        let second = Number.parseInt(counter%60);
        second = second<10? `0${second}`:second;
        timing.innerText = `${hours}:${min}:${second}`;
        counter++;
    }
    clearObj = setInterval(fn, 1000);

}
function stopTimer() {
    timing.style.display = "none";
    clearInterval(clearObj)
}