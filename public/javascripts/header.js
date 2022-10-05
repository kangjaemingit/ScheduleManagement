
// 팝업 열기
function show() {
    const element1 = document.getElementById('modal-wrap');
    // 2. style 변경
    element1.style.display = 'block';
    const element2 = document.getElementById('modal-bg');
    // 2. style 변경
    element2.style.display = 'block';
}

// 팝업 닫기
function closed() {
    const element1 = document.getElementById('modal-wrap');
    // 2. style 변경
    element1.style.display = 'none';
    const element2 = document.getElementById('modal-bg');
    // 2. style 변경
    element2.style.display = 'none';
}
function colorChange(){
    let colorval = document.getElementById("color").value;
        document.getElementById("headerContainer").style.backgroundColor = colorval;
    const c = colorval.substring(1)      // 색상 앞의 # 제거
    const rgb = parseInt(c, 16)   // rrggbb를 10진수로 변환
    const r = (rgb >> 16) & 0xff  // red 추출
    const g = (rgb >>  8) & 0xff  // green 추출
    const b = (rgb >>  0) & 0xff  // blue 추출
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
    const p = document.getElementsByTagName("p")
    const paint= document.getElementById('show')
    for(var i=0;i<p.length;i++)
    if(luma<127.5){
        const textcol = p[i];
        // 2. style 변경
        textcol.style.color = 'white';
        paint.src="../../images/paintwhite.png";
    }
    else{
        const textcol = p[i];
        // 2. style 변경
        textcol.style.color = 'black';
        paint.src="../../images/paintblack.png";
    }
};


// document.getElementById('show').addEventListener('click',show);
// document.querySelector('.modal-close').addEventListener('click',close);

