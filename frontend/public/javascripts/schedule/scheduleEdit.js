function scheduleEditModalOpen(scheduleId){
    console.log(scheduleId);
    // scheduleModalOpen();
    // openDayModalBG.style.display='none'
    // openDayModal.style.display='none'

    fetch('/schedule/getScheduleById/' + scheduleId, {
        method : "get"
    }).then((res) => res.json())
        .then((res) => {
            if(res.getScheduleSuccess === false){
                console.log(res.message);
                window.alert(res.message);
                return;
            }

            console.log(res.schedule);
        }).catch((e) => {
            console.log(e);
    })
}