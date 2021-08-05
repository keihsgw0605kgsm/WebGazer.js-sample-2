//var gaze_json = "No Data"
const txt_x = document.getElementById("p_x");
const txt_y = document.getElementById("p_y");
const player = document.getElementById('video');
const checkbox_camera = document.getElementById('checkbox_camera');
//const player = document.getElementById('video');
/*const g_elementBtnCalibration = document.getElementsByClassName('Calibration');
const g_elementDivCalibrationScreen = document.getElementById('div_calibration_screen');
const g_elementDivChatScreen = document.getElementById('div_chat_screen');*/
var test_csv = [];

/**カメラを用いたビデオストリーミング**/
function startVideo() {
    var constraints = {
        audio: true,
        video: {
        width: player.width,
        height: player.height
        }
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
        player.srcObject = stream;
        player.onloadedmetadata = function(e) {
        player.play();
        };
    })
    .catch(function(err) {
        console.log(err.name+": "+err.message);
    })
}

window.onload = async function() {
    webgazer.params.showVideoPreview = true;
    await webgazer.setRegression('ridge') // currently must set regression and tracker
    .setGazeListener(function(data, clock) {
    })
    .saveDataAcrossSessions(true)
    .begin();
    webgazer.showVideoPreview(false) // shows all video previews 
        .showPredictionPoints(false) // shows a square every 100 milliseconds where current prediction is 
        .applyKalmanFilter(true); // Kalman Filter defaults to on. Can be toggled by user. 
}

function beginWebChat(){
    webgazer.showVideoPreview(false)
        .showPredictionPoints(false);
    //document.getElementById("plotting_canvas").style.display = "none";
    document.getElementById("div_calibration_screen").style.display = "none";
    document.getElementById("div_chat_screen").style.display = "block";
}

function onclickCheckbox_CameraMicrophone(){
    startVideo();
}

/*window.onload = function () {
    startVideo();
    webgazer.showVideoPreview(false)
    .showPredictionPoints(false)
    .begin();
    setInterval(async () => {
        var predictions = {};
        webgazer.getCurrentPrediction().then((gaze) => {
            //gaze_json = JSON.stringify(gaze, null, '\t');
            predictions = gaze;
            test_csv = [
                ['gaze_x', 'gaze_y', 'screen_width', 'screen_height'],
                [predictions['x'], predictions['y'], window.parent.screen.width, window.parent.screen.height]
            ]
        })
        //gaze_json = gaze_json_//JSON.stringify(prediction, null, '\t');
        //txt_x.textContent = predictions['x'];
        //txt_y.textContent = prediction.y;
        
    }, 500)
}*/

/** jsonファイルのダウンロード **/
/*function handleDownload() {
var blob = new Blob([ gaze_json ], { "type" : "text/plain" });
var url = window.URL.createObjectURL(blob);
download.href = url;
window.navigator.msSaveBlob(blob, "test_gaze.json"); 
}*/

function getData(){
    webgazer.getCurrentPrediction().then((gaze) => {
        test_csv = [
            ['gaze_x', 'gaze_y', 'screen_width', 'screen_height'],
            [gaze['x'], gaze['y'], window.parent.screen.width, window.parent.screen.height]
        ]
    })
    handleDownload()
}

/** csvファイルの保存 **/
function handleDownload() {
    let data = test_csv.map((record)=>record.join(',')).join('\r\n');
    
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF])
  
    var blob = new Blob([ bom, data ], { "type" : "text/csv" });
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    download.href = url;
    window.navigator.msSaveBlob(blob, "test_gaze.csv");
}