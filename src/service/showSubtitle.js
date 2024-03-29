export default class ShowSubtitle { // Todo 이름 마음에 안듬
    constructor() {
        this.video = document.querySelector('video');
        this.syncPort = whale.runtime.connect({name: `readChannel`});
        this.repeatMode = false;
        this.repeatStartTime = null;
        this.repeatEndTime = null;
    }

    getSubtitles() {
        let trackList = document.querySelectorAll('track');
        // let trackAddress = trackList == null ? '' : trackList.getAttribute('src');

        if (trackList == null) {
            console.log("페이지에서 자막을 찾을 수 없습니다.");
            return null;
        }

        let subtitleList = [];

        trackList.forEach(track => {
            let subtitleAddress = track.getAttribute('src');
            let lang = track.getAttribute('label');

            subtitleList.push([lang, this.requestSubtitle(subtitleAddress)]);
        });

        return subtitleList;
    }

    getCurrentPlayTime(){
        this.video.ontimeupdate = () => {
            this.syncPort.postMessage(this.video.currentTime);
            if(this.repeatMode && this.repeatEndTime <= this.video.currentTime){
                // console.log(this.repeatEndTime + " , " + this.video.currentTime);
                this.video.currentTime = this.repeatStartTime;
            }
        };
        return this.video.currentTime;
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
            if (xhr.readyState !== XMLHttpRequest.DONE){
                return;
            }

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