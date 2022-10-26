window.onload = function () {
    pieChartDraw();
    barChartDraw();
    customLagend();
}

let piesData = {
    labels: ['i', 'd', 'o', 'l', 'b', 'a'],
    datasets: [{
        data: [30, 20, 10, 5, 15, 20],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
    }]
};

let pieChartDraw = function () {
    let piePainter = document.getElementById('pieChart').getContext('2d');

    window.pieChart = new Chart(piePainter, {
        type: 'pie',
        data: piesData,
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


let Data = {
    labels: ['su', 'ji', 'i', 'u', 'jee', 'su'],
    datasets: [{
        data: [60, 2, 8, 7, 13, 10],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)']
    }]
};

let barChartDraw = function () {
    let piePainter = document.getElementById('barChart').getContext('2d');
    window.pieChart = new Chart(piePainter, {
        type: 'bar',
        data: Data,
        options: {
            parsing: {},
            barPercentage: 0.5,
            borderRadius: 20,
            barRadius: 20,
            borderSkipped: false,
            scales: {
                xAxis: {
                    display: false,
                },
            },
            plugins: {
                legend: {
                    display: false,
                }
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