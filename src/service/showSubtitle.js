export default class ShowSubtitle { // Todo 이름 마음에 안듬
    constructor() {
        this.video = document.querySelector('video');
        this.syncPort = whale.runtime.connect({name: `readChannel`});
        this.repeatMode = false;
        this.repeatStartTime = null;
        this.repeatEndTime = null;
    }

    getSubtitles() {
        let track = document.querySelector('track');
        let trackAddress = track == null ? '' : track.getAttribute('src');

        if (track == null) {
            console.log("페이지에서 자막을 찾을 수 없습니다.");
            return null;
        }
        console.log("자막 추출 성공 : " + track.getAttribute('src'));

        let subtitle = this.requestSubtitle(trackAddress);
        console.log(subtitle);

        return subtitle;
    }

    getCurrentPlayTime(){
        this.video.ontimeupdate = () => {
            this.syncPort.postMessage(this.video.currentTime);
            if(this.repeatMode && this.repeatEndTime <= this.video.currentTime){
                this.video.currentTime = this.repeatStartTime;
            }
        };
    }

    setCurrentPlayTime(changeTime){
        this.video.currentTime = changeTime;
    }

    hasVideo() {
        return this.video !== undefined;
    }

    requestSubtitle(address) {
        const xhr = new XMLHttpRequest();
        let subtitle = '';


        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;

            if (xhr.status === 200) {
                subtitle = xhr.responseText;
            } else {
                console.log(`[${xhr.status}] : ${xhr.statusText}`);
                return null;
            }

        };

        xhr.open('GET', address, false); // 동기요청
        xhr.send();

        return subtitle;
    }

}