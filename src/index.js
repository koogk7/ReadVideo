import ShowSubtitle from './service/showSubtitle.js';
import Subtitle from './entity/Subtitle.js';
import {CONSTANT} from './common/constant.js';
import SelectLangService from './service/SelectLangService.js';
import DownloadAdmin from './service/download.js';
import SearchAdmin from './service/search.js';

class ReadVideo {
    constructor() {
        this.allSubtitles = {}; // 다국어 자막 전체 저장
        this.currentSubtitles = []; // 현재 선택 자막
        this.subtitleListNode = document.querySelector('.subtitle_list');
        this.preSubtitle = null;

        this.repeatMode = false;
        this.repeatStartId = null;
        this.repeatEndId = null;
        let repeatBtn  = document.querySelector('#repeatBtn');
        repeatBtn.addEventListener('click', this.repeatBtnClickHandler.bind(this));

        let downloadBtn = document.querySelector('#downloadBtn');
        let downloadAdmin = new DownloadAdmin();
        downloadBtn.addEventListener('click', downloadAdmin.downloadText);

        let searchBtn = document.querySelector('#searchBtn');
        let searchText = document.querySelector('#searchText');
        let searchAdmin = new SearchAdmin();
        searchBtn.addEventListener('click', searchAdmin.searchString);
        searchText.addEventListener('keydown', searchAdmin.enterSearchHandler);

        let reloadBtn = document.querySelector('#reloadBtn');
        reloadBtn.addEventListener('click', this.reloadSubtitle);
        document.querySelector('#logo_img').addEventListener('click', this.reloadSubtitle);

        this.selectLangService = new SelectLangService();
        this.selectLangService.selectNode.addEventListener('change', ()=>{
            let selectedLang = this.selectLangService.getCurrentLang();
            this.currentSubtitles = this.allSubtitles[selectedLang];
            this.removeSubtitleList();
            this.renderSubtitle(this.currentSubtitles);
        });

        this.autoScrollMode = false;
        document.querySelector('#scrollBtn').addEventListener('click', this.scrollClickHandler);

        this.loadingWrapperNode = document.querySelector('.loading_wrapper');
        this.noSupportWrapperNode = document.querySelector('.no_support_wrapper');

        document.querySelector('.guide_content').addEventListener('click', ReadVideo.closeGuideHandler);
        // document.querySelector('#guideCloseBtn').addEventListener('click', ReadVideo.closeGuideHandler);
        document.querySelector('#guide_img').addEventListener('click', ReadVideo.openGuideClickHandler);

        let tobBar1BtnList = document.querySelectorAll('#top_bar1 img');
        ReadVideo.topBarIconToggleHandler(tobBar1BtnList);
        ReadVideo.iconAddEventHandler('search_img', 'search_on.png', 'search_off.png');

        this.whaleEventListener();
    }

    initField = () =>{
        this.allSubtitles = [];
        this.currentSubtitles = [];
        this.repeatMode = false;
        this.autoScrollMode = false;

        let repeatImg = document.querySelector('#repeatBtn img');
        let autoScrollBtnImg = document.querySelector('#scrollBtn img');

        repeatImg.setAttribute('src', CONSTANT.BASE_IMG_URL + CONSTANT.REPEAT_OFF_IMG);
        autoScrollBtnImg.setAttribute('src', CONSTANT.BASE_IMG_URL + CONSTANT.SCROLL_OFF_IMG)
    };

    reloadSubtitle = () => {
        this.initExecuteCode();
        this.removeSubtitleList();
        this.initField();
        this.selectLangService.removeSelectOptionNode();
        this.loadSubtitles();
        this.connectWebVideo();
    };

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
        this.loadingWrapperNode.classList.remove('hideSubtitle');
        this.noSupportWrapperNode.classList.add('hideSubtitle');

