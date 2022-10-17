let openDayModalBG = document.getElementById('dayClickModalBG');
let openDayModal = document.getElementById('dayClickModalBody');

function dayClickModalOpen(schedule){
    console.log("modal" + schedule[0]);
    if(schedule){
        let scheduleList = []

        schedule.map((s)=>{
            let startDay = s.start.toISOString().substring(0,10);
            let endDay = s.end.toISOString().substring(0,10);
            scheduleList += `<tr onclick="editSchedule();">`
            +`<td>${s.title}</td>`
            +`<td>${startDay}</td>`
            +`<td>${endDay}</td>`
            +`<td>${s._def.extendedProps.scheduleWriter}</td>`
            +`</tr>`
        })

        document.getElementById('scheduleTableBody').innerHTML = scheduleList;
    }

    openDayModalBG.style.display='block'
    openDayModal.style.display='block'
}


let sortType = 'asc';
function tableSort(index) {
    let table = document.getElementById('dayClickModalTable');
    sortType = (sortType =='asc')?'desc' : 'asc'; // 오름차순 내림차순 클릭 때마다 변경
    let checkSort = true;
    let rows = table.rows;
    
    while (checkSort) { // 현재와 다음만 비교하기때문에 위치변경되면 다시 정렬해준다.
        checkSort = false;
        for (let i = 0; i < (rows.length - 1); i++) {
            let fCell = rows[i].cells[index].innerHTML.toUpperCase();
            let sCell = rows[i + 1].cells[index].innerHTML.toUpperCase();
            let row = rows[i];

            // 오름차순<->내림차순 ( 이부분이 이해 잘안됬는데 오름차순이면 >, 내림차순이면 <
            //                        이고 if문의 내용은 동일하다 )
            if ( (sortType == 'asc' && fCell > sCell) ||
                (sortType == 'desc' && fCell < sCell) ) {
                row.parentNode.insertBefore(row.nextSibling, row);
                checkSort = true;
                console.log(checkSort)
            }
        }
    }
}

function dayModalClosed(){
    openDayModalBG.style.display='none'
    openDayModal.style.display='none'
}

function editSchedule(){
    scheduleModalOpen();
    openDayModalBG.style.display='none'
    openDayModal.style.display='none'
}
