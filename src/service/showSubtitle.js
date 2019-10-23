export default class ShowSubtitle {
  constructor() {
    this.body = document.body;
  }

  getSubtitles() {

      let track = document.querySelector('track');
      let trackAddress = track == null ? '' : track.getAttribute('src');

      if (track == null) {
          console.log("페이지에서 자막을 찾을 수 없습니다.");
          return null;
      }
      console.log("자막 추출 성공 : " + track.getAttribute('src'));

      // 비동기로 자막 내용을 가져와야함 ==> URL scheme must be "http" or "https" for CORS request. 에러 발생
      // let test = await fetch(trackAddress)
      //     .then(res => res.json())
      //     .then(res => res);

      let subtitle = this.requestSutitle(trackAddress);
      console.log(subtitle);

      return subtitle;
  }

requestSutitle(address) {
    const xhr = new XMLHttpRequest();
    let subtitle = '';


    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        if (xhr.status === 200) {
            document.getElementById('content').innerHTML = xhr.responseText;
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