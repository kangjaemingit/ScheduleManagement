
// 팝업 열기
function movemodar() {
    const element1 = document.getElementById('categoryRootbg');
    // 2. style 변경
    element1.style.display='block';
    const moveModal=document.getElementById('movemodal');
    moveModal.style.display='none'
}
function movechildModal1(){
    const element2 = document.getElementById('categorychild1bg');
    // 2. style 변경
    element2.style.display = 'block';
}

// 팝업 닫기
function closed() {
    const element1 = document.getElementById('categorychild1bg');
    // 2. style 변경
    element1.style.display = 'none';
    const element2 = document.getElementById('categoryRootbg');
    // 2. style 변경
    element2.style.display = 'none';
    const moveModal=document.getElementById('movemodal');
    moveModal.style.display='block'
}