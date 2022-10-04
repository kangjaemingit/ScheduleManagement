const calendarEl = document.getElementById("calendar"); //캘린더를 넣어줄 html div
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'dayGrid', 'timeGrid' ],
        header: {
            left: 'dayGridMonth,timeGridWeek,timeGridDay custom1',
            center: 'title',
            right: 'custom2 prevYear,prev,next,nextYear'
        },
        footer: {
            left: 'custom1,custom2',
            center: '',
            right: 'prev,next'
        },
        customButtons: {
            custom1: {
                text: 'custom 1',
                click: function() {
                    alert('clicked custom button 1!');
                }
            },
            custom2: {
                text: 'custom 2',
                click: function() {
                    alert('clicked custom button 2!');
                }
            }
        }
    });

    calendar.render();
});