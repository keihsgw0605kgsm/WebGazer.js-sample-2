//var gaze_json = "No Data"
const txt_x = document.getElementById("p_x");
const txt_y = document.getElementById("p_y");
const txt_err = document.getElementById('err');
const player = document.getElementById('video');
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
        //console.log(err.name+": "+err.message);
        txt_err.textContent = (err.name+": "+err.message);
    });
}

window.onload = function () {
    startVideo();
    webgazer.showVideoPreview(false)
    //.showPredictionPoints(false)
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
}

/** jsonファイルのダウンロード **/
/*function handleDownload() {
var blob = new Blob([ gaze_json ], { "type" : "text/plain" });
var url = window.URL.createObjectURL(blob);
download.href = url;
window.navigator.msSaveBlob(blob, "test_gaze.json"); 
}*/

/** csvファイルの保存 **/
function handleDownload() {
  
    let data = test_csv.map((record)=>record.join(',')).join('\r\n');
    
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF])
  
    var blob = new Blob([ bom, data ], { "type" : "text/csv" });
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    download.href = url;
    window.navigator.msSaveBlob(blob, "test_gaze.csv");
  }