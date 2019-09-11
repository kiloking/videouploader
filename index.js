const spawn = require('child_process').spawn;
const parent = process.argv[2];
let videos = [];

if(process.argv[2]){
    // Parent Path
    const start = parseInt(process.argv[3]);
    const end = parseInt(process.argv[4]);
    for (let i = start; i <= end; i++) {
        videos.push(i);
    }
    videos.reverse();
    processVideos();
}else{
    // Parent Path is required
    console.log('Parent Folder is required');
}
/***
 * 
 * 
 * 
 * */ 
function resizeVideo(video, quality) {
    const p = new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-y','-i', `${parent}/${video}.mp4`, '-c:v', 'libvpx','-quality','good', '-b:v', `500k`, '-crf','12','-pix_fmt','yuv420p','-movflags','faststart', '-c:a', 'libopus' , '-b:a','96k' ,'-filter:v', `scale=-1:${quality}`, `${parent}/transcoded/${video}_${quality}.webm`]);
        ffmpeg.stderr.on('data', (data) => {
            console.log(`${data}`);
        });
        ffmpeg.on('close', (code) => {
            resolve();
        });
    });
    return p;
}

function processVideos() {
    let video = videos.pop();
    if (video) {
      resizeVideo(video, 180).then(() => {
          // 360p video all done
          console.log(`Completed Video Number - ${video}`);
          processVideos();
      });
    }
}