
// 팝업 열기
async function sharedDirectoryModalOpen() {
    const sharedDirectoryModal = document.getElementById('sharedDirectoryModal');
    sharedDirectoryModal.style.display='block';
    const modalOpenBtn = document.getElementById('modalOpenBtn');
    modalOpenBtn.style.display='none'
    await fetch('calendar/sharedCategory', {
        method:"get"
    }).then((res) => res.json())
        .then(async (res) => {
            if (res.sharedCategorySuccess === false) {
                console.log(res.message);
                window.alert("공유받은 카테고리 정보 불러오기 실패");
                return;
            }
            let array = [{}];
            await res.sharedCategories.map((c) => {

                let idx;
                let writerExist = array.some(function (element, index, arr) {
                    if (element.categoryWriterId === c.categoryWriter._id){
                        idx = index;
                        return true;
                    } else return false;
                });

                if(writerExist){
                    array[idx].categories.push(c)
                } else{
                    return array.push({
                        categoryWriterId : c.categoryWriter._id,
                        writerProfile : c.categoryWriter.profilePhoto,
                        writerName : c.categoryWriter.name,
                        categories : [c]
                    })
                }
            });

            array.shift();

            let rows = [];
            array.map((c) => {
                rows += `<div class="sharerRootNode">`
                    + `<img class='arrowIcon' src="images/category/arrow-up.png" id='arrow_${c.categoryWriterId}' onclick='sharerChildNodeControl("${c.categoryWriterId}")'>`
                    + `<img class='sharerProfilePhoto' src='${c.writerProfile}'>`
                    + `<span>${c.writerName}</span></div>`
                    + `<div class="sharerChildNode" id='cn_${c.categoryWriterId}' style="display: none;">`;

                c.categories.map((c) => {
                    rows += `<div class="sharerNodeCategory" onclick='categorySelect(${JSON.stringify(c)})'><li class="sharerNodeCategoryLi">${c.categoryName}</li></div>`
                });

                rows += `</div>`;
            })
            document.getElementById('sharerList').innerHTML = rows;
        })
}

function categorySelect(category){
    const data = {
        tags : category.tags,
        categoryWriter : category.categoryWriter
    }
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
        events: [
        fetch('calendar/getScheduleByCategory', {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(data)
        }).then((res) => res.json())
            .then(async (res) => {
                // console.log(res.schedule);
                for(let i=0;i<res.schedule.length;i++){
                    console.log(res.schedule[0]);
                    calendar.addEvent({
                        _id: res.schedule[i]._id,
                        scheduleWriter: res.schedule[i].scheduleWriter.name,
                        title: res.schedule[i].title,
                        start: res.schedule[i].date.startDate,
                        end: res.schedule[i].date.endDate
                    })
                }
            }).catch((err) => {
            console.log(err);
        })
            ],
        //시간 포맷
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
        }
    })
    calendar.render()
}

function sharerChildNodeControl(id){
    let childNode = document.getElementById('cn_' + id);

    if(childNode.style.display === 'none'){
        childNode.style.display = 'block';
        document.getElementById('arrow_' + id).src = "/images/category/arrow-down.png";
    } else{
        childNode.style.display = 'none';
        document.getElementById('arrow_' + id).src = "/images/category/arrow-up.png";
    }
}
function movechildModal1(){
    const element2 = document.getElementById('categorychild1bg');
    // 2. style 변경
    element2.style.display = 'block';
}
// 팝업 닫기
function sharedDirectoryModalClose() {
    const sharedDirectoryModal = document.getElementById('sharedDirectoryModal');
    sharedDirectoryModal.style.display='none';
    const modalOpenBtn =document.getElementById('modalOpenBtn');
    modalOpenBtn.style.display='block'

    // const element2 = document.getElementById('categoryRootbg');
    // // 2. style 변경
    // element2.style.display = 'none';
}