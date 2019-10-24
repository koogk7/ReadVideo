import ShowSubtitle from './service/showSubtitle.js';
import Subtitle from './entity/Subtitle.js';


import DownloadAdmin from './service/download.js';

class ReadVideo {

    constructor() {
        console.log("Success Load");
        this.subtitles = [];
        this.donwloadBtn= document.querySelector('#downloadBtn');
        this.track= document.querySelector('track');
        this.downloadAdmin = new DownloadAdmin();

        this.initExecuteCode();
        console.log(this.donwloadBtn);
        this.donwloadBtn.addEventListener('click', this.downloadAdmin.test);

        console.log("Success Init");
    }

    initExecuteCode() {
        // 탭 페이지에 ShowSubtitle 클래스 초기화 및 자막 찾기
        whale.tabs.executeScript({
            code: `
        window.showSubtitle = new ${ShowSubtitle}();
        window.showSubtitle.getSubtitles();
      `
        }, function (result) { //  실행된 코드 마지막 결과를 받아온다.
            //Todo null 처리

            if(result == null)
                console.log("자막을 가져오는데 오류가 발생했습니다.");
            else
                this.subtitles = this.transSubtitles(result[0]);
                this.renderSubtitle(this.subtitles);
            // Todo 확장앱에 데이터 삽입
        }.bind(this));
    };

    transSubtitles(subtitlesText) {
        let paragraphSplit = subtitlesText.split('\n\n');
        let rst  = [];

        paragraphSplit.map(item => {
            let subtitle = new Subtitle();

            if(subtitle.adapter(item))
                rst.push(subtitle);
        });

        console.log("=============");
        console.log(rst);
        return rst;
    }

    renderSubtitle(subtitles){

        let contentNode = document.querySelector('.subtitle_wrap');
        console.log("=====RenderSubtitle====");

        subtitles.map(item => {
            let subtitleDiv = document.createElement('div');
            let progressBar = document.createElement('span');
            let subtitleContent = document.createElement('span');


            /*
            Todo 노드 속성 등을 정해줘야함
             */
            progressBar.textContent = '|';
            subtitleContent.textContent = item.content;

            subtitleDiv.appendChild(progressBar);
            subtitleDiv.appendChild(subtitleContent);
            contentNode.appendChild(subtitleDiv);
        })

    }

}

new ReadVideo();