        whale.tabs.executeScript({
            code: `
        if(window.showSubtitle.hasVideo())
            window.showSubtitle.getSubtitles();    
      `
        }, (result) => { //  실행된 코드 마지막 결과를 받아온다.
            
            if(result == null || result[0].length === 0){
                this.renderNoSupport();
            }
            else{
                let response = result[0];
                let langIdx = 0;
                let contentIdx = 1;

                this.currentSubtitles = this.transSubtitles(response[0][contentIdx]);

                response.map(subtitleItem =>{
                    this.allSubtitles[subtitleItem[langIdx]] = this.transSubtitles(subtitleItem[contentIdx]);
                });

                this.noSupportWrapperNode.classList.add('hideSubtitle');
                this.renderSubtitle(this.currentSubtitles);
                this.selectLangService.loadSelectOption(this.allSubtitles);
            }

            this.loadingWrapperNode.classList.add('hideSubtitle');
        });
    }

    connectWebVideo(){
        whale.tabs.executeScript({
            code: `
                window.showSubtitle.getCurrentPlayTime();
            `
        }, (result) => {
            if(result != null)
                this.scrollToTop(result[0], true);
        });

        whale.runtime.onConnect.addListener(port => {
            if (port.name === `readChannel`) {
                port.onMessage.addListener(message => {
                    this.syncVideo(message);
                    if(this.autoScrollMode)
                        this.scrollToTop(message);
                });
            }
        });

    }


    scrollToTop = (currentTime, initFlag = false) => {
        let currentSubtitle = this.currentSubtitles.filter(item => {
            return item.startTime <= currentTime && item.endTime >= currentTime;
        });

        if(currentSubtitle.length < 1 && !initFlag)
            return;

        let subtitleId = currentSubtitle[0].id;
        let subtitleWrapNode = document.querySelector('.subtitle_wrap[data-idx="'+ subtitleId + '"]');
        let subtitleContentNode = subtitleWrapNode.querySelector('.subtitle_content');
        
        subtitleContentNode.scrollIntoView({behavior: "auto", block: "center", inline: "nearest"}); // Bottom
    };

    scrollClickHandler = () => {
        let  autoScrollBtnImg = document.querySelector('#scrollBtn img');
        this.autoScrollMode = ! this.autoScrollMode;

        if(this.autoScrollMode){
            autoScrollBtnImg.setAttribute('src', CONSTANT.BASE_IMG_URL + CONSTANT.SCROLL_ON_IMG);
        } else {
            autoScrollBtnImg.setAttribute('src', CONSTANT.BASE_IMG_URL + CONSTANT.SCROLL_OFF_IMG);
        }
    };

    syncVideo(currentTime){
        let currentSubtitle = this.currentSubtitles.filter(item => {
            return item.startTime <= currentTime && item.endTime >= currentTime;
        });

        if(currentSubtitle.length < 1)
            return;

        let subtitleId = currentSubtitle[0].id;
        let subtitleWrapNode = document.querySelector('.subtitle_wrap[data-idx="'+ subtitleId + '"]');
        let subtitleContentNode = subtitleWrapNode.querySelector('.subtitle_content');

        ReadVideo.changeBarColor(subtitleContentNode, CONSTANT.PLAYING_BAR_COLOR);

        if(this.preSubtitle != null && subtitleContentNode !== this.preSubtitle){
            ReadVideo.changeBarColor(this.preSubtitle, CONSTANT.DEFAULT_BAR_TOP_COLOR);
        }

        this.preSubtitle = subtitleContentNode;
    }

    transSubtitles(subtitlesText) {
        let paragraphSplit = subtitlesText.replace(/(\r)/g, "").split('\n\n');

        let rst  = [];

        paragraphSplit.map( (item, idx) => {
            // 왓챠
            if(item.split('\n')[0].indexOf('-->') !== -1)
                item = idx + '\n' + item;

            let subtitle = new Subtitle();

            if(subtitle.adapter(item))
                rst.push(subtitle);

        });

        return rst;
    }

    renderSubtitle(subtitles){
        subtitles.map((item, index) => {
            let subtitleWrapNode = document.createElement('div');
            let subtitleContentNode = document.createElement('div');

            subtitleWrapNode.classList.add('subtitle_wrap');
            subtitleContentNode.classList.add('subtitle_content');

            subtitleContentNode.textContent = item.content;

            subtitleWrapNode.addEventListener('click', this.movePlayTime.bind(this));
            subtitleWrapNode.addEventListener('click', this.repeatModeClickHandler.bind(this));
            subtitleWrapNode.setAttribute('data-idx', index);

            subtitleWrapNode.appendChild(subtitleContentNode);
            this.subtitleListNode.appendChild(subtitleWrapNode);
        });
        console.log(this.subtitleListNode);
    }

    renderNoSupport(){
        //Todo 구체화 필요
        this.noSupportWrapperNode.classList.remove('hideSubtitle');
    }

    movePlayTime(event){
        if(this.repeatMode)
            return;

        let subtitleId = event.currentTarget.getAttribute('data-idx');

        whale.tabs.executeScript({
            code: `
                window.showSubtitle.setCurrentPlayTime(${this.currentSubtitles[subtitleId].startTime});
            `
        });
    }

    repeatBtnClickHandler(){
        this.repeatMode = !this.repeatMode;

        if(!this.repeatMode){ // 초기화
            this.setRepeatNodeStyle(this.repeatStartId, this.repeatEndId, false);
            this.repeatPlayTime(null, null);
            this.repeatStartId = null;
            this.repeatEndId = null;
        }
        ReadVideo.toggleRepeatIcon(this.repeatMode);
    }

    repeatModeClickHandler(event){
        let subtitleNode = event.currentTarget.querySelector('.subtitle_content');

        if(!this.repeatMode){
            if(subtitleNode.classList.contains('repeatSelect')){
                subtitleNode.classList.remove('repeatSelect');
            }
            return;
        }

        let subtitleId = event.currentTarget.getAttribute('data-idx');
        let isOneRepeat = this.repeatStartId === subtitleId && this.repeatEndId == null;
        let isInitEndId = this.repeatStartId != null && this.repeatEndId == null;
        let isUpdateEndId = this.repeatEndId < subtitleId;

        if(this.repeatStartId == null || this.repeatStartId > subtitleId){
            this.repeatStartId = subtitleId;
            this.repeatEndId = Math.max(this.repeatEndId, subtitleId)
        }

        if(isOneRepeat || isInitEndId || isUpdateEndId){
            this.repeatEndId = subtitleId;
        }

        if(this.repeatStartId != null && this.repeatEndId != null){
            let temp = this.repeatStartId;
            this.repeatStartId = Math.min(this.repeatStartId, this.repeatEndId);
            this.repeatEndId = Math.max(temp, this.repeatEndId);
            this.completeToSelectRepeat();
        }

        this.setRepeatNodeStyle(this.repeatStartId, this.repeatEndId, true);
    }

    repeatPlayTime(startTime, endTime){
        console.log("repeatPlayTime " + startTime + ", " + endTime);
        whale.tabs.executeScript({
            code: `
                window.showSubtitle.repeatMode = ${this.repeatMode};
                window.showSubtitle.repeatStartTime = ${startTime};
                window.showSubtitle.repeatEndTime = ${endTime};
                console.log(window.showSubtitle.repeatMode);
                if(window.showSubtitle.repeatMode){
                    window.showSubtitle.video.currentTime = ${startTime};
                    window.showSubtitle.video.play();
                }
                     
            `
        });
    }

    completeToSelectRepeat(){
        let starTime = this.currentSubtitles[this.repeatStartId].startTime;
        let endTime = this.currentSubtitles[this.repeatEndId].endTime;
        console.log(this.repeatStartId + ',' + this.repeatEndId);
        this.repeatPlayTime(starTime, endTime);
    }

    setRepeatNodeStyle(startId, endId, initFlag){
        let selectedNodes = this.currentSubtitles.slice(startId, endId*1 + 1);

        selectedNodes.map(subtitle => {
            let node = document.querySelector('.subtitle_wrap[data-idx="'+
                subtitle.id + '"]' + ' .subtitle_content');
            if(initFlag)
                node.classList.add('repeatSelect');
            else
                node.classList.remove('repeatSelect');
        });

    }

    static changeBarColor(node, color){
        node.style.borderColor = color;
    }

    static toggleRepeatIcon(isOn){
        let iconNode = document.querySelector('#repeatBtn img');
        let iconUrl = isOn ? CONSTANT.REPEAT_ON_IMG : CONSTANT.REPEAT_OFF_IMG;

        iconNode.setAttribute('src', CONSTANT.BASE_IMG_URL + iconUrl);
    }

    static openGuideClickHandler(event){
        document.querySelector('.guide_wrapper').classList.remove('hideSubtitle');
    }

    static closeGuideHandler(){
        document.querySelector('.guide_wrapper').classList.add('hideSubtitle');
    }

    static topBarIconToggleHandler(nodeList){
        for(let idx=0; idx < nodeList.length; idx++){
            let imgName = nodeList[idx].getAttribute('id');
            let iconImgName = imgName.replace('img', '');
            ReadVideo.iconAddEventHandler(imgName, iconImgName+'on.png', iconImgName+'off.png');
        }
    }

    static iconAddEventHandler(iconId, iconOnName, iconOffName){
        ReadVideo.iconMouseHandler(iconId,iconOnName, 'mouseover');
        ReadVideo.iconMouseHandler(iconId,iconOffName, 'mouseout');
    }

    static iconMouseHandler(iconId, iconName, event){
        document.querySelector('#' + iconId).addEventListener(event,()=>{
            document.querySelector('#' + iconId).setAttribute('src', CONSTANT.BASE_IMG_URL + iconName);
        });
    }


    whaleEventListener(){

        // 탭이 업데이트 되었을때
        whale.tabs.onUpdated.addListener((id, changeInfo) => {
            if(changeInfo.status === 'complete') {
               this.reloadSubtitle();
            }
        });

        // 다른 탭이 활성화 되었을때
        whale.tabs.onActivated.addListener(() => {
            this.reloadSubtitle();
        });

    }


}

export const readVideo = new ReadVideo();
