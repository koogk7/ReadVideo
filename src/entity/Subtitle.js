
export default class Subtitle {
    constructor(){
        this.id = null;
        this.startTime = null;
        this.endTime = null;
        this.content= null;
    }

    adapter(subtitleTextArray){
        let lineSplit = subtitleTextArray.split('\n');
        if(lineSplit.length < 3){
            console.log("자막 형식이 올바르지 않습니다.");
            return false;
        }

        let timeLSplit = lineSplit[1].split('-->');
        let contentList = lineSplit.slice(2);

        this.id = lineSplit[0] - 1;
        this.startTime = this.strToSec(timeLSplit[0]);
        this.endTime = this.strToSec(timeLSplit[1]);

        this.content = contentList.join('\n');

        return true;
    }

    strToSec(strTime){ // 00:00:00.00 형식
        let colonSplit = strTime.split(/:/);
        return colonSplit[0]*60*60 + colonSplit[1]*60 + colonSplit[2]*1;
    }

}