const body = document.querySelector('body');
const scheduleModal = document.querySelector('.scheduleModal');
function scheduleModalOpen(){
    scheduleModal.classList.toggle('show');

    if(scheduleModal.classList.contains('show')){
        body.style.overflow = 'hidden';
    }
}

function scheduleModalClose(){
    scheduleModal.classList.toggle('show');
}

function saveSchedule(){
    const newSchedule = {
        title : document.getElementById('scheduleTitle').value,
        contents : document.getElementById('contents').value,
        startDate : document.getElementById('startDate').value,
        endDate : document.getElementById('endDate').value,
        priority : document.getElementById('priority').value,
        tag : document.getElementById('tag').value,
        address : document.getElementById('address').value
    }
    fetch('schedule/newSchedule', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(newSchedule)
    }).then((res) => res.json())
        .then((res) => {
            if(res.createSuccess){
                window.alert("일정이 정상적으로 등록되었습니다.");
                window.location.reload();
            } else{
                window.alert(res.message);
            }
        }).catch((err) => {
            console.log(err);
        })
}