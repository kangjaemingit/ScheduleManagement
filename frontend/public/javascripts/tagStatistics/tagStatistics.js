
window.onload = function () {
    fetch('tagStatistics/data', {
        method : 'get'
    }).then((res) => res.json())
        .then((res) => {
            if(res.statisticsDataSuccess === false){
                window.alert("통계 데이터를 불러오지 못했습니다.");
                console.log(res.message);
                return;
            }
            document.getElementById('scheduleAllCount').innerText = res.scheduleAllCount
            document.getElementById('usedTagKindCount').innerText = res.usedTagKindCount
            document.getElementById('usedTagAllCount').innerText = res.usedTagAllCount
            setDefaultData(res.usedTags);

        }).catch((err) => {
        window.alert("통계데이터 불러오기 데이터 통신 실패");
        console.log(err);
    })
}

let pieData = {
    labels: ['i', 'd', 'o', 'l', 'b', 'a'],
    datasets: [{
        data: [30, 20, 10, 5, 15, 20],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
    }]
};

let barData = {
    labels: ['su', 'ji', 'i', 'u', 'jee', 'su'],
    datasets: [{
        data: [60, 2, 8, 7, 13, 10],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],

    }]
};

function dynamicColors(){
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};

function setDefaultData(data){
    let barTagName = [];
    let barTagCount = [];
    let barColors = ['#ffafb0', '#ffafd8', '#eeb7b4', '#f2cfa5', '#fcffb0', '#aee4ff', '#b5c7ed', '#c4f4fe', '#bee9b4', '#fdfa87', '#fcc6f7', '#caa6fe', '#ffafd8', '#afffba', '#e2ffaf', '#fcffb0', '#f2cfa5', '#83a7a3', '#acb890', '#dfd4e4'];

    data.map((el) => {
        barTagName.push(el.tagName);
        barTagCount.push(el.count);
        // barColors.push(dynamicColors());
    })

    barData = {
        labels: barTagName,
        datasets: [{
            data : barTagCount,
            backgroundColor: barColors,
            datalabels: { anchor:'center',color:'black',align:'center',font:{size:12}}
        }]
    }

    let pieTagName = [];
    let pieTagCount = [];
    let pieColors = ['#fbb9ba', '#fdd3ba', '#fcecb9', '#c2fdb9', '#b9e8fc', '#c1bafd', '#eebbfe', '#e3e3e3'];
    let etcCount = 0;

    for(let i = 0; i < data.length; i++){
        if(i < 7){
           pieTagName.push(data[i].tagName);
           pieTagCount.push(data[i].count);
        } else{
            etcCount += data[i].count;
        }
    }
    pieTagName.push("기타");
    pieTagCount.push(etcCount);

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



let pieChartDraw = function () {
    let piePainter = document.getElementById('pieChart').getContext('2d');

    window.pieChart  = new Chart(piePainter, {
        type: 'pie',
        data: pieData,
        borderRadius: 20,
        options: {
            responsive: false,// legendCallback: customLegend
            plugins: {
                legend: {
                    display : false,
                }
            },
        },
        plugins: [htmlLegendPlugin],
    });
};

const htmlLegendPlugin = {
    id : 'htmlLegend',
    afterUpdate(chart, args, options){
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

function scheduleRender(schedule){
    let rows= "";

    schedule.map((s) => {
        rows += `<div class="totalScheduleContentsGroup">`
            + (s.complete ? `<div class="totalScheduleHeader2"><img src="/images/complete.png" style="width: 15px; height: 15px"></div>` : `<div class="totalScheduleHeader2"><img src="/images/ready.png" style="width: 15px; height: 15px"></div>`)
            + `<div class="totalScheduleHeader2">${s.title}</div>`
            + `<div class="totalScheduleHeader2">${new Date(s.date.startDate).toISOString().replace('T', ' ').substring(0, 16)}</div>`
            + `<div class="totalScheduleHeader2">${new Date(s.date.endDate).toISOString().replace('T', ' ').substring(0, 16)}</div>`
            + `</div>`
    })

    document.getElementById('tagStatisticsSchedule').innerHTML = rows

}

function changeSchedule(tag){
    if(tag === "기타"){
        return;
    }

    fetch('tagStatistics/findMyTagByTagName/' + tag, {
        method : 'get'
    }).then((res) => res.json())
        .then((res) => {
            if(res.getTagSuccess === false){
                window.alert("태그로 일정을 불러오는데 실패했습니다.");
                console.log(res.message);
                return;
            }
            scheduleRender(res.tagInfo.schedule)

        }).catch((err) => {
        window.alert("태그로 일정 불러오기 실패");
        console.log(err);
    })
}

function tagPercentage(count){
    let allCount = document.getElementById('usedTagAllCount').innerText;

    return ((count/allCount) * 100).toFixed(1);

}

let barChartDraw = function () {
    let usedTagAllCount = document.getElementById('usedTagAllCount').innerText
    let piePainter = document.getElementById('barChart').getContext('2d');
    let canvasHeight = document.getElementById("barChart");
        let h = barData.labels.length * 50;
        canvasHeight.style.height=h+'px';
    window.pieChart = new Chart(piePainter, {
        type: 'bar',
        data: barData,
        plugins:[ChartDataLabels],
        options: {
            onresize:true,
            responsive: false,
            parsing: {},
            barPercentage: 0.5,
            categoryPercentage:0.5,
            borderRadius: 20,
            barRadius: 20,
            borderSkipped: false,
            maintainAspectRatio:false,
            line : {
              borderWidth : 0,
            },
            scales: {
                xAxes: {
                    grid:{
                        drawBorder:false,
                        drawTicks:false,
                        drawOnChartArea:false,

                    },
                    title:{
                        display:false,
                    },
                    ticks:{
                        display:false,
                    }
                },
                yAxes:{
                    grid:{
                        borderColor:'#fff',
                        drawBorder:false,
                        drawTicks:false,
                        drawOnChartArea:false,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                datalabels: {
                    formatter: function (value, context) {
                        return value+' / '+usedTagAllCount + ' (' + ((value / usedTagAllCount) * 100).toFixed(1) + '%)';
                    }
                }
            },
        onClick:(e)=>{
                changeSchedule(e.chart.tooltip.title);
                console.log(e.chart)
                console.log(e.chart.canvas.style.height)
                console.log(e.size)
            },
            indexAxis: 'y',
        },
    });
};

function reloadSchedule(){
    fetch('calendar/getMySchedule', {
        method : 'get'
    }).then((res) => res.json())
        .then((res) => {
            if(res.getMyScheduleSuccess === false){
                window.alert("일정을 불러오는데 실패했습니다.");
                console.log(res.message);
                return;
            }
            scheduleRender(res.schedule)

        }).catch((err) => {
        window.alert("내 일정 불러오기 실패");
        console.log(err);
    })
}