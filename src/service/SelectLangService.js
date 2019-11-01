export default class SelectLangService{
    constructor(){
        this.selectNode = document.querySelector('#selectLanBtn');
        this.langList = [];
    }

    loadSelectOption = (allSubtitles) => {
        for (let key in allSubtitles){
            this.langList.push(key);
            this.appendOptionNode(key);
        }
    };

    appendOptionNode = (lang) => {
        let optionNode = document.createElement('option');
        optionNode.setAttribute('value', lang);
        optionNode.textContent = lang;
        this.selectNode.appendChild(optionNode);
    };

    removeSelectOptionNode = () => {
        while(this.selectNode.firstChild) {
            this.selectNode.removeChild(this.selectNode.firstChild);
        }
    }
}