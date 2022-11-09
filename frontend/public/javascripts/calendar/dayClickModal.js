/***************************************************************************
 * 담당자 : 김건희
 * 기능 :  1. 캘린더 날짜를 클릭시 그날 일정을 나타내어줄 모달창 띄우기
 *        2. 캘린더 시작 날과 끝나는 날을 가지고 와서 원하는 형태로 포맷
 *        3. 테이블의 원하는 열의 테이블 헤더를 클릭시 해당 열의 오름차순 내림차순
 *        4. backend에서 값을 가지고와서 원하는 값을 해당 위치에 넣기 위해 map 작성
 ***************************************************************************/


/***************************************************************************
 * 담당자 : 김건희
 * 함수 : clickBodyEvent3()
 * 기능 :  1. 캘린더 날짜를 클릭시 그날 일정을 나타내어줄 모달창 띄우기
 ***************************************************************************/

let openDayModalBG = document.getElementById('dayClickModalBG');
let openDayModal = document.getElementById('dayClickModalBody');
let body3 = document.querySelector("body");
body3.addEventListener('click', clickBodyEvent3);
function clickBodyEvent3(event){
    let target = event.target;
    // 1. review_write_info 영역 이면 pass
    if(target == event.currentTarget.querySelector("#dayClickModalBG") ){
        dayModalClosed();
    }
    if(target == event.currentTarget.querySelector("#dayClickModalBody") ){
        dayClickModalOpen();
    }
}

/***************************************************************************
 * 담당자 : 김건희
 * 함수 : dayClickModalOpen()
 * 기능 :  1. backend에서 값을 가지고와서 원하는 값을 해당 위치에 넣기 위해 map 작성
 *        2. 캘린더 시작 날과 끝나는 날을 가지고 와서 원하는 형태로 포맷
 ***************************************************************************/

function dayClickModalOpen(schedule){
    if(schedule){
        let scheduleList = []
        schedule.map((s)=>{
            let startDay = dateFormat(s.start).toISOString().substring(0, 10);
            let endDay = dateFormat(s.end).toISOString().substring(0, 10);
            scheduleList += `<tr onclick="scheduleDetailModalOpen('${s._def.extendedProps._id}', true);">`
            +`<td>${s.title}</td>`
            +`<td>${startDay}</td>`
            +`<td>${endDay}</td>`
            +`<td>${s._def.extendedProps.scheduleWriter}</td>`
            +`</tr>`
        })
        document.getElementById('scheduleTableBody').innerHTML = scheduleList;
    }
    const bodyScrollHidden=document.getElementsByTagName('body');
    bodyScrollHidden[0].style.overflow='hidden'
    openDayModalBG.style.display='block'
    openDayModal.style.display='block'
}

/***************************************************************************
 * 담당자 : 김건희
 * 함수 : tableSort()
 * 기능 :  1. 테이블의 원하는 열의 테이블 헤더를 클릭시 해당 열의 오름차순 내림차순
 ***************************************************************************/

let sortType = 'asc';
function tableSort(index) {
    let table = document.getElementById('dayClickModalTable');
    sortType = (sortType =='asc')?'desc' : 'asc'; // 오름차순 내림차순 클릭 때마다 변경
    let checkSort = true;
    let rows = table.rows;
    
    while (checkSort) { // 현재와 다음만 비교하기때문에 위치변경되면 다시 정렬해준다.
        checkSort = false;
        for (let i = 1; i < (rows.length - 1); i++) {
            let fCell = rows[i].cells[index].innerHTML.toUpperCase();
            let sCell = rows[i + 1].cells[index].innerHTML.toUpperCase();
            let row = rows[i];

            // 오름차순<->내림차순 ( 이부분이 이해 잘안됬는데 오름차순이면 >, 내림차순이면 <
            //                        이고 if문의 내용은 동일하다 )
            if ( (sortType == 'asc' && fCell > sCell) ||
                (sortType == 'desc' && fCell < sCell) ) {
                row.parentNode.insertBefore(row.nextSibling, row);
                checkSort = true;
            }
        }
    }
}

/***************************************************************************
 * 담당자 : 김건희
 * 함수 : dayModalClosed()
 * 기능 :  1. 모달창을 닫을때 실행할 함수
 ***************************************************************************/

function dayModalClosed(){
    const bodyScrollHidden=document.getElementsByTagName('body');
    openDayModalBG.style.display='none';
    openDayModal.style.display='none';
    bodyScrollHidden[0].style.overflow='hidden';
}

function dateFormat(date){
    let today = new Date();
    let inputDate = new Date(date)
    let offset = today.getTimezoneOffset() * 60000
    let DateOffset = new Date(inputDate.getTime() - offset);

    return DateOffset;
}