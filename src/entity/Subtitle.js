
export default class Subtitle {
    constructor(){
        console.log('Subtitle Construct!');
        this.startTime = null;
        this.endTime = null;
        this.content= null;
    }

    adapter(subtitleTextArray){
        console.log(subtitleTextArray);
        let lineSplit = subtitleTextArray.split('\n');

        if(lineSplit.length < 3){
            console.log("자막 형식이 올바르지 않습니다.");
            return false;
        }

        let timeLSplit = lineSplit[1].split('-->');
        let contentList = lineSplit.slice(2);

        this.startTime = timeLSplit[0];
        this.endTime = timeLSplit[1];

        this.content = contentList.join('\n');

        return true;
    }

}