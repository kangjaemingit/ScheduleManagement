function colorChange(){
    document.getElementById("container").style.backgroundColor = document.getElementById("color").value;
};
// 팝업 열기
function show() {
    document.querySelector(".modal-bg").classList.add("show");
    // document.getElementById("area1").style.backgroundColor = document.getElementById("color").value
    // const element = document.getElementsByClassName('modal-bg');
    //
    // // 2. style 변경
    // element.style.display = 'block';
}

// 팝업 닫기
function close() {
    document.querySelector(".modal-bg").className = "background";
    // const element = document.getElementsByClassName('modal-bg');
    //
    // // 2. style 변경
    // element.style.display = 'hidden';
}

// document.querySelector("#show").addEventListener("click", show);
// document.querySelector("#close").addEventListener("click", close);
