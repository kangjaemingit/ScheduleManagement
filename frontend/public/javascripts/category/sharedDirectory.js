
// 팝업 열기
function sharedDirectoryModalOpen() {
    const element1 = document.getElementById('sharedDirectoryModal');
    // 2. style 변경
    element1.style.display='block';
    const moveModal=document.getElementById('modalOpenBtn');
    moveModal.style.display='none'

    fetch('calendar/getUserList', {
        method:"get"
    }).then((res) => res.json())
        .then((res) => {
            if(res.getUserSuccess === false){
                console.log(res.message);
                window.alert("유저정보 불러오기 실패");
                return;
            }

        })
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