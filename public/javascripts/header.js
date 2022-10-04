
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
    document.getElementById("headerContainer").style.backgroundColor = document.getElementById("color").value;
};

// document.getElementById('show').addEventListener('click',show);
// document.querySelector('.modal-close').addEventListener('click',close);
// document.getElementById('changeColor').addEventListener('click',colorChange);
