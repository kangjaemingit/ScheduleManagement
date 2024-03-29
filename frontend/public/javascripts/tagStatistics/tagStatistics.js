/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 통계 페이지가 실행될 때 함께 실행되는 함수입니다.
 * 주요 기능 : - 태그 통계의 전체 데이터를 받아와 바인딩합니다.
 * */
window.onload = function () {
    fetch('tagStatistics/data', {
        method: 'get'
    }).then((res) => res.json())
        .then((res) => {
            if (res.statisticsDataSuccess === false) {
                window.alert("통계 데이터를 불러오지 못했습니다.");
                console.log(res.message);
                return;
            }
            document.getElementById('scheduleAllCount').innerText = res.scheduleAllCount // 총 일정 갯수
            document.getElementById('usedTagKindCount').innerText = res.usedTagKindCount // 사용한 태그 종류 수
            document.getElementById('usedTagAllCount').innerText = res.usedTagAllCount // 사용한 전체 태그 수
            if (res.usedTags.length) { // 태그 배열이 있을 시
                setDefaultData(res.usedTags); // 초기 값 설정
            } else { // 태그 배열이 없을 시 데이터 없음 이미지 표시
                let img = `<img src="images/noData.png" style="width: 50%; opacity: 0.07">`
                document.getElementById('paintPieChart').innerHTML = img;
            }
        }).catch((err) => {
        window.alert("통계데이터 불러오기 데이터 통신 실패");
        console.log(err);
    })
}
/**************************************************************************************
 * 담당자 : 김건희
 * 역활 : 파이차트 초기화 데이터 작성
 **************************************************************************************/
// 파이 차트 데이터 초기화
let pieData = {
    labels: ['i', 'd', 'o', 'l', 'b', 'a'],
    datasets: [{
        data: [30, 20, 10, 5, 15, 20],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
    }]
};
/**************************************************************************************
 * 담당자 : 김건희
 * 역활 : 수평막대차트 초기화 데이터 작성
 **************************************************************************************/
// 막대 차트 데이터 초기화
let barData = {
    labels: ['su', 'ji', 'i', 'u', 'jee', 'su'],
    datasets: [{
        data: [60, 2, 8, 7, 13, 10],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
    }]
};

let etcData = []; // 기타 태그에 담길 배열
/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 통계 페이지에 초기 값을 설정하는 함수입니다.
 * 주요 기능 : - 데이터 초기 값을 차트에 설정하고, 차트를 만들어주는 역할을 합니다.
 * */
function setDefaultData(data) {
    // 막대 그래프 데이터 셋팅
    let barTagName = [];
    let barTagCount = [];
    let barColors = ['#ffafb0', '#ffafd8', '#eeb7b4', '#f2cfa5', '#fcffb0', '#aee4ff', '#b5c7ed', '#c4f4fe', '#bee9b4', '#fdfa87', '#fcc6f7', '#caa6fe', '#ffafd8', '#afffba', '#e2ffaf', '#fcffb0', '#f2cfa5', '#83a7a3', '#acb890', '#dfd4e4'];

    data.map((el) => { // 막대 그래프 데이터 바인딩
        barTagName.push(el.tagName);
        barTagCount.push(el.count);
    })

    barData = {
        labels: barTagName,
        datasets: [{
            data: barTagCount,
            backgroundColor: barColors,
            datalabels: {anchor: 'center', color: 'black', align: 'center', font: {size: 12}}
        }]
    }

    // 파이 차트 데이터 셋팅
    let pieTagName = [];
    let pieTagCount = [];
    let pieColors = ['#fbb9ba', '#fdd3ba', '#fcecb9', '#c2fdb9', '#b9e8fc', '#c1bafd', '#eebbfe', '#e3e3e3'];
    let etcCount = 0;

    for (let i = 0; i < data.length; i++) {
        if (i < 7) {
            pieTagName.push(data[i].tagName);
            pieTagCount.push(data[i].count);
        } else {
            etcData.push(data[i]._id);
            etcCount += data[i].count;
        }
    }

    if (data.length > 7) {
        pieTagName.push("기타");
        pieTagCount.push(etcCount);
    }


    pieData = {
        labels: pieTagName,
        datasets: [{
            data: pieTagCount,
            backgroundColor: pieColors,
        }]
    };

    barChartDraw();
    pieChartDraw();
}
/**************************************************************************************
 * 담당자 : 김건희
 * 함수 : pieChartDraw
 * 기능 : 1. 태그 사용 퍼센테이지 적용 원형 차트 그리기
 *       2. 범례 모달을 만들기 위해 기본 범례 지우기
 **************************************************************************************/
