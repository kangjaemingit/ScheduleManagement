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
function chartDataChange() {
    const readyCount = document.getElementsByClassName('readyBox').length; // 미완료 카운트
    const completeCount = document.getElementsByClassName('completeBox').length; // 완료 카운트

    chart.data.datasets[0].data = [completeCount, readyCount]; // 차트 데이터 셋 변경
    chart.options.elements.center.text = ((completeCount / (readyCount + completeCount)) * 100).toFixed(1) + '%'; // 차트 중앙 완료율 변경
    chart.update(); // 차트 재렌더
}


/**
 * 담당자 : 강재민, 김건희
 * 함수 설명 : 차트 옵션 변경 및 차트 초기 데이터 설정
 * 주요 기능 : 강재민
 *            - 미완료 카운트와 완료 카운트로 데이터 바인딩
 *            - 차트 중앙의 완료율 변경
 *            김건희
 *            - 도넛 차트 틀 작성
 *            - 도넛 차트 중앙에 글씨를 적기 위한 함수 작성
 * */
let doughnutDraw = function () {
    let doughnutPainter = document.getElementById('doughnutChart').getContext('2d');
    const readyCount = document.getElementsByClassName('readyBox').length;
    const completeCount = document.getElementsByClassName('completeBox').length;


    doughnutData = {
        labels: ['완료', '진행중'],
        datasets: [{
            data: [completeCount, readyCount],
            backgroundColor: ["#c2fdb9", "#b9e8fc"],
        }]
    }
    let completeRate;

    if (readyCount === 0 && completeCount === 0) {
        completeRate = "표시할 완료율이 없습니다."
    } else {
        completeRate = ((completeCount / (readyCount + completeCount)) * 100).toFixed(1) + '%'
    }

    /*************************************************************
     * 담당자 : 김건희
     * 기능 : 1. 도넛 차트의 한가운데 글씨를 쓰기위한 선언
     *************************************************************/
    Chart.register({
        id: 'doughnut-centertext',
        beforeDraw: function (chart) {
            if (chart.config.options.elements.center) {
                // 그래프에 문자열 작성
                let ctx = chart.ctx;

                // 그래프 옵션에 들어갈 센터 object
                let centerConfig = chart.config.options.elements.center;
                let fontStyle = centerConfig.fontStyle || 'Arial';
                let txt = centerConfig.text;
                let color = centerConfig.color || '#000';
                let maxFontSize = centerConfig.maxFontSize || 75;
                let sidePadding = centerConfig.sidePadding || 20;
                let sidePaddingCalculated = (sidePadding / 100) * (chart._metasets[chart._metasets.length - 1].data[0].innerRadius * 2)
                // 기본 폰트 크기는 30px
                ctx.font = "30px " + fontStyle;

                // 문자열의 너비와 요소의 너비에서 10을 빼서 5px 측면 패딩해준다.
                let stringWidth = ctx.measureText(txt).width;
                let elementWidth = (chart._metasets[chart._metasets.length - 1].data[0].innerRadius * 2) - sidePaddingCalculated;

                // 글꼴의 너비가 최대 얼마나 커질건지 정하기
                let widthRatio = elementWidth / stringWidth;
                let newFontSize = Math.floor(30 * widthRatio);
                let elementHeight = (chart._metasets[chart._metasets.length - 1].data[0].innerRadius * 2);

                // 레이블 높이보다 크지 않도록 새 글꼴 크기를 선택
                let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
                let minFontSize = centerConfig.minFontSize;
                let lineHeight = centerConfig.lineHeight || 25;
                let wrapText = false;

                if (minFontSize === undefined) {
                    minFontSize = 20;
                }

                if (minFontSize && fontSizeToUse < minFontSize) {
                    fontSizeToUse = minFontSize;
                    wrapText = true;
                }

                // 올바르게 그리려면 글꼴 설정을 지정하기
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                ctx.font = fontSizeToUse + "px " + fontStyle;
                ctx.fillStyle = color;

                if (!wrapText) {
                    ctx.fillText(txt, centerX, centerY);
                    return;
                }

                let words = txt.split(' ');
                let line = '';
                let lines = [];

                // 필요한 경우 단어를 여러 줄로 나눕니다.
                for (let n = 0; n < words.length; n++) {
                    let testLine = line + words[n] + ' ';
                    let metrics = ctx.measureText(testLine);
                    let testWidth = metrics.width;
                    if (testWidth > elementWidth && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }

                // 줄 높이와 줄 수에 따라 중심을 위로 이동
                centerY -= (lines.length / 2) * lineHeight;

                for (let n = 0; n < lines.length; n++) {
                    ctx.fillText(lines[n], centerX, centerY);
                    centerY += lineHeight;
                }
                //그래프 중간에 텍스트 그려주기
                ctx.fillText(line, centerX, centerY);
            }
        }
    });
    /*************************************************************
     * 담당자 : 김건희,강재민
     * 기능 : 김건희
     *       1. 도넛 차트 그려주기
     *       2. 도넛 중간에 들어가는 크기 설정
     *       강재민
     *       1. 들어갈 텍스트 변수 입력
     *************************************************************/
    chart = new Chart(doughnutPainter, {
        type: 'doughnut',
        data: doughnutData,
        options: {
            responsive: false,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            elements: {
                center: {
                    maxText: '100%',
                    text: completeRate,
                    fontColor: '#FF6684',
                    backgroundColor: 'red',
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontStyle: 'normal',

                    // fontSize가 지정되지 않은 경우 중앙의 최대 공간을 차지하도록 maxText의 크기를 (아래 제한 내에서) 조정합니다.
                    // 둘 중 하나를 지정하지 않으면 기본값은 1과 256입니다.
                    minFontSize: 10,
                    maxFontSize: 16,
                }
            },
        }
    })
}