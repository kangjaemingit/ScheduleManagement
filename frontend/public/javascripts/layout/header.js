
function colorChange(){
    let colorval = document.getElementById("color").value;
        document.getElementById("headerContainer").style.backgroundColor = colorval;
    const c = colorval.substring(1)      // 색상 앞의 # 제거
    const rgb = parseInt(c, 16)   // rrggbb를 10진수로 변환
    const r = (rgb >> 16) & 0xff  // red 추출
    const g = (rgb >>  8) & 0xff  // green 추출
    const b = (rgb >>  0) & 0xff  // blue 추출
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
    const p = document.getElementById("userInfo")
    const paint= document.getElementById('show')
    const logout = document.getElementById('logoutImage')
    if(luma<127.5){
        // 2. style 변경
        changeBrowseText.style.color = 'white';
        p.style.color='white';
        paint.src="../../images/layoutHeader/paintwhite.png";
        logout.src="../../images/layoutHeader/logoutWhite.png";
    }
    else{
        // 2. style 변경
        p.style.color='black'
        changeBrowseText.style.color = 'black';
        paint.src="../../images/layoutHeader/paintblack.png";
        logout.src="../../images/layoutHeader/logoutBlack.png"
    }
    const  colorData={
        navBgColor: colorval
    }
    fetch('layout/paint',{
      method:'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body:JSON.stringify(colorData)
    }).then((res) =>res.json())
        .then((res)=>{
            if(res.updateSuccess==false) {
                window.alert(res.message)
            }
        })
};
let buttonType='dropdown';
function movePageModal(){
    buttonType=(buttonType=="dropdown")?'up':"dropdown";
    let movePage = document.getElementById('headerUrlBox');
    if(buttonType=="dropdown"){movePage.style.display='block';}
    else{movePage.style.display='none';}
}
let changeBrowseText=document.getElementById('browse-category');
let moveCategoryPage=document.getElementById('Calendar');
let moveDashboardPage=document.getElementById('Dashboard');
let moveTagStatisticsPage=document.getElementById('TagStatistics')
moveCategoryPage.addEventListener("click", function (){
    changeBrowseText.innerText = "Calendar";
})
moveDashboardPage.addEventListener("click", function (){
    changeBrowseText.innerText = "Dashboard";
})
moveTagStatisticsPage.addEventListener("click", function (){
    changeBrowseText.innerText = "TagStatistics";
})

// function headerUrl(){
//     console.log("들어가냐")
//     let left = document.getElementById('indexLeft')
//     let right = document.getElementById('indexRight')
//     left.style.animation = 'slidedrop 1s linear reverse '
//     right.style.animation = 'slideright 1s linear reverse'
// }
// document.getElementById('show').addEventListener('click',show);
// document.querySelector('.modal-close').addEventListener('click',close);
