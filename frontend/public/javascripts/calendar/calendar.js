// const calendarEl = document.getElementById("calendar"); //캘린더를 넣어줄 html div

let calendar;

document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        customButtons: {
            allScheduleButton: {
                text: '모든일정',
                click: function () {
                    defaultSchedule();
                }
            },
            myScheduleButton: {
                text : '내일정',
                click: function() {
                    MyScheduleRender()
                }
            }
        },
        dayMaxEvents : true,
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay allScheduleButton,myScheduleButton',
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
                let startday = date.start.getTime();
                let endday = date.end.getTime();
                let startDay = new Date(date.start.toDateString()).getTime();
                let endDay = new Date(date.end.toDateString()).getTime();
                if (clickDay >= startDay && clickDay <= endDay) {
                    scheduleArray.push(date);
                    if(startday===endday){
                        if(startday===""||endday===""){}
                        else alert("시작시간과 끝나는 시간이 동일합니다.")
                    }
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
    defaultSchedule();
});

function defaultSchedule() {
    calendar.removeAllEvents();
    fetch('calendar/getScheduleByUser', {
        method: 'get',
    }).then((res) => res.json())
        .then(res => {
            if (res.scheduleRenderSuccess == false) {
                window.alert(res.message)
                return;
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
        });
    calendar.render();
}

function changeCategorySchedule(schedule){
    calendar.removeAllEvents();
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

function changeCategoryMySchedule(category){
    calendar.removeAllEvents();
    const tags = category.tags.map((t) => {return t._id});

    fetch('calendar/getMyScheduleByTag', {
        method: 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({tag : tags})
    }).then((res) => res.json())
        .then(res => {
            if(res.getMyScheduleSuccess === false){
                window.alert(res.message)
                return;
            }
            for (let i = 0; i < res.schedule.length; i++) {
                calendar.addEvent({
                    _id: res.schedule[i]._id,
                    scheduleWriter: res.schedule[i].scheduleWriter.name,
                    title: res.schedule[i].title,
                    start: res.schedule[i].date.startDate,
                    end: res.schedule[i].date.endDate,
                    color: "#4bc0c0",
                })
            }
            calendar.render()
            categoryDetailScheduleRender(res.schedule);

        });


}

function MyScheduleRender(){
    calendar.removeAllEvents();
    fetch('calendar/getMySchedule', {
        method: 'get',
    }).then((res) => res.json())
        .then(res => {
            if (res.getMyScheduleSuccess == false) {
                window.alert(res.message)
                return;
            }
            for (let i = 0; i < res.schedule.length; i++) {
                calendar.addEvent({
                    _id: res.schedule[i]._id,
                    scheduleWriter: res.schedule[i].scheduleWriter.name,
                    title: res.schedule[i].title,
                    start: res.schedule[i].date.startDate,
                    end: res.schedule[i].date.endDate,
                    color: "#4bc0c0",
                })
            }
        });
    calendar.render();
}