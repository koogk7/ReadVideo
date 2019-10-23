export default class SubtitleAdmin {
  constructor() {
    this.body = document.body;
  }
  getSubtitlesAddress() {

      let track= document.querySelector('track');
      let rst = '';

      if(track == null)
          console.log("페이지에서 자막을 찾을 수 없습니다.");
      else{
          console.log("자막 추출 성공 : " + track.getAttribute('src'));
          rst = track.getAttribute('src');
      }

      return track.getAttribute('src');

  }
}