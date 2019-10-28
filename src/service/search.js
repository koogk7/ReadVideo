
export default class searchAdmin{
    constructor(){   
    }

    searchString(){

        document.getElementById("search_img").setAttribute("src", "./image/search_on.png");

        let value = document.getElementById("searchText").value.toUpperCase();
        let list = document.getElementsByClassName("subtitle_content");

        console.log(value);

        for(let i = 0; i < list.length; i++){

            if(list[i].innerHTML.toUpperCase().indexOf(value) > -1){
                list[i].style.display = "flex";
                //글자를 쪼개서 그 단어만 하이라이팅 해야함.
                console.log(list[i].innerHTML.toUpperCase().indexOf(value));
            }
            else{
                list[i].style.display = "none";
                //아무일도 안함.
            }
        }
        setTimeout(function(){
            document.getElementById("search_img").setAttribute('src', "./image/search_off.png");
        },100);
    }

}

