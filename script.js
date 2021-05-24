let videoElem = document.querySelector("video");
// let audioElem = document.querySelector("audio");
let recordBtn = document.querySelector("button");
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
        console.log(mediaRecordingObjectForCurrStream);
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
    }
    // is recording is started, stop it
    else {
        mediaRecordingObjectForCurrStream.stop();
        recordBtn.innerText = "Record";
    }
    isRecording = !isRecording;
});
