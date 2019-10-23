console.log("test");
console.log("test");
console.log("test");


window.onload = function () {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'blob:https://tv.naver.com/695e1e19-4ad2-43e7-a893-2b4f2f6038d9');
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        if (xhr.status === 200) {
            console.log(xhr.responseText);

            document.getElementById('content').innerHTML = xhr.responseText;
        } else {
            console.log(`[${xhr.status}] : ${xhr.statusText}`);
        }
    };
};

document.addEventListener(`visibilitychange`, function() {
    if (document.visibilityState === `visible`) {
        // 사이드바가 열렸을 때
        console.log("Open Sidebar");
    } else {
        // 사이드바가 닫혔을 때
        console.log("Close Sidebar");
    }
});




