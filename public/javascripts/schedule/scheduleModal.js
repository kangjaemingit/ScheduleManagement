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

