function blockColorOption(){
    let colorlist=document.getElementsByClassName('colorlist')
    let optionList= document.getElementById('optionList')
    document.getElementById('optionList').style.display='flex'
    optionList.addEventListener("click", function (event){
        let targetColor=event.target.style.backgroundColor
        for (let i = 0; i < document.getElementsByClassName('colorlist').length; i++) {
            if (colorlist[i].style.backgroundColor === targetColor) {
                console.log(colorlist[i].style.backgroundColor)
                document.getElementById('headerContainer').style.backgroundColor=document.getElementsByClassName('colorlist')[i].style.backgroundColor;
                let colorVal = colorlist[i].style.backgroundColor
                //color rgb값 16진수로 변환
                let rgb = colorVal.replace( /[^%,.\d]/g, "" ).split( "," );

                rgb.forEach(function (str, x, arr){

                    /* 컬러값이 "%"일 경우, 변환하기. */
                    if ( str.indexOf( "%" ) > -1 ) str = Math.round( parseFloat(str) * 2.55 );

                    /* 16진수 문자로 변환하기. */
                    str = parseInt( str, 10 ).toString( 16 );
                    if ( str.length === 1 ) str = "0" + str;

                    arr[ x ] = str;

                });
                console.log("#" + rgb.join( "" ))
                let colorHex="#" + rgb.join( "" )
                const c = colorHex.substring(1)
                const rgb1 = parseInt(c,16)   // rr를 정수로 변환
                const r = (rgb1 >> 16) & 0xff  // red 추출
                const g = (rgb1 >> 8) & 0xff  // green 추출
                const b = (rgb1 >> 0) & 0xff  // blue 추출
                const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
                const p = document.getElementById("userInfo")
                const paint = document.getElementById('show')
                const logout = document.getElementById('logout')
                const hamburger = document.getElementById('hamburgerToggle')
                if (luma < 127.5) {
                    // 2. style 변경
                    p.style.color = 'white';
                    paint.src = "../../images/layoutHeader/painterWhite.png";
                    logout.style.color = 'white';
                    hamburger.src = "../../images/layoutHeader/hamburger.png";
                    logout.style.borderColor = "white"
                } else {
                    // 2. style 변경
                    p.style.color = 'black'
                    paint.src = "../../images/layoutHeader/painterBlack.png";
                    logout.style.color = 'black'
                    hamburger.src = "../../images/layoutHeader/hamburgerblack.png";
                    logout.style.borderColor = "black"
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
                            window.alert(res.message)
                        }
                        document.getElementById('optionList').style.display='none'
                    })
            }
        }
            })
}

let movePage = document.getElementById('headerUrlBox');
const hamburger = document.getElementById('hamburgerToggle')
let buttonType='up';
function movePageModal(){
    buttonType=(buttonType=="dropdown")?'up':"dropdown";
    if(buttonType==="dropdown"){
        movePage.style.display='flex';
        hamburger.src='../../images/category/close_bg_none.png';
        hamburger.style.width='25px';
        hamburger.style.height='25px';
    }
    else{
        movePage.style.display='none';
        hamburger.src='../../images/layoutHeader/hamburgerblack.png';
        hamburger.style.width='50px';
        hamburger.style.height='50px';
    }
}
function imgChange(colorVal){

}
// let changeBrowseText=document.getElementById('movePageText');
// let moveCategoryPage=document.getElementById('Calendar');
// let moveDashboardPage=document.getElementById('Dashboard');
// let moveTagStatisticsPage=document.getElementById('TagStatistics')
// moveCategoryPage.addEventListener("click", function (){
//     changeBrowseText.style.marginLeft='65px'
//     changeBrowseText.innerText = `Calendar`;
// })
// moveDashboardPage.addEventListener("click", function (){
//     changeBrowseText.innerText = "Dashboard";
//     changeBrowseText.style.marginLeft='65px'
// })
// moveTagStatisticsPage.addEventListener("click", function (){
//     changeBrowseText.innerText = "TagStatistics";
//     changeBrowseText.style.marginLeft='65px'
// })

// function headerUrl(){
//     console.log("들어가냐")
//     let left = document.getElementById('indexLeft')
//     let right = document.getElementById('indexRight')
//     left.style.animation = 'slidedrop 1s linear reverse '
//     right.style.animation = 'slideright 1s linear reverse'
// }
// document.getElementById('show').addEventListener('click',show);
// document.querySelector('.modal-close').addEventListener('click',close);

function clickOption(){
    let optionValue=document.getElementById('optionList')

    optionValue.addEventListener('click',function (event){
        console.log(event.target)
    })
}