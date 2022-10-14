let openDayModalBG = document.getElementById('dayClickModalBG');
let openDayModal = document.getElementById('dayClickModalBody');
let closeDayModal = document.getElementById('dayModalClose');
let editScheduleModal = document.getElementById('editSchedule');
let Xbutton = document.getElementById('dayModalClosed');

function dayClickModalOpen(schedule){
    console.log("modal" + schedule[0]);
    if(schedule){
        let scheduleList = []

        schedule.map((s)=>{
            let startDay = s.start.toISOString().substring(0,10);
            let endDay = s.end.toISOString().substring(0,10);
            scheduleList += `<tr>`
            + `<td>${s.title}</td>`
            +`<td>${startDay}</td>`
            +`<td>${endDay}</td>`
            +`<td>${s._def.extendedProps.scheduleWriter}</td>`
            +`</tr>`
        })
        document.getElementById('scheduleTableBody').innerHTML= scheduleList;
    }

    openDayModalBG.style.display='block'
    openDayModal.style.display='block'
}

function dayModalClosed(){
    openDayModalBG.style.display='none'
    openDayModal.style.display='none'
}

editScheduleModal.addEventListener("click",function (){
    scheduleModalOpen();
    openDayModalBG.style.display='none'
    openDayModal.style.display='none'
})
