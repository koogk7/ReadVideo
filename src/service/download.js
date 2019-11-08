
export default class downloadAdmin{
    constructor(){   
    }
    
    downloadText(){
        document.getElementById("download_img").setAttribute('src', "./image/download_on.png");

        let list = document.getElementsByClassName("subtitle_content");
        let text = "";
        for (let i = 0; i < list.length; i++) {
            text += list[i].textContent;
            text += '\n\n';
        }
        let data = new Blob([text], {type: 'text/plain'});

        let url = window.URL.createObjectURL(data);

        document.getElementById('downloadBtn').href = url;

    }

}

