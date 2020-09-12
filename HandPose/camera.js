function Camera() {
     this.videoTag = document.querySelector('video')
     this.videoConfig = { audio: false, video: { width: this.videoTag.width, height: this.videoTag.height } }
}

Camera.prototype = {
     start: function () {
          this.ligado = true

          navigator.mediaDevices.getUserMedia(this.videoConfig).then(function (mediaStream) {
               this.videoTag = document.querySelector('video');
               this.videoTag.srcObject = mediaStream;
          }).catch(function (err) {
               console.log("Não foi possível iniciar o vídeo" + err);
          })
     },

     stop: function () {
          this.ligado = false
          const strem = this.videoTag.srcObject
          const tracks = strem.getTracks();

          tracks.forEach(function (track) {
               track.stop();
          });

          this.videoTag.srcObject = null;
     },

     async estimateHandsPoseOnVideo() {
          if (this.ligado == true) {
               const model = await handpose.load();
               await model.estimateHands(this.videoTag, { flipHorizontal: false }).then(result => {
                    this.resultPoses = result;
                    console.log(this.resultPoses);
               }).catch((err) => {
                    console.log('Falha ao analisar', err);
               });
          }
          return this.resultPoses;
     }
}