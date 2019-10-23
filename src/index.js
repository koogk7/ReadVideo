import { COLOR } from './constants/index.js';
import FindMultipleWords from './services/FindMultipleWords.js';
import KeywordElement from './services/KeywordElement.js';

class ReadVideo {

  constructor() {
    this.input = document.querySelector('track');
    this.track= document.querySelector('track');

    if(this.track == null)
      console.log("페이지에서 자막을 찾을 수 없습니다.");
    else
      console.log("자막 추출 성공 : " + this.track.getAttribute('src'));

    this.keywordList = new KeywordElement();
    this.activeTabList = [];
    this.keywords = [];

    console.log("Success Load");

    // this.whaleEventListener();
    // this.eventListener();
  }

  checkRedeclared() {
    whale.windows.getCurrent({ populate: true }, (data) => {
      const currentTabId = data.tabs.filter((tab) => {
        return tab.active === true;
      })[0].id;

      if(this.activeTabList.indexOf(currentTabId) !== -1) return;
      this.activeTabList.push(currentTabId);
      this.initExecuteCode();
    });
  }

  initExecuteCode() {
    // 탭 페이지에 FMW 클래스 초기화
    whale.tabs.executeScript({
      code: `
        window.fmwClass = new ${FindMultipleWords}();
      `
    });
    // 탭 페이지에 CSS 추가
    whale.tabs.insertCSS({
      code: `
        .fmw-style-container {
          font-style: normal;
        }
        .fmw-style-container .fmw-style {
          font-style: normal;
          display: inline-block;
          box-shadow: 1px 3px 3px rgba(0,0,0,0.2);
          border-radius: 4px;
          padding: 0 5px;
          color: #000;
        }
        .fmw-style-0 {
          background: ${COLOR[0]};
        }
        .fmw-style-1 {
          background: ${COLOR[1]};
        }
        .fmw-style-2 {
          background: ${COLOR[2]};
        }
        .fmw-style-3 {
          background: ${COLOR[3]};
        }
        .fmw-style-4 {
          background: ${COLOR[4]};
        }
      `
    });
  }

  whaleEventListener() {
    // 탭이 업데이트 되었을때, 다시 문서에서 단어를 검색하도록
    whale.tabs.onUpdated.addListener((id, changeInfo) => {
      if(changeInfo.status === 'complete') {
        this.initExecuteCode();
        this.searchExecute(this.keywords.length>0);
      }
    });

    // 다른 탭이 활성화 되었을때, 다시 문서에서 단어를 검색하도록
    whale.tabs.onActivated.addListener(() => {
      this.checkRedeclared();
      this.searchExecute(this.keywords.length>0);
    });

    // 탭이 종료되었을때
    whale.tabs.onRemoved.addListener((id) => {
      const idx = this.activeTabList.indexOf(id);
      this.activeTabList.splice(idx, 1);
    });

    // 사이드바가 활성화 되었을때
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkRedeclared();
        this.input.focus();
      }
    });
    
    // 키워드 검색 후 키워드 개수 출력
    whale.runtime.onMessage.addListener((message) => {
      this.keywordList.appendKeywordCount(message);
    });
  }

  eventListener() {
    let oneCallCheck = true;

    this.input.addEventListener('keyup', (e) => {
      if(e.keyCode === 13 && oneCallCheck) {
        this.searchExecute();
        oneCallCheck = false;
        setTimeout(() => oneCallCheck = true, 300);
      }
    });

    document.body.addEventListener('click', (e) => {
      if(typeof e.target.className.baseVal !== 'undefined' 
        && e.target.className.baseVal.indexOf('keyword-list-close-btn') === 0) {
          const removeKeywordIdx = e.target.className.baseVal.split('list-close-idx-')[1];
          this.keywords.splice(removeKeywordIdx, 1);
          this.searchExecute(true);
      }
    }, {
      capture: true
    });
  }

  searchExecute(isDelete = false) {
    this.keywords = isDelete ? this.keywords : this.input.value.split(',');
    this.keywords = this.keywords.length > 5 ? this.keywords.slice(0, 5) : this.keywords;
    this.keywords = this.keywords.map((keyword) => {
      return keyword.trim();
    }).filter(Boolean);

    whale.tabs.executeScript({
      code: `
        window.fmwClass.resetWordCount();
        window.fmwClass.searchDomElement(${JSON.stringify(this.keywords)});
        whale.runtime.sendMessage(fmwClass.wordCount);
      `
    });

    this.keywordList.removeKeywordList();
    if(this.keywords.length) {
      this.keywordList.appendKeywordList(this.keywords);
      this.input.value = '';
    }
  }

}

new Fmw();
