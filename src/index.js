import ShowSubtitle from './service/showSubtitle.js';
import Subtitle from './entity/Subtitle.js';

import DownloadAdmin from './service/download.js';

class ReadVideo {
    /* Todo
     */

    constructor() {
        console.log("Success Load");
        this.subtitles = [];
        this.subtitleListNode = document.querySelector('.subtitle_list');

        this.donwloadBtn= document.querySelector('#downloadBtn');
        this.downloadAdmin = new DownloadAdmin();
        this.donwloadBtn.addEventListener('click', this.downloadAdmin.downloadText);

        this.whaleEventListener();

        console.log("Success Init");
    }

    initExecuteCode() {
        // 탭 페이지에 ShowSubtitle 클래스 초기화 및 자막 찾기
        whale.tabs.executeScript({
            code: `
        window.showSubtitle = new ${ShowSubtitle}();
      `
        });
    }

    removeSubtitleList(){
        while(this.subtitleListNode.firstChild) {
            this.subtitleListNode.removeChild(this.subtitleListNode.firstChild);
        }
    }

    loadSubtitles(){
        whale.tabs.executeScript({
            code: `
        if(window.showSubtitle.hasVideo())
            window.showSubtitle.getSubtitles();    
      `
        }, (result) => { //  실행된 코드 마지막 결과를 받아온다.
            console.log(result);
            if(result == null){
                console.log("자막을 가져오는데 오류가 발생했습니다.");
                this.renderNoSupport();
            }
            else{
                this.subtitles = this.transSubtitles(result[0]);
                this.renderSubtitle(this.subtitles);
            }
        });
    }

    connectWebVideo(){
        whale.tabs.executeScript({
            code: `
            window.showSubtitle.getCurrentPlayTime();    
      `
        });

        whale.runtime.onConnect.addListener(port => {
            if (port.name === `contentChannel`) {
                // 현재 재생구간 표시
                port.onMessage.addListener(message => {
                    this.syncVideo(message);
                });
            }
        });
    }

    syncVideo(currentTime){
        let currentSubtitle = this.subtitles.filter(item => {
            return item.startTime <= currentTime && item.endTime >= currentTime;
        });

        if(currentSubtitle.length < 1)
            return;

        let subtitleId = currentSubtitle[0].id;
        let subtitleNode = document.querySelector('.subtitle_wrap[data-idx="'+ subtitleId + '"]');
        // 바 색 바꾸기, 이전꺼 되돌려 놓기
    }


    transSubtitles(subtitlesText) {
        let paragraphSplit = subtitlesText.split('\n\n');
        let rst  = [];

        paragraphSplit.map(item => {
            let subtitle = new Subtitle();

            if(subtitle.adapter(item))
                rst.push(subtitle);
        });

        return rst;
    }

    renderSubtitle(subtitles){
        console.log("=====RenderSubtitle====");

        subtitles.map((item, index) => {
            let subtitleWrapNode = document.createElement('div');
            // let progressBarNode = document.createElement('div');
            let subtitleContentNode = document.createElement('div');

            /*
            Todo 노드 속성 등을 정해줘야함
             */
            subtitleWrapNode.classList.add('subtitle_wrap');
            // progressBarNode.classList.add('progress_bar');
            subtitleContentNode.classList.add('subtitle_content');

            subtitleContentNode.textContent = item.content;

            subtitleWrapNode.setAttribute('data-idx', index);
            // subtitleWrapNode.appendChild(progressBarNode);
            subtitleWrapNode.appendChild(subtitleContentNode);
            this.subtitleListNode.appendChild(subtitleWrapNode);
        })

    }

    renderNoSupport(){
        //Todo 구체화 필요
        let temp = document.createElement('div');
        temp.textContent = '지원하지 않는 페이지입니다';
        this.subtitleListNode.appendChild(temp);
    }

    whaleEventListener(){

        // 탭이 업데이트 되었을때
        whale.tabs.onUpdated.addListener((id, changeInfo) => {
            if(changeInfo.status === 'complete') {
                this.initExecuteCode();
                this.removeSubtitleList();
                this.loadSubtitles();
            }
        });

        // 다른 탭이 활성화 되었을때
        whale.tabs.onActivated.addListener(() => {
            this.initExecuteCode();
            this.removeSubtitleList();
            this.loadSubtitles();
        });

        // 탭이 종료되었을때
        whale.tabs.onRemoved.addListener((id) => {

        });

        // 사이드바가 활성화 되었을때
        document.addEventListener('visibilitychange', ()=>{
            if (document.visibilityState === `visible`) {
                // 사이드바가 열렸을 때
                this.initExecuteCode();
                this.removeSubtitleList();
                this.loadSubtitles();
                this.connectWebVideo();
            }
        }); // 화살표함수는 자체적으로 this를 bind 하지 않음
    }


}

export const readVideo = new ReadVideo();