let pieChartDraw = function () {
    let piePainter = document.getElementById('pieChart').getContext('2d');

    window.pieChart = new Chart(piePainter, {
        type: 'pie',
        data: pieData,
        borderRadius: 20,
        options: {
            responsive: false,// legendCallback: customLegend
            plugins: {
                legend: {
                    display: false,
                }
            },
        },
        plugins: [htmlLegendPlugin],
    });
};

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 통계의 원형 차트의 범례를 커스텀 하는 함수입니다.
 * 주요 기능 : - 차트 우측에 엘리먼트를 생성하여 범례를 커스텀하여 삽입하였습니다.
 * */
const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart, args, options) {
        let rows = "";

        let allCount = document.getElementById('usedTagAllCount').text;

        chart.legend.legendItems.map((item, index) => {
            rows += `<div class="legendComponent" onclick='changeSchedule("${item.text}")'>` +
                `<div class="legendColor" style="background-color: ${item.fillStyle};"></div>` +
                `<span>${item.text} : ${tagPercentage(pieData.datasets[0].data[index])}% (${pieData.datasets[0].data[index]})</span>` +
                `</div>`
        })
        document.getElementById('div-legend').innerHTML = rows;
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 우측의 일정 목록을 렌더링 해주는 함수입니다.
 * 주요 기능 : - 일정 목록을 입력받아 우측의 일정을 바인딩해주는 역할을 합니다.
 * */
function scheduleRender(schedule) {
    let rows = "";
    schedule.map((s) => {
        rows += `<div class="totalScheduleContentsGroup" onclick='scheduleDetailModalOpen("${s._id}", false)'>`
            + (s.complete ? `<div class="totalScheduleHeader2"><img src="/images/complete.png" style="width: 15px; height: 15px"></div>` : `<div class="totalScheduleHeader2"><img src="/images/ready.png" style="width: 15px; height: 15px"></div>`)
            + `<div class="totalScheduleHeader2">${s.title}</div>`
            + `<div class="totalScheduleHeader2">${dateFormatter(s.date.startDate)}</div>`
            + `<div class="totalScheduleHeader2">${dateFormatter(s.date.endDate)}</div>`
            + `</div>`
    })
    document.getElementById('tagStatisticsSchedule').innerHTML = rows
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 원형 차트의 범례와 막대 그래프의 막대를 클릭했을때 그 태그에 해당하는 일정을 불러오는 함수입니다.
 * 주요 기능 : - 태그를 입력받아 그 태그에 해당하는 나의 일정을 바인딩합니다.
 * */
function changeSchedule(tag) {
    if (tag === "기타") { // 기타일때 별도 처리
        return changeScheduleEtc();
    }

    fetch('tagStatistics/findMyTagByTagName/' + tag, {
        method: 'get'
    }).then((res) => res.json())
        .then((res) => {
            if (res.getTagSuccess === false) {
                window.alert("태그로 일정을 불러오는데 실패했습니다.");
                console.log(res.message);
                return;
            }
            scheduleRender(res.tagInfo.schedule)
            listBackgroundColor();
        }).catch((err) => {
        window.alert("태그로 일정 불러오기 실패");
        console.log(err);
    })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 원형 차트의 범례에서 기타에 해당하는 일정을 불러오기 위한 함수입니다.
 * 주요 기능 : - etcData에 담아두었던 기타 데이터들을 모두 입력받아 일정을 불러왔습니다.
 * */
function changeScheduleEtc() {
    fetch('tagStatistics/findMyTagByNotTagName/', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags: etcData})
    }).then((res) => res.json())
        .then((res) => {
            if (res.getScheduleSuccess === false) {
                window.alert("태그로 일정을 불러오는데 실패했습니다.");
                console.log(res.message);
                return;
            }
            console.log(res);
            scheduleRender(res.schedule)
            listBackgroundColor();
        }).catch((err) => {
        window.alert("태그로 일정 불러오기 실패");
        console.log(err);
    })

}

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그의 퍼센트를 계산해주는 함수입니다.
 * 주요 기능 : - 전체 태그수 와 해당 태그의 갯수를 통해 퍼센트를 계산하여 return합니다.
 * */
