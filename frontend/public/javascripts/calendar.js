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
                    scheduleModalOpen();

                }
            }
        },
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay myCustomButton',
            center: 'title',
            end: 'prevYear,prev,today,next,nextYear'
        },
        select: function(start, end, allDay) {
            console.log(start)
            console.log(end)
            calendar.start
            calendar.end
        },
        firstDay: 1,
        titleFormat: function (date) {
            let year = date.date.year;
            let month = date.date.month + 1;
            return year + "년" + month + "월";
        },
        //날짜 클릭시 이벤트 함수
        dateClick: function (arr) {
            //클릭한 날짜 값을 가져옴
            let clickDay = new Date(arr.date.toDateString()).getTime();
            //모든 이벤트 가져오기
            let scheduleArray=[]
            calendar.getEvents().map((date)=>{
                let startDay = new Date(date.start.toDateString()).getTime();
                let endDay = new Date(date.end.toDateString()).getTime();
                if(clickDay>=startDay && clickDay<=endDay){
                    scheduleArray.push(date);
                }
            })
            dayClickModalOpen(scheduleArray);
        },
        eventLimit:true,
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
                        _id : res.scheduleData[i]._id,
                        scheduleWriter : res.scheduleData[i].scheduleWriter.name,
                        title : res.scheduleData[i].title,
                        start : res.scheduleData[i].date.startDate,
                        end : res.scheduleData[i].date.endDate,
                    })
                }
            }),
        ],

        //시간 포맷
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
        }
    })
    calendar.render();
});
