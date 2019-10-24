import ShowSubtitle from './service/showSubtitle.js';
import Subtitle from './entity/Subtitle.js';


import DownloadAdmin from './service/download.js';

class ReadVideo {
    /* Todo
    resetSidePage - 사이드바가 열렸을 때, 확장앱 페이지를 비움

     */

    constructor() {
        console.log("Success Load");
        this.subtitles = [];
        this.donwloadBtn= document.querySelector('#downloadBtn');
        this.track= document.querySelector('track');
        this.downloadAdmin = new DownloadAdmin();

        this.donwloadBtn.addEventListener('click', this.downloadAdmin.test);
        this.whaleEventListener();

        console.log("Success Init");
    }

    initExecuteCode() {
        // 탭 페이지에 ShowSubtitle 클래스 초기화 및 자막 찾기
        whale.tabs.executeScript({
            code: `
        window.showSubtitle = new ${ShowSubtitle}();
      `
        });// 왜 전역으로 안되지 ==> 페이지가 새로 로드되니까 애가 날라가지...
    }

    loadSubtitles(){
        whale.tabs.executeScript({
            code: `
        console.log(window.showSubtitle);
        window.showSubtitle.getSubtitles();
      `
        }, (result) => { //  실행된 코드 마지막 결과를 받아온다.
            //Todo null 처리
            if(result == null)
                console.log("자막을 가져오는데 오류가 발생했습니다.");
            else{
                console.log('자막 추출 성공');
                console.log(result);
                this.subtitles = this.transSubtitles(result[0]);
                console.log(this.subtitles);
                // Todo 확장앱에 데이터 삽입
                this.renderSubtitle(this.subtitles);
            }

        });
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

        let subtitleList = document.querySelector('.subtitle_list');
        console.log("=====RenderSubtitle====");

        subtitles.map(item => {
            let subtitleWrap = document.createElement('div');
            let progressBar = document.createElement('span');
            let subtitleContent = document.createElement('span');


            /*
            Todo 노드 속성 등을 정해줘야함
             */
            subtitleWrap.classList.add('subtitle_wrap');
            progressBar.classList.add('progress_bar');
            subtitleContent.classList.add('subtitle_content');

            subtitleContent.textContent = item.content;


            subtitleWrap.appendChild(progressBar);
            subtitleWrap.appendChild(subtitleContent);
            subtitleList.appendChild(subtitleWrap);
        })

    }

    whaleEventListener(){

        // 탭이 업데이트 되었을때, 다시 문서에서 단어를 검색하도록
        whale.tabs.onUpdated.addListener((id, changeInfo) => {
            if(changeInfo.status === 'complete') {
                this.initExecuteCode();
            }
        });

        // 다른 탭이 활성화 되었을때
        whale.tabs.onActivated.addListener(() => {
        });

        // 탭이 종료되었을때
        whale.tabs.onRemoved.addListener((id) => {

        });

        // 사이드바가 활성화 되었을때
        document.addEventListener('visibilitychange', ()=>{
            if (document.visibilityState === `visible`) {
                // 사이드바가 열렸을 때
                console.log('Open Sidebar');
                this.loadSubtitles();
            }
        }); // 화살표함수는 자체적으로 this를 bind 하지 않음
    }


}

new ReadVideo();
