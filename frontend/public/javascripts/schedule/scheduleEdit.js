function scheduleEditModalOpen(scheduleId){
    console.log(scheduleId);
    // scheduleModalOpen();
    openDayModalBG.style.display='none'
    openDayModal.style.display='none'

    fetch('/schedule/getScheduleById/' + scheduleId, {
        method : "get"
    }).then((res) => res.json())
        .then((res) => {
            if(res.getScheduleSuccess === false){
                console.log(res.message);
                window.alert(res.message);
                return;
            }

            document.getElementById('scheduleModalName').innerText = "일정 편집";
            document.getElementById('scheduleTitle').value = res.schedule.title;
            document.getElementById('contents').value = res.schedule.contents;
            document.getElementById('startDate').value = res.schedule.date.startDate.slice(0, 16);
            document.getElementById('endDate').value = res.schedule.date.endDate.slice(0, 16);
            document.getElementById('priority').value = res.schedule.priority;
            if(res.schedule.address !== ""){
                document.getElementById('addressExist').checked = true;
                document.getElementById('address').value = res.schedule.address;
                document.getElementById('keyword').value = res.schedule.address;
                useAddress(document.getElementById('addressExist'));
                searchPlaces();
            }

            tags = res.schedule.tag.map((t) => {
                return t.tagName;
            })
            tagRender();

            document.getElementById('btnDeleteSchedule').setAttribute("onclick", `deleteSchedule('${scheduleId}')`);
            document.getElementById('btnDeleteSchedule').style.display = 'block';

            document.getElementById('btnSaveSchedule').setAttribute("onclick", `updateSchedule('${scheduleId}')`)

            scheduleModal.classList.toggle('show');
            console.log(res.schedule);
        }).catch((e) => {
            console.log(e);
    })
}

function updateSchedule(scheduleId){
    const schedule = {
        scheduleId : scheduleId,
        title : document.getElementById('scheduleTitle').value,
        contents : document.getElementById('contents').value,
        startDate : document.getElementById('startDate').value,
        endDate : document.getElementById('endDate').value,
        priority : document.getElementById('priority').value,
        tag : tags,
        address : document.getElementById('address').value
    }

    if(!document.getElementById('addressExist').checked){
        schedule.address = "";
    }

    if(!validCheck(schedule)){
        return;
    }

    fetch('schedule/updateSchedule', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(schedule)
    }).then((res) => res.json())
        .then((res) => {
            if(res.updateScheduleSuccess){
                window.alert("일정이 정상적으로 수정되었습니다.");
                window.location.reload();
            } else{
                window.alert(res.message);
            }
        }).catch((err) => {
        console.log(err);
    })

}

function deleteSchedule(scheduleId){
    if(window.confirm("정말 일정을 삭제하시겠습니까?")){
        fetch('schedule/deleteSchedule', {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({scheduleId : scheduleId})
        }).then((res) => res.json())
            .then((res) => {
                if(res.deleteScheduleSuccess){
                    window.alert("일정이 정상적으로 삭제되었습니다.");
                    window.location.reload();
                } else{
                    window.alert(res.message);
                }
            }).catch((err) => {
            console.log(err);
        })
    }

}