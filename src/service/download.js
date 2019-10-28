
export default class downloadAdmin{
    constructor(){   
    }
    
    downloadText(){
        let list = document.getElementsByClassName("subtitle_content");
        let text = "";
        for (let i = 0; i < list.length; i++) {
            text += list[i].textContent;
            text += '\n';
        }
        let data = new Blob([text], {type: 'text/plain'});

        let url = window.URL.createObjectURL(data);

        document.getElementById('downloadBtn').href = url;
    }

}