function tagPercentage(count) {
    let allCount = document.getElementById('usedTagAllCount').innerText;

    return ((count / allCount) * 100).toFixed(1);

}
/**************************************************************************************
 * 담당자 : 김건희
 * 함수 : barChartDraw
 * 기능 : 1. 태그 사용 개수 및 퍼센테이지 적용 수평 막대 차트 그리기
 *       2. 수평 막대 차트처럼 보이지 않기 위해 범례 지우기
 *       3. 수평 막대 차트처럼 보이지 않기 위해 격자선 지우기
 **************************************************************************************/
let barChartDraw = function () {
    let usedTagAllCount = document.getElementById('usedTagAllCount').innerText
    let barPainter = document.getElementById('barChart').getContext('2d');
    let canvasHeight = document.getElementById("barChart");
    let h = barData.labels.length * 50;
    canvasHeight.style.height = h + 'px';
    window.barChart = new Chart(barPainter, {
        type: 'bar',
        data: barData,
        plugins: [ChartDataLabels],
        options: {
            onresize: true,
            responsive: false,
            parsing: {},
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            borderRadius: 20,
            barRadius: 20,
            borderSkipped: false,
            maintainAspectRatio: false,
            line: {
                borderWidth: 0,
            },
            scales: {
                x: {
                    border:{
                      display:false
                    },
                    grid: {
                        borderColor: '#fff',
                        drawBorder: false,
                        drawTicks: false,
                        drawOnChartArea: false,
                    },
                    title: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    }
                },
                y: {
                    border:{
                      color: '#fff'
                    },
                    grid: {
                        display:false,
                        borderColor: '#fff',
                        drawBorder: false,
                        drawTicks: false,
                        drawOnChartArea: false,
                    },

                    alignToPixels: true,
                },
            },
            plugins: {
                tooltip: {
                    enabled: true,
                },
                legend: {
                    display: false,
                },
                datalabels: {
                    formatter: function (value, context) {
                        return value + ' / ' + usedTagAllCount + ' (' + ((value / usedTagAllCount) * 100).toFixed(1) + '%)';
                    }
                }
            },
            onClick: (e) => {
                changeSchedule(e.chart.tooltip.title);
            },
            indexAxis: 'y',
        },
    });
};

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 통계 페이지의 일정 목록을 초기값으로 돌려주는 함수입니다.
 * 주요 기능 : - 나의 모든 일정을 불러와 일정목록에 표시합니다.
 * */
function reloadSchedule() {
    fetch('calendar/getMySchedule', {
        method: 'get'
    }).then((res) => res.json())
        .then((res) => {
            if (res.getMyScheduleSuccess === false) {
                window.alert("일정을 불러오는데 실패했습니다.");
                console.log(res.message);
                return;
            }
            scheduleRender(res.schedule)
            listBackgroundColor();
        }).catch((err) => {
        window.alert("내 일정 불러오기 실패");
        console.log(err);
    })
}

/***************************************************************************
 * 담당자 : 김건희
 * 함수 : dateFormat()
 * 기능 :  1. ISOstring()시 날짜 하루 밀리는 현상을 고치기 위해 작성한 함수
 ***************************************************************************/
function dateFormatter(date) {
    let today = new Date();
    let inputDate = new Date(date)
    let offset = today.getTimezoneOffset() * 60000
    let DateOffset = new Date(inputDate.getTime() - offset);
    let dateString = DateOffset.toISOString().slice(0, 16).replace("T", " ")

    return dateString;
}

/***************************************************************************
 * 담당자 : 김건희
 * 함수 : listBackgroundColor()
 * 기능 :  1. 생성되는 리스트가 홀수일때와 짝수일때 뒷 배경 색을 서로 다르게 줘서 패턴 생성
 ***************************************************************************/
function listBackgroundColor() {
    const totalScheduleContentsGroup = document.getElementsByClassName('totalScheduleContentsGroup')
    for (let i = 0; i < totalScheduleContentsGroup.length; i++) {
        if (i % 2 === 0) {
            totalScheduleContentsGroup[i].style.backgroundColor = 'white';
        } else if (i % 2 === 1) {
            totalScheduleContentsGroup[i].style.backgroundColor = 'rgba(0,150,255,0.05)';
        }
    }
}