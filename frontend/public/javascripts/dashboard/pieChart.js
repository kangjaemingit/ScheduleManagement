let chart; // 차트 변수 선언

let doughnutData = { // 차트 default 변수 선언
    labels: ['i', 'd', 'o', 'l', 'b', 'a'],
    datasets: [{
        data: [30, 20],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)'],
    }]
};

// 페이지가 렌더 됐을 떄 차트를 생성
window.onload = function () {
    doughnutDraw();
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 완료 상태 변경 시에 차트의 완료율을 변경해주는 함수입니다.
 * 주요 기능 : - 카운트를 다시 하여 데이터 셋을 변경해줍니다.
 * */
function chartDataChange(){
    const readyCount = document.getElementsByClassName('readyBox').length; // 미완료 카운트
    const completeCount = document.getElementsByClassName('completeBox').length; // 완료 카운트

    chart.data.datasets[0].data = [completeCount, readyCount]; // 차트 데이터 셋 변경
    chart.options.elements.center.text = (completeCount / (readyCount + completeCount)) * 100 + '%'; // 차트 중앙 완료율 변경
    chart.update(); // 차트 재렌더
}


/**
 * 담당자 : 강재민, 김건희
 * 함수 설명 : 차트 옵션 변경 및 차트 초기 데이터 설정
 * 주요 기능 : 강재민
 *            - 미완료 카운트와 완료 카운트로 데이터 바인딩
 *            - 차트 중앙의 완료율 변경
 * */
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
                    maxFontSize: 16,
                }
            },
        }
    })
}