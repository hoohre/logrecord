var WebPlayer = function(){
    this.audioDance = null, // AudioDance
    this.playlist = null, //
    this.playlistID = '#playlist', //
    this.status = 0  //flag for sound is playing 1 or stopped 0 or pause 2
}
WebPlayer.prototype = {
    init: function(){
        this.playlist = document.querySelector(this.playlistID);
        this.audioDance = new AudioDance();
        this.audioDance.init();
        var that = this;
        this.audioDance._audioEnd=function() {
            if(that.audioDance.status==1){
                that.next();
            }
        }
    },
    resume: function() {
        if(this.audioDance&&this.audioDance.audioContext){
            this.audioDance.audioContext.resume();
            this.audioDance.status = 1;
            this.status = 1;
        }
    },
    suspend: function() {
        this.audioDance.audioContext.suspend();
        this.audioDance.status = 2;
        this.status = 2;
    },
    prev: function() {
        var items = this.playlist.querySelectorAll('li'), that=this, song=null;
        Array.from(items).some(function(ele, idx){
            if(ele.className.indexOf('select')!=-1){
                song = items[idx-1] || items[items.length-1];
                ele.className = '';
                song.className = 'select';
                return true;
            }
        });
        that.audioDance.fileURL = song.dataset.src;
        that.audioDance._start();
    },
    next: function(){
        var items = this.playlist.querySelectorAll('li'), that=this, song=null;
        Array.from(items).some(function(ele, idx){
            if(ele.className.indexOf('select')!=-1){
                song = items[idx+1] || items[0];
                ele.className = '';
                return true;
            }
        });
        song.className = 'select';
        that.audioDance.fileURL = song.dataset.src;
        that.audioDance._start();
    },
    start: function() {
        if(this.audioDance&&this.audioDance.source&&(this.status==1||this.status==2)){
            this.resume();
        }else{
            // play select song or first song
            var item = this.playlist.querySelector('.select') || this.playlist.querySelector('li');
            if(item &&item.dataset.src){
                this.audioDance.fileURL = item.dataset.src;
                this.audioDance._start();
            }
        }
    },
    stop: function() {
        if(this.audioDance&&this.audioDance.source){
            this.audioDance.source.stop(0);
            this.audioDance.status = 0;
            this.status = 0;
        }
    }

}
var AudioDance = function() {
        this.file = null, //the current file
        this.fileURL = null, // the current file URL
        this.fileName = null, //the current file name
        this.audioContext = null,  // audioContext
        this.source = null, //the audio source
        this.animationId = null,
        this.status = 0, //flag for sound is playing 1 or stopped 0 or pause 2
        this.forceStop = false,  // flag for switch file or audio source, restart
        this.allCapsReachBottom = false,
        this.uploadedID = 'AudioDanceUploadedFile',
        this.canvasID = 'AudioDanceCanvas'
};
AudioDance.prototype = {
    init: function() {
        this._prepareAPI();
        this._addEventListner();
    },
    _prepareAPI: function() {
        //fix browser vender for AudioContext and requestAnimationFrame
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            this.audioContext = new AudioContext();
        } catch (e) {
            console.log(e);
        }
    },
    _addEventListner: function() {
        var that = this,audioInput = document.getElementById(this.uploadedID);
            //listen the file upload
        audioInput.onchange = function() {
            if (that.audioContext === null) {
                return;
            };
            //the if statement fixes the file selction cancle, because the onchange will trigger even the file selection been canceled
            if (audioInput.files.length !== 0) {
                //only process the first file
                that.file = audioInput.files[0];
                that.fileName = that.file.name;
                if (that.status === 1) {
                    //the sound is still playing but we upload another file, so set the forceStop flag to true
                    that.forceStop = true;
                };
                that._file_start();
            };
        };
    },
    _file_start: function(){
        var that = this,file = this.file,fr = new FileReader();
        fr.onload = function(e) {
            var fileResult = e.target.result;
            var audioContext = that.audioContext;
            if (audioContext === null) {
                return;
            };
            audioContext.decodeAudioData(fileResult, function(buffer) {
                that._visualize(audioContext, buffer);
            }, function(e) {
                console.log(e);
            });
        };
        fr.onerror = function(e) {
            console.log(e);
        };
        fr.readAsArrayBuffer(file);
    },
    _start: function() {
        //read and decode the file into audio array buffer
        var that = this;
        if(!that.fileURL){
            return;
        }
        //XMLHttpRequest url source of audio
        var xhr = new XMLHttpRequest();
        xhr.open('GET', that.fileURL, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            var code = (xhr.status + '')[0];
            if (code !== '0' && code !== '2' && code !== '3') {
                console.log('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
                return;
            }
            var audioContext = that.audioContext;
            if (audioContext === null) {
                return;
            };
            if (that.source !== null) {
                that.status=0;
                that.source.stop(0);
            }
            audioContext.decodeAudioData(xhr.response, function(buffer) {
                that._visualize(audioContext, buffer);
            }, function(e) {
                console.log(e);
            });
        };
        xhr.onerror = function() {
            config.log('error', xhr.status)
        }
        try {
            xhr.send();
        } catch (e) {
        }
    },
    _visualize: function(audioContext, buffer) {
        if (this.source !== null) {
            this.source.stop(0);
        }
        var audioBufferSouceNode = audioContext.createBufferSource(), analyser = audioContext.createAnalyser(), that = this;

        //connect the source to the analyser
        audioBufferSouceNode.connect(analyser);
        //connect the analyser to the destination(the speaker), or we won't hear the sound
        analyser.connect(audioContext.destination);
        //then assign the buffer to the buffer source node
        audioBufferSouceNode.buffer = buffer;
        //play the source
        if (!audioBufferSouceNode.start) {
            audioBufferSouceNode.start = audioBufferSouceNode.noteOn //in old browsers use noteOn method
            audioBufferSouceNode.stop = audioBufferSouceNode.noteOff //in old browsers use noteOn method
        };
        //stop the previous sound if any
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        audioBufferSouceNode.start(0);
        this.status = 1;
        this.source = audioBufferSouceNode;
        audioBufferSouceNode.onended = function() {
            that._audioEnd();
        };
        this._drawSpectrum(analyser);
    },
    _drawSpectrum: function(analyser) {
        var that = this,
            canvas = document.getElementById(this.canvasID),
            cwidth = canvas.width,cheight = canvas.height - 1,
            meterWidth = 4, //width of the meters in the spectrum
            gap = 1, //gap between meters
            capHeight = 1, capStyle = '#fff',
            meterNum = cwidth / (meterWidth + gap), //count of the meters
            capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 160);
        gradient.addColorStop(1, '#0f0');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(0, '#f00');
        var drawMeter = function() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            if (that.status === 0) {
                //fix when some sounds end the value still not back to zero
                for (var i = array.length - 1; i >= 0; i--) {
                    array[i] = 0;
                };
                allCapsReachBottom = true;
                for (var i = capYPositionArray.length - 1; i >= 0; i--) {
                    allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
                };
                if (allCapsReachBottom) {
                    cancelAnimationFrame(that.animationId); //since the sound is top and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
                    return;
                };
            };
            var step = Math.round(array.length / meterNum); //sample limited data from the total array
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step] / 2;
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                };
                ctx.fillStyle = capStyle;
                //draw the cap, with transition effect
                if (value < capYPositionArray[i]) {
                    ctx.fillRect(i * 6, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                } else {
                    ctx.fillRect(i * 6, cheight - value, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                };
                ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
                ctx.fillRect(i * 6 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
            }
            that.animationId = requestAnimationFrame(drawMeter);
        }
        this.animationId = requestAnimationFrame(drawMeter);
    },
    _audioEnd: function() {
        if (this.forceStop) {
            this.forceStop = false;
            this.status = 1;
            return;
        };
        this.status = 0;
    }
}
