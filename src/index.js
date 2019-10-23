
import DownloadAdmin from './service/download.js';

class ReadVideo {

  constructor() {
    this.input = document.querySelector('track');
    this.donwloadBtn= document.querySelector('#downloadBtn')
    this.track= document.querySelector('track');
    this.downloadAdmin = new DownloadAdmin();

    console.log(this.donwloadBtn);
    this.donwloadBtn.addEventListener('click', this.downloadAdmin.test);

    if(this.track == null)
      console.log("페이지에서 자막을 찾을 수 없습니다.");
    else
      console.log("자막 추출 성공 : " + this.track.getAttribute('src'));

    
    console.log("Success Load");

    // this.whaleEventListener();
    // this.eventListener();
  }

}

new ReadVideo();
