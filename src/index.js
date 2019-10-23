import ShowSubtitle from './service/showSubtitle.js';
import Subtitle from './entity/Subtitle.js';


class ReadVideo {

    constructor() {
        console.log("Success Load");
        this.subtitles = [];
        this.initExecuteCode = this.initExecuteCode().bind(this);

        this.initExecuteCode();

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
                this.transSubtitles(result[0]);

            // Todo 확장앱에 데이터 삽입
        }.bind(this)).bind(this); // Todo bind 공부
    };

    transSubtitles(subtitlesText) {
        let paragraphSplit = subtitlesText.split('\n\n');

        console.log(paragraphSplit);

        paragraphSplit.map(item => {
            let subtitle = new Subtitle();

            if(subtitle.adapter(item))
                this.subtitles.push(subtitle);
        });

        console.log("=============");
        console.log(this.subtitles);

    }



}

new ReadVideo();
