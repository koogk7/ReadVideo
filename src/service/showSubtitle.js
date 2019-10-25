export default class ShowSubtitle { // Todo 이름 마음에 안듬
    constructor() {
        this.port = whale.runtime.connect({name: `contentChannel`});
        this.port.onMessage.addListener(message => {
            console.log(message);
        });
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

        let video = document.querySelector('video');

        video.ontimeupdate = () => {
            this.port.postMessage(video.currentTime);
        };

    }


    hasVideo() {
        let videoTag = document.querySelector('video');
        return videoTag !== undefined;
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