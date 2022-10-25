
window.onload = function () {
    pieChartDraw();
    barChartDraw();
}

let pieData = {
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
        data: pieData,
        options: {
            responsive: false,// legendCallback: customLegend
            plugins: {
                legend: {
                    display: true,
                },
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
            parsing:{},
            barPercentage:0.5,
            borderRadius: 20,
            borderColor:'transparent',
            scales: {
                xAxis: {
                    display:false,
                },
                yAxis:{

                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            },
            indexAxis:'y',
        },
    });
};