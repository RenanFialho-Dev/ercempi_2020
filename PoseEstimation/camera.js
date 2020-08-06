function Camera() {
    this.videoTag = document.querySelector('video')
    this.videoConfig = {audio: false, video: {width: this.videoTag.width, height: this.videoTag.height}}
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
    async estimateSinglePoseOnVideo () {
        if (this.ligado == true){
            this.configNet = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: 300, height: 300 },
                multiplier: 0.75
            });
    
            await this.configNet.estimateSinglePose(this.videoTag, { flipHorizontal: false, decodingMethod: 'single-person' }).then(result => {
                this.resultPoses = result;
            }).catch((err) => {
                console.log('Falha ao analisar', err);
            });

            this.configNet.dispose();
        }
        return this.resultPoses;
    }
}