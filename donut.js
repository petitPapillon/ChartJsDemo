class Chart {


    USERPASS = null;

    ctx = document.getElementById('pieChart').getContext('2d');
    coinsInfoBox = $('.coins-info');
    pieChart;
    updatedCoins = [];
    disabledCoins = [];
    coinsMap = {};
    portfolio = [];
    madeInitialDataCall = false;
    helpers;
    colors = {
        borderColor: ["rgba(91, 192, 222, 1)", "rgba(76, 174, 76, 1)", "rgba(212, 63, 58, 1)", "rgba(238, 162, 54, 1)"],
        backgroundColor: ["rgba(91, 192, 222, 0.5)", "rgba(76, 174, 76, 0.5)", "rgba(212, 63, 58, 0.5)", "rgba(238, 162, 54, 0.5)"]
    };

    step = 0.1;

    createPieDataset(labels, values) {
        let data = {};
        data['labels'] = labels;
        let backgroundColor = colors['backgroundColor'];
        let borderColor = colors['borderColor'];
        console.log(borderColor);
        data['datasets'] = [{
            data: values,
            label: 'Coins percentage',
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        }];

        return data;
    }

    createDonut(data, ctx) {
        return new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                maintainAspectRatio: false
            }
        });
    }

    fillCoinData(data) {
        data.forEach((d) => {
            let eachCoinContent = coinContentTemplate.replace('#coinName', d['coin']);
            eachCoinContent = eachCoinContent.replace('#id', d['coin']);
            eachCoinContent = eachCoinContent.replace('#coinGoalPercentage', parseFloat(d['goalperc']).toFixed(2));
            coinsInfoBox.append($(eachCoinContent));
            $('.coins').append('<option>' + d['coin'] + '</option>');
        });
        $('.wrap').hide();
    }

    initChart() {
        getData((result) => {
            let portfolio = result['portfolio'];
            let labels = helpers.getChartLabels(portfolio);
            let values = helpers.getChartValues(portfolio, false);
            let data = createPieDataset(labels, values);
            pieChart = createDonut(data, ctx);
        });
    }

    updateChart() {
        getData((result) => {
            // use the result here after the call is valid
            // let portfolio = result['portfolio'];
            portfolio = _getPortfolioData();
            let values = helpers.getChartValues(portfolio);
            let labels = helpers.getChartLabels(portfolio);
            pieChart.data.datasets[0].data = values;
            pieChart.data.labels = labels;
            pieChart.update();
        });
    }



    init() {
        helpers = helper();
        elementEvents();
        initChart();

        // let host = 'http://127.0.0.1:7779';
        // setInterval(() {
        //     helpers.post(host, { 'method': 'portfolio'});
        // }, 2000);
    }

    init();
}


class Helper {

    static COIN_STATUS = {
        enabled: "enabled",
        disabled: "disabled"
    };

    logActivity(activity) {
        $('.logger').prepend('<p>' + activity + '</p>');
    }

    getChartLabels(data) {
        let labels = [];
        data.forEach((d) => {
            if (disabledCoins.indexOf(d['coin']) === -1) {
                labels.push(d['coin']);
            }
        });
        return labels;
    }

    getChartValues(data) {
        let values = [];
        data.forEach((d) => {
            if (disabledCoins.indexOf(d['coin']) === -1) {
                if (updatedCoins.indexOf(d['coin']) !== -1) {
                    values.push(parseFloat(d['goalperc']).toFixed(2));
                }
                else {
                    values.push(d['perc']);
                }
            }
        });
        return values;
    }
}


class Coin {
    name;
    percentage;
    status;
    goalperc;

    constructor(name, percentage, goalperc, status) {
        this.status = status;
        this.goalperc = goalperc;
        this.percentage = percentage;
        this.name = name;
    }

    increase(increment) {
        this.goalperc += increment;
    }

    decrease(decrement) {
        if (this.goalperc - decrement >= 0) {
            this.goalperc -= decrement;
        }
        else {
            this.goalperc = 0;
        }
    }

    createCoinsMap(data) {
        let portfolio = data['portfolio'];
        portfolio.forEach((d) => {
            coinsMap[d['coin']] = d;
        });
    }

}

class ElementEvents {



}
