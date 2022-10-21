// const calendarEl = document.getElementById("calendar"); //캘린더를 넣어줄 html div
document.addEventListener('DOMContentLoaded', function () {
    defaultSchedule();
});

function defaultSchedule() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        customButtons: {
            myCustomButton: {
                text: '초기화',
                click: function () {
                    defaultSchedule();
                }
            }
        },
        dayMaxEvents : true,
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay myCustomButton',
            center: 'title',
            end: 'prevYear,prev,today,next,nextYear'
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
            let scheduleArray = []
            calendar.getEvents().map((date) => {
                let startDay = new Date(date.start.toDateString()).getTime();
                let endDay = new Date(date.end.toDateString()).getTime();
                if (clickDay >= startDay && clickDay <= endDay) {
                    scheduleArray.push(date);
                }
            })
            dayClickModalOpen(scheduleArray);
        },
        eventLimit: true,
        timeZone: 'local',
        events: [
            fetch('calendar/getScheduleByWriter', {
                method: 'get',
            }).then((res) => res.json())
                .then(res => {
                    if (res.scheduleRenderSuccess == false) {
                        window.alert(res.message)
                    }
                    for (let i = 0; i < res.mySchedule.length; i++) {
                        calendar.addEvent({
                            _id: res.mySchedule[i]._id,
                            scheduleWriter: res.mySchedule[i].scheduleWriter.name,
                            title: res.mySchedule[i].title,
                            start: res.mySchedule[i].date.startDate,
                            end: res.mySchedule[i].date.endDate,
                            color: "#4bc0c0",
                        })
                    }


                    for (let i = 0; i < res.sharedSchedule.length; i++){
                        calendar.addEvent({
                            _id: res.sharedSchedule[i]._id,
                            scheduleWriter: res.sharedSchedule[i].scheduleWriter.name,
                            title: res.sharedSchedule[i].title,
                            start: res.sharedSchedule[i].date.startDate,
                            end: res.sharedSchedule[i].date.endDate,
                            color: "#ff6384",
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
}

function changeSchedule(schedule){
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        customButtons: {
            myCustomButton: {
                text: '초기화',
                click: function () {
                    defaultSchedule();
                }
            }
        },
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay myCustomButton',
            center: 'title',
            end: 'prevYear,prev,today,next,nextYear'
        },
        firstDay: 1,
        dayMaxEvents : true,
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
            let scheduleArray = []
            calendar.getEvents().map((date) => {
                let startDay = new Date(date.start.toDateString()).getTime();
                let endDay = new Date(date.end.toDateString()).getTime();
                if (clickDay >= startDay && clickDay <= endDay) {
                    scheduleArray.push(date);
                }
            })
            dayClickModalOpen(scheduleArray);
        },
        eventLimit: true,
        timeZone: 'local',
        events: [

        ],
        //시간 포맷
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
        }
    })
    for (let i = 0; i < schedule.length; i++) {
        calendar.addEvent({
            _id: schedule[i]._id,
            scheduleWriter: schedule[i].scheduleWriter.name,
            title: schedule[i].title,
            start: schedule[i].date.startDate,
            end: schedule[i].date.endDate,
            color : "#ff6384"
        })
    };
    calendar.render()
}