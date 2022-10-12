// const calendarEl = document.getElementById("calendar"); //캘린더를 넣어줄 html div

document.addEventListener('DOMContentLoaded', function () {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            end: 'prevYear,prev,today,next,nextYear'
        },
        editable: true,
        firstDay: 1,
        titleFormat: function (date) {
            let year = date.date.year;
            let month = date.date.month + 1;
            return year + "년" + month + "월";
        },

        //날짜 클릭시 이벤트 함수
        dateClick: function () {
            console.log("날짜 클릭시 나타날 이벤트 작성해주세요")
            let openDayModalBG = document.getElementById('dayClickModalBG');
            let openDayModal = document.getElementById('dayClickModalBody');
            let closeDayModal = document.getElementById('dayModalClose');
            let editSceduleModal = document.getElementById('editSchedule');
            let openSceduleModalBG = document.getElementById('scheduleModal');
            let openSceduleModalBody = document.getElementById('scheduleModalBody');
            let closeSceduleModal = document.getElementById('scheduleModalClosed');
            let Xbutton = document.getElementById('dayModalClose');
            openDayModalBG.style.display='block'
            openDayModal.style.display='block'
            closeDayModal.addEventListener("click",function (){
                openDayModalBG.style.display='none'
                openDayModal.style.display='none'
            })
            editSceduleModal.addEventListener("click",function (){
                openDayModalBG.style.display='none'
                openDayModal.style.display='none'
                openSceduleModalBG.style.display='block'
                openSceduleModalBody.style.display='block'
            })
            closeSceduleModal.addEventListener("click", function (){
                openSceduleModalBG.style.display='none'
                openSceduleModalBody.style.display='none'
            })
            Xbutton.addEventListener('click',function (){
                openDayModalBG.style.display='none'
                openDayModal.style.display='none'
            })
        },
        //일정클릭시 이벤트
        eventClick: function (arg) {
            console.log("일정클릭시 나타날 이벤트 추가해주세요")
        },
        timeZone: 'local',
        events: [
            {
                title: '프로젝트',//일정정보 제목
                url: '',//지도 주소 넣어서 지도 찾아갈 수 있게 하면 될듯
                start: '2022-10-04',//시작 일시 new Date(연,달,일)
                end: '2022-10-16T15:00:00',//끝나는 일시
                allDay: true//하루종일인지 아닌지 확인
            },
            {
                title: '프로젝트',//일정정보 제목
                url: '',//지도 주소 넣어서 지도 찾아갈 수 있게 하면 될듯
                start: '2022-10-17T05:00:00',//시작 일시 new Date(연,달,일)
                end: '2022-10-17T15:00:00',//끝나는 일시
                allDay: false//하루종일인지 아닌지 확인
            }
        ],
        //시간 포맷
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
        },
        formatDate: ('2018-09-01', {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
            timeZoneName: 'short',
            timeZone: 'UTC',
            locale: 'es'
        })
    })
    calendar.render();
});
