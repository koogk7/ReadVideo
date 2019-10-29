
export default class SearchAdmin{
    constructor(){
        this.highlightNodeList = [];
    }

    searchString = () => {

        document.getElementById("search_img").setAttribute("src", "./image/search_on.png");

        let value = document.getElementById("searchText").value;
        let pattern = new RegExp(value, 'i');
        let list = document.getElementsByClassName("subtitle_content");

        this.highlightNodeList.map(node => {
            SearchAdmin.removeHighlight(node);
        });
        this.highlightNodeList = [];

        for(let i = 0; i < list.length; i++){
            if( value !== '' && list[i].innerHTML.search(pattern) > -1){
                SearchAdmin.highlightWord(list[i], value);
                this.highlightNodeList.push(list[i]);
                list[i].classList.remove('hideSubtitle');
            } else if(value === ''){
                list[i].classList.remove('hideSubtitle');
            } else{
                list[i].classList.add('hideSubtitle');
            }
        }

        console.log(this.highlightNodeList);

        setTimeout(()=>{
            document.getElementById("search_img").setAttribute('src', "./image/search_off.png");
        },100);
    };

    enterSearchHandler = () => {
        if(event.keyCode == 13){
            this.searchString();
        }
    };

    static highlightWord = (subtitleNode, keyword) => {
        let pattern = new RegExp(keyword, 'gi');
        let originKeyword = subtitleNode.textContent.match(pattern);
        let highlightNode = originKeyword.map(keyword => {
            return '<span class="highlighting">' + keyword + '</span>';
        });

        highlightNode.map( (node, idx) => {
            subtitleNode.innerHTML = subtitleNode.textContent.replace(originKeyword[idx], highlightNode[idx]);
        })

    };

    static removeHighlight = (subtitleNode) => {
        subtitleNode.innerHTML = subtitleNode.textContent;
    }

}

