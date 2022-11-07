let chart;

let doughnutData = {
    labels: ['i', 'd', 'o', 'l', 'b', 'a'],
    datasets: [{
        data: [30, 20],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)'],
    }]
};

window.onload = function () {
    // fetch('completeRate', {
    //     method : 'get',
    // }).then((res) => res.json())
    //     .then((res) => {
    //         if(!res.completeRateSuccess){
    //             console.log(res.message);
    //             return window.alert(res.message);
    //         }
    //
    //         doughnutData = {
    //             labels : ['완료', '진행중'],
    //             datasets: [{
    //                 data : [res.readyCount, res.completeCount],
    //                 backgroundColor: ["#c2fdb9", "#b9e8fc"],
    //             }]
    //         }
    //
    //
    //     }).catch((err) => {
    //     console.log(err);
    // })
    doughnutDraw();
}

function chartDataChange(){
    const readyCount = document.getElementsByClassName('readyBox').length;
    const completeCount = document.getElementsByClassName('completeBox').length;

    chart.data.datasets[0].data = [completeCount, readyCount];
    chart.options.elements.center.text = (completeCount / (readyCount + completeCount)) * 100 + '%';
    chart.update();
}



let doughnutDraw = function (){
    let doughnutPainter = document.getElementById('doughnutChart').getContext('2d');
    const readyCount = document.getElementsByClassName('readyBox').length;
    const completeCount = document.getElementsByClassName('completeBox').length;


    doughnutData = {
        labels : ['완료', '진행중'],
        datasets: [{
            data : [completeCount, readyCount],
            backgroundColor: ["#c2fdb9", "#b9e8fc"],
        }]
    }
    let completeRate;

    if(readyCount === 0 && completeCount === 0){
        completeRate = "표시할 완료율이 없습니다."
    } else{
        completeRate = (completeCount / (readyCount + completeCount)) * 100 + '%'
    }



    Chart.register({
        id: 'doughnut-centertext',
        beforeDraw: function(chart) {
            if (chart.config.options.elements.center) {
                // Get ctx from string
                var ctx = chart.ctx;

                // Get options from the center object in options
                var centerConfig = chart.config.options.elements.center;
                var fontStyle = centerConfig.fontStyle || 'Arial';
                var txt = centerConfig.text;
                var color = centerConfig.color || '#000';
                var maxFontSize = centerConfig.maxFontSize || 75;
                var sidePadding = centerConfig.sidePadding || 20;
                var sidePaddingCalculated = (sidePadding / 100) * (chart._metasets[chart._metasets.length-1].data[0].innerRadius * 2)
                // Start with a base font of 30px
                ctx.font = "30px " + fontStyle;

                // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                var stringWidth = ctx.measureText(txt).width;
                var elementWidth = (chart._metasets[chart._metasets.length-1].data[0].innerRadius * 2) - sidePaddingCalculated;

                // Find out how much the font can grow in width.
                var widthRatio = elementWidth / stringWidth;
                var newFontSize = Math.floor(30 * widthRatio);
                var elementHeight = (chart._metasets[chart._metasets.length-1].data[0].innerRadius * 2);

                // Pick a new font size so it will not be larger than the height of label.
                var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
                var minFontSize = centerConfig.minFontSize;
                var lineHeight = centerConfig.lineHeight || 25;
                var wrapText = false;

                if (minFontSize === undefined) {
                    minFontSize = 20;
                }

                if (minFontSize && fontSizeToUse < minFontSize) {
                    fontSizeToUse = minFontSize;
                    wrapText = true;
                }

                // Set font settings to draw it correctly.
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                ctx.font = fontSizeToUse + "px " + fontStyle;
                ctx.fillStyle = color;

                if (!wrapText) {
                    ctx.fillText(txt, centerX, centerY);
                    return;
                }

                var words = txt.split(' ');
                var line = '';
                var lines = [];

                // Break words up into multiple lines if necessary
                for (var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + ' ';
                    var metrics = ctx.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > elementWidth && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }

                // Move the center up depending on line height and number of lines
                centerY -= (lines.length / 2) * lineHeight;

                for (var n = 0; n < lines.length; n++) {
                    ctx.fillText(lines[n], centerX, centerY);
                    centerY += lineHeight;
                }
                //Draw text in center
                ctx.fillText(line, centerX, centerY);
            }
        }
    });

    chart = new Chart(doughnutPainter,{
        type:'doughnut',
        data:doughnutData,
        options:{
            responsive:false,
            maintainAspectRatio:true,
            plugins:{
                legend: {
                    display: false,
                },
            },
            elements:{
                center:{
                    maxText: '100%',
                    text: completeRate,
                    fontColor: '#FF6684',
                    backgroundColor: 'red',
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontStyle: 'normal',

                    // fontSize: 12,
                    // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
                    // if these are not specified either, we default to 1 and 256
                    minFontSize: 10,
                    maxFontSize: 12,
                }
            },
        }
    })
}