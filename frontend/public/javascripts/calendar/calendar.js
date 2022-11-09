// const calendarEl = document.getElementById("calendar"); //캘린더를 넣어줄 html div

let calendar; // 캘린더 변수 선언

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
            start: 'allScheduleButton,myScheduleButton',
            center: 'title',
            end: 'prevYear,prev,today,next,nextYear'
        },
        firstDay: 1,
        titleFormat: function (date) {
            let year = date.date.year;
            let month = date.date.month + 1;
            return year + "년" + month + "월";
        },
        //일정 클릭시 이벤트 함수
        eventClick:function(e){
            //일정 클릭시 일정상세페이지 가져옴
            scheduleDetailModalOpen(e.event._def.extendedProps._id, true);
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
    defaultSchedule(); // 일정 초기값 세팅
});

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 초기값을 세팅해주는 함수입니다.
 * 주요 기능 : - 캘린더의 모든일정을 삭제한 뒤 개인에게 맞는 본인 일정과 공유받은 일정을 불러와 렌더링 합니다.
 * */
function defaultSchedule() {
    calendar.removeAllEvents();
    fetch('calendar/getScheduleByUser', {
        method: 'get',
    }).then((res) => res.json())
        .then(res => {
            // 일정 불러오기 실패 시
            if (res.scheduleRenderSuccess == false) {
                window.alert(res.message)
                return;
            }

            // 나의 일정 이벤트 바인딩
            for (let i = 0; i < res.mySchedule.length; i++) {
                calendar.addEvent({
                    _id: res.mySchedule[i]._id,
                    scheduleWriter: res.mySchedule[i].scheduleWriter.name,
                    title: res.mySchedule[i].title,
                    start: res.mySchedule[i].date.startDate,
                    end: res.mySchedule[i].date.endDate,
                    color: "#96bebd",
                })
            }

            // 공유 받은 일정 이벤트 바인딩
            for (let i = 0; i < res.sharedSchedule.length; i++){
                let eventTitle = res.sharedSchedule[i].title + " (" + res.sharedSchedule[i].scheduleWriter.name + ")"
                calendar.addEvent({
                    _id: res.sharedSchedule[i]._id,
                    scheduleWriter: res.sharedSchedule[i].scheduleWriter.name,
                    title: eventTitle,
                    start: res.sharedSchedule[i].date.startDate,
                    end: res.sharedSchedule[i].date.endDate,
                    color: "#f0bf7d",
                })
            }
        });
    calendar.render();
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유받은 카테고리 선택시에 일정 변경을 위한 함수입니다.
 * 주요 기능 : - 기존의 일정 이벤트들을 모두 삭제하고, 인자로 받아온 일정을 캘린더에 추가해주는 역할을 합니다.
 * */
function changeCategorySchedule(schedule){
    calendar.removeAllEvents();
    for (let i = 0; i < schedule.length; i++) {
        let eventTitle = schedule[i].title + " (" + schedule[i].scheduleWriter.name + ")"
        calendar.addEvent({
            _id: schedule[i]._id,
            scheduleWriter: schedule[i].scheduleWriter.name,
            title: eventTitle,
            start: schedule[i].date.startDate,
            end: schedule[i].date.endDate,
            color : "#f0bf7d"
        })
    };
    calendar.render()
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 나의 카테고리 선택시에 일정 변경을 위한 함수입니다.
 * 주요 기능 : - 기존의 일정 이벤트들을 모두 삭제하고, 인자로 받아온 일정을 캘린더에 추가해주는 역할을 합니다.
 * */
function changeCategoryMySchedule(category){
    calendar.removeAllEvents();
    const tags = category.tags.map((t) => {return t._id}); // 카테고리에 해당하는 태그 배열

    // 태그 배열을 통해 나의 일정을 불러옴
    fetch('calendar/getMyScheduleByTag', {
        method: 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({tag : tags})
    }).then((res) => res.json())
        .then(res => {
            // 일정불러오기 실패시
            if(res.getMyScheduleSuccess === false){
                window.alert(res.message)
                return;
            }

            // 받아온 일정 바인딩
            for (let i = 0; i < res.schedule.length; i++) {
                calendar.addEvent({
                    _id: res.schedule[i]._id,
                    scheduleWriter: res.schedule[i].scheduleWriter.name,
                    title: res.schedule[i].title,
                    start: res.schedule[i].date.startDate,
                    end: res.schedule[i].date.endDate,
                    color: "#96bebd",
                })
            }

            // 캘린더 재렌더
            calendar.render()

            // 카테고리 상세 페이지의 일정목록 렌더링
            categoryDetailScheduleRender(res.schedule);
        });


}

/**
 * 담당자 : 강재민
 * 함수 설명 : 나의 일정 렌더링을 위한 함수입니다.
 * 주요 기능 : - 기존의 일정 이벤트들을 모두 삭제하고, 나의 일정을 요청하여 받아와 캘린더에 추가해줍니다.
 * */
function MyScheduleRender(){
    calendar.removeAllEvents(); // 기존 일정 모두 삭제
    // 나의 일정 불러오기
    fetch('calendar/getMySchedule', {
        method: 'get',
    }).then((res) => res.json())
        .then(res => {
            if (res.getMyScheduleSuccess == false) {
                window.alert(res.message)
                return;
            }

            // 일정 이벤트 바인딩
            for (let i = 0; i < res.schedule.length; i++) {
                calendar.addEvent({
                    _id: res.schedule[i]._id,
                    scheduleWriter: res.schedule[i].scheduleWriter.name,
                    title: res.schedule[i].title,
                    start: res.schedule[i].date.startDate,
                    end: res.schedule[i].date.endDate,
                    color: "#96bebd",
                })
            }
        });

    // 캘린더 재렌더링
    calendar.render();
}