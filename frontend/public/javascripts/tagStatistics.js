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
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
    }]
};

function dynamicColors(){
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};

function setDefaultData(data){
    let tagName = [];
    let tagCount = [];
    let colors = [];

    data.map((el) => {
        tagName.push(el.tagName);
        tagCount.push(el.count);
        colors.push(dynamicColors());
    })

    pieData = {
        labels: tagName,
        datasets: [{
            data: tagCount,
            backgroundColor: colors
        }]
    };

    barData = {
        labels: tagName,
        datasets: [{
            data : tagCount,
            backgroundColor: colors
        }]
    }
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
                    display: false,
                    position: 'right',
                    generateLabels:
                        function customLagend() {
                            let ul = document.createElement("ul");
                            let label = piesData.labels[0];
                            let legendColor = piesData.datasets[0].backgroundColor[0];
                            console.log(label)
                            console.log(legendColor)
                            for (let i = 0; i < piesData.datasets.length; i++) {
                                ul.innerHTML += `<li><span style="width:20px; height: 50px; background-color: ${legendColor[i]}; border-radius: 20px"></span>${label[i]}</li>`;
                            }
                        }
                }
            },
        },
    });
};




let barChartDraw = function () {
    let piePainter = document.getElementById('barChart').getContext('2d');
    let canvasHeight = document.getElementById("barChart");
        let h = barData.labels.length * 50;
        canvasHeight.style.height=h+'px';
    window.pieChart = new Chart(piePainter, {
        type: 'bar',
        data: barData,
        options: {
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
                }
            },
            onClick:(e)=>{
                console.log(e.chart.tooltip.title)
                console.log(e.chart.canvas.style.height)
                console.log(e.size)
            },
            indexAxis: 'y',
        },
    });
};

function customLagend(chart){
    console.log("chart"+chart);
    let ul = document.createElement("ul");
    let label = piesData.labels[0];
    let legendColor = piesData.datasets[0].backgroundColor[0];
    console.log(label)
    console.log(legendColor)
    for(let i=0; i<piesData.datasets.length;i++) {
        ul.innerHTML += `<li><span style="width:20px; height: 50px; background-color: ${legendColor[i]}; border-radius: 20px"></span>${label[i]}</li>`;
    }
}
function updateCanvasHeight(){
    let canvas = document.getElementById("barChart");
    for (i; i < barData.labels.length; i ++) {
        let h = i*50;
        canvas.style.height=h+'px';
    }
}
// let canvas = document.getElementById("barChart");
// let context = canvas.getContext('2d');
// let i = 0;
//
// context.lineWidth = 1;
// context.strokeStyle = 'pink';
//
// for (i; i < canvas.height; i ++) {
//     context.moveTo(i, 0);
//     context.lineTo(0, i);
// }
// context.stroke();