// const calendarEl = document.getElementById("calendar"); //캘린더를 넣어줄 html div

document.addEventListener('DOMContentLoaded', function () {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        customButtons:{
            myCustomButton: {
                text: '스케줄 추가!',
                click: function() {
                    // <script src={'./schedule/scheduleModal.js'}></script>
                    // let openScheduleModalBG = document.getElementById('scheduleModal');
                    // let openScheduleModalBody = document.getElementById('scheduleModalBody');
                    // let closeScheduleModal = document.getElementById('scheduleModalClose');
                    // let scheduleCloseModal=document.getElementById('scheduleModalClosed')
                    //
                    // openScheduleModalBG.style.display='block'
                    // openScheduleModalBody.style.display='block'
                    // closeScheduleModal.addEventListener("click", function (){
                    //     openScheduleModalBG.style.display='none'
                    //     openScheduleModalBody.style.display='none'
                    // })
                    // scheduleCloseModal.addEventListener("click", function (){
                    //     openScheduleModalBG.style.display='none'
                    //     openScheduleModalBody.style.display='none'
                    // })
                    scheduleModalOpen();
                }
            }
        },
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek myCustomButton',
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
        navLinks:true,//날짜 혹은 해당ㅇ 주에 해당하는 일정 클릭시 뷰를 따라가 보여줌
        selectable:true,
        selectMirror:true,
        select: function (arg){
          console.log(arg);
          let calendar=[];
          calendar.addEvent({
              title  : arg.title,
              start  : arg.startDate,
              end    : arg.endDate,
              // allDay     : arg.allDay,
              backgroundColor : "pink",//일정추가시 원하는 색으로 지정
              // textColor //원하는 글색으로 바꿀수있음
          })
          calendar.unselect()
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
            let closeSceduleModal = document.getElementById('scheduleModalClose');
            let Xbutton = document.getElementById('dayModalClosed');
            let scheduleCloseModal=document.getElementById('scheduleModalClosed')

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
            Xbutton.addEventListener("click", function (){
                openDayModalBG.style.display='none'
                openDayModal.style.display='none'
            })
            closeSceduleModal.addEventListener("click", function (){
                openSceduleModalBG.style.display='none'
                openSceduleModalBody.style.display='none'
            })
            scheduleCloseModal.addEventListener("click", function (){
                openSceduleModalBG.style.display='none'
                openSceduleModalBody.style.display='none'
            })
        },
        //일정클릭시 이벤트
        // eventClick: function (arg) {
        //     console.log("일정클릭시 나타날 이벤트 추가해주세요")
        // },
        timeZone: 'local',
        events:[
            fetch('calendar/getSchedule',{
                method:'get',

            }).then((res)=>res.json())
                .then(res=>{
                if(res.scheduleRenderSuccess==false){
                    window.alert(res.message)
                }
                for(let i=0; i<res.scheduleData.length;i++)
                {
                    calendar.addEvent({
                        title : res.scheduleData[i].title,
                        start : res.scheduleData[i].date.startDate,
                        end : res.scheduleData[i].date.endDate,
                    })
                }
            })
        ],
            // [
            //     {
            //         title: '프로젝트',//일정정보 제목
            //         url: '',//지도 주소 넣어서 지도 찾아갈 수 있게 하면 될듯
            //         start: '2022-10-04',//시작 일시 new Date(연,달,일)
            //         end: '2022-10-16T15:00:00',//끝나는 일시
            //         allDay: true//하루종일인지 아닌지 확인
            //     },
            //     {
            //         title: '프로젝트',//일정정보 제목
            //         url: '',//지도 주소 넣어서 지도 찾아갈 수 있게 하면 될듯
            //         start: '2022-10-17T05:00:00',//시작 일시 new Date(연,달,일)
            //         end: '2022-10-17T15:00:00',//끝나는 일시
            //         allDay: false//하루종일인지 아닌지 확인
            //     }
            // ],

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
