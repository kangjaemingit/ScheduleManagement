/**************************************************************************************
 * 담당자 : 김건희
 * 기능 : 1. Navbar에서 햄버거 버튼 클릭시 각 페이지 이동하는 모달창 띄우기
 *       2. Navbar 배경색을 체우기 위한 파렛트 모달 띄우고 각  div영역 클릭시 Navbar 색상 변경
 *       3. Navbar 배경색에 따라 각 이미지의 색상 및 텍스트 색상바꾸는 기능 추가
 *       4. 각 영역 외에 클릭시 Navbar에 해당하는 모든 모달창 닫기
 * ************************************************************************************/
let body = document.querySelector("body");
let movePage = document.getElementById('headerUrlBox');
const hamburger = document.getElementById('hamburgerToggle');

body.addEventListener('click', clickBodyEvent);
/**************************************************************************************
 * 담당자 : 김건희
 * 함수 : clickBodyEvent()
 * 기능 : 각 영역외 클릭시 Navbar 해당 모달 닫아주는 함수
 **************************************************************************************/
function clickBodyEvent(event){
    let target = event.target;

    // 1. show 영역클릭시 pass
    if(target == event.currentTarget.querySelector("#show") ){
        return ;}
    // 2. optionList 영역클릭시 pass
    if(target == event.currentTarget.querySelector("#optionList") ){
        return ;}
    // 3. hamburgerToggle 영역 클릭시 pass
    if(target == event.currentTarget.querySelector("#hamburgerToggle") ) {
        //3.1 hamburgerToggle 영역이면서 클릭시 해당 src와 동일하면 다음과 같이 진행
        if (target.src === 'http://localhost:3000/images/layoutHeader/hamburgerblack.png') {
            movePage.style.display = 'flex';
            hamburger.src = '../../images/category/close_bg_none.png';
            hamburger.style.width = '25px';
            hamburger.style.height = '25px';
        }
        //3.2 hamburgerToggle 영역이면서 클릭시 해당 src와 동일하면 다음과 같이 진행
        else if(target.src==='http://localhost:3000/images/category/close_bg_none.png'){
            movePage.style.display = 'none';
            hamburger.src = '../../images/layoutHeader/hamburgerblack.png';
            hamburger.style.width = '50px';
            hamburger.style.height = '50px';
        }
        return;
        }
    // 4. 위에 해당하는 영역이 아닌 다른 영역 클릭시 아래와 같이 진행
    else{
        document.getElementById('optionList').style.display = 'none'
        movePage.style.display = 'none';
        hamburger.src = '../../images/layoutHeader/hamburgerblack.png';
        hamburger.style.width = '50px';
        hamburger.style.height = '50px';
    }
}
/**************************************************************************************
 * 담당자 : 김건희
 * 함수 : blockColorOption()
 * 기능 : 1. 붓 이미지 클릭시 Navbar의 해당 영역 배경색 변경
 *       2. 배경색에 따라 이미지 및 텍스트 잘보이게 하기 위해 이미지 변경 및 텍스트 색 변경
 *        2.1 각 배경색이 16진수로 작성하여 16 진수로 나올줄 알았으나 rgb로 나옴
 *        2.1.해결방법 : rgb값을 16진수로 바꾸고 16진수 값으로 각 r,b,g값을 계산하여 산출
 *        2.2 산출 값에 따른 이미지 및 텍스트 색 변경
 **************************************************************************************/
function blockColorOption(event) {
    let colorlist = document.getElementsByClassName('colorlist')
    let optionList = document.getElementById('optionList')
    document.getElementById('optionList').style.display = 'flex'
    optionList.addEventListener("click", function (event) {
        let targetColor = event.target.style.backgroundColor
        for (let i = 0; i < document.getElementsByClassName('colorlist').length; i++) {
            if (colorlist[i].style.backgroundColor === targetColor) {
                document.getElementById('headerContainer').style.backgroundColor = document.getElementsByClassName('colorlist')[i].style.backgroundColor;
                let colorVal = colorlist[i].style.backgroundColor
                let rgb = colorVal.replace(/[^%,.\d]/g, "").split(",");                             //color rgb값 16진수로 변환
                rgb.forEach(function (str, x, arr)
                {
                    if (str.indexOf("%") > -1) str = Math.round(parseFloat(str) * 2.55);   // 컬러값이 "%"일 경우, 변환하기.
                    str = parseInt(str, 10).toString(16);                                // 16진수 문자로 변환하기.
                    if (str.length === 1) str = "0" + str;
                    arr[x] = str;
                });

                let colorHex = "#" + rgb.join("")//16진수의 #을 제거
                const c = colorHex.substring(1)
                const rgb1 = parseInt(c, 16)   // rr를 정수로 변환
                const r = (rgb1 >> 16) & 0xff  // red 추출
                const g = (rgb1 >> 8) & 0xff  // green 추출
                const b = (rgb1 >> 0) & 0xff  // blue 추출
                const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709

                const p = document.getElementById("userInfo")
                const paint = document.getElementById('show')
                const logout = document.getElementById('logout')
                const hamburger = document.getElementById('hamburgerToggle')

                if (luma < 127.5) {
                    // 2. 어두울때 style 변경
                    p.style.color = 'white';
                    paint.src = "../../images/layoutHeader/painterWhite.png";
                    logout.style.color = 'white';
                    hamburger.src = "../../images/layoutHeader/hamburger.png";
                    logout.style.borderColor = "white";
                } else {
                    // 2. 밝을때 style 변경
                    p.style.color = 'black';
                    paint.src = "../../images/layoutHeader/painterBlack.png";
                    logout.style.color = 'black';
                    hamburger.src = "../../images/layoutHeader/hamburgerblack.png";
                    logout.style.borderColor = "black";
                }

                const colorData = {
                    navBgColor: colorVal
                }

                fetch('layout/paint', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(colorData)
                }).then((res) => res.json())
                    .then((res) => {
                        if (res.updateSuccess == false) {
                            window.alert(res.message);
                        }
                        document.getElementById('optionList').style.display = 'none';
                    })
            }
            document.getElementById('optionList').style.display = 'none';
        }
    })
}