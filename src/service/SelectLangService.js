export default class SelectLangService{
    constructor(){
        this.selectNode = document.querySelector('#selectLangBtn');
        this.langList = [];
    }

    loadSelectOption = (allSubtitles) => {
        for (let key in allSubtitles){
            this.langList.push(key);
            this.appendOptionNode(key);
        }
    };

    getCurrentLang = () =>{
        return this.selectNode.value;
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
    };


}