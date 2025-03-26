import Chart from 'chart.js/auto';

export function createGraphDynamics(ctx, monthArr, balanceArr, expansesArr, incomeArr) {
    Chart.defaults.font.size = 20;
    Chart.defaults.font.family = 'Work Sans';
    Chart.defaults.color = '#000';
    let data = null;

    if (window.matchMedia("(max-width: 576px)").matches) {
        Chart.defaults.font.size = 14; 
    }

    if (window.matchMedia("(max-width: 320px)").matches) {
        Chart.defaults.font.size = 12; 
    }
    
    if (balanceArr) {
        data = {
            labels: monthArr,
            datasets: [{
                data: balanceArr,
                backgroundColor: '#116acc',
            }],
        }
    } else if (expansesArr) {
        data = {
            labels: monthArr,
            datasets: [
                {
                    data: expansesArr,
                    backgroundColor: '#fd4e5d',
                },
                {
                    data: incomeArr,
                    backgroundColor: '#76ca66'
                }
            ],
        }
    }

    let maxNum = null;
    const maxExpanses = Math.floor(Math.max(...expansesArr));
    const maxIncome = Math.floor(Math.max(...incomeArr));
    if (maxIncome > maxExpanses) {
        maxNum = maxIncome;
    } else if (maxIncome < maxExpanses) {
        maxNum = maxExpanses;
    } else {
        maxNum = Math.floor(Math.max(...balanceArr));
    }

    const chartDynamics = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                    position: 'right',
                    max: maxNum,
                    ticks: {
                        font: {
                            weight: '500',
                        },
                        callback: (value, index, ticks) => 
                            index > 0 && index < ticks.length -1
                            ? ''
                            : Math[index ? 'max' : 'min'](...ticks.map(n => n.value )),
                    }
                },
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: {
                        font: { 
                            weight: '700',
                        },
                    }
                },
            },
            plugins: {
                legend: { display: false }
            },
        },
        plugins: [
            {
                beforeDraw(chart, args, options) {
                    const {ctx, chartArea: { left, top, width, height }} = chart;
                    ctx.save();
                    ctx.strokeStyle = options.borderColor;
                    ctx.lineWidth = 1;
                    ctx.setLineDash(options.borderDash || []);
                    ctx.lineDashOffset = options.borderDashOffset;
                    ctx.strokeRect(left, top, width, height);
                    ctx.restore();
                },
            },
        ],
    });

    ctx.parentNode.classList.add('chart-container');

    return chartDynamics;
}
