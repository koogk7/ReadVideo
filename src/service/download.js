var text = 'Some data I want to export';
var data = new Blob([text], {type: 'text/plain'});
var urll = window.URL.createObjectURL(data);

// window.URL.revokeObjectURL(url);
// document.getElementById('download_link').href = url;


export default class downloadAdmin{
  
    // test(){
    //     console.log('download test');

    //     download("hello.txt","This is the content of my file :)");
    //     whale.downloads.download({
    //         url: urll,
    //         filename: 'subtitle.png',
    //         saveAs: true
    //     }, downloadId => {
    //         // 만약 'downloadId' 가 undefined 라면 오류가 발생했다는 뜻입니다.
    //         // 그러므로 이후의 과정을 진행하기 전에 오류 여부를 확인해야 합니다.
    //         if (typeof downloadId !== `undefined`) {
    //             console.log(`다운로드가 시작되었습니다. (ID: ${downloadId})`);
    //         }
    //     });
    // }

}

