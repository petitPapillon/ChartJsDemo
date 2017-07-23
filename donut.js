$(document).ready(function () {
    var ctx = document.getElementById('pieChart').getContext('2d');
    var coinsInfoBox = $('.coins-info');
    var pieChart;
    var updatedCoins = [], disabledCoins = [];
    var coinsMap = {};
    var portfolio = [];
    var madeInitialDataCall = false;
    ctx.canvas.width = 400;
    ctx.canvas.height = 400;
    var helpers;

    function createPieDataset(labels, values) {
        var data = {};
        data['labels'] = labels;
        var colors = helpers.generateColorSets(labels.length);
        var backgroundColor = colors['backgroundColor'];
        var borderColor = colors['backgroundColor'];
        data['datasets'] = [{
            data: values,
            label: 'Coins percentage',
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        }];

        return data;
    }

    var createDonut = function (data, ctx) {
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                layout: {
                    padding: {
                        left: 100,
                        right: 100,
                        top: 100,
                        bottom: 100
                    }
                },
                maintainAspectRatio: false
            }
        });
        return myPieChart;
    };

    function fillCoinData(data) {
        var coinContent = ' <div class="wrap" id="#id">\n' +
            '        <a class="btn btn-small btn-red btn-radius" href="#">-</a>\n' +
            '        <a class="btn btn-small btn-orange btn-radius coin-goal-percentage" href="#">#coinGoalPercentage</a>\n' +
            '        <a class="btn btn-small btn-green btn-radius" href="#">+</a>\n' +
            '        <a class="btn btn-small btn-orange btn-radius btn-status" href="#">Disable</a>\n' +
            '    </div>';
        data.forEach(function (d) {
            var eachCoinContent = coinContent.replace('#coinName', d['coin']);
            var eachCoinContent = eachCoinContent.replace('#id', d['coin']);
            eachCoinContent = eachCoinContent.replace('#coinGoalPercentage', parseFloat(d['goalperc']).toFixed(2));
            coinsInfoBox.append($(eachCoinContent));
            $('.coins').append('<option>' + d['coin'] + '</option>');
        });
        $('.wrap').hide();
    }

    function initChart() {
        getData(function (result) {
            var portfolio = result['portfolio'];
            var labels = helpers.getChartLabels(portfolio);
            var values = helpers.getChartValues(portfolio, false);
            var data = createPieDataset(labels, values);
            pieChart = createDonut(data, ctx);
        });
    }

    function updateChart() {
        getData(function (result) {
            // use the result here after the call is valid
            // var portfolio = result['portfolio'];
            portfolio = _getPortfolioData();
            var values = helpers.getChartValues(portfolio);
            var labels = helpers.getChartLabels(portfolio);
            pieChart.data.datasets[0].data = values;
            pieChart.data.labels = labels;
            pieChart.update();
        });
    }

    //temporary
    function _getPortfolioData() {
        var coinsMapKeys = Object.keys(coinsMap);
        var updatedPortfolio = [];
        coinsMapKeys.forEach(function (key) {
            updatedPortfolio.push(coinsMap[key]);
        });
        return updatedPortfolio;
    }

    function getData(callback) {
        $.get('data.json', function (data) {
            helpers.logActivity('curl --url "http://127.0.0.1:7779" --data "{\\"userpass\\":\\"$userpass\\",\\"method\\":\\"getcoins\\"}"');
            //create a different structure of the data
            if (!madeInitialDataCall) {
                createCoinsMap(data);
                fillCoinData(data['portfolio']);
                madeInitialDataCall = true;
                // fill the coins with data
            }
            callback(data);
        });
    }

    function createCoinsMap(data) {
        var portfolio = data['portfolio'];
        portfolio.forEach(function (d) {
            coinsMap[d['coin']] = d;
        });
    }

    function updateData(coin, value) {
            helpers.logActivity('curl --url "http://127.0.0.1:7779" --data "{\\"userpass\\":\\"$userpass\\",\\"method\\":\\"goal\\",\\"coin\\":\\"' + coin + '\\",\\"val\\":' + value + '}"');
            coinsMap[coin]['goalperc'] = value;
            updatedCoins.push(coin);
            updateChart();
    }

    function enableCoin(coin) {
        helpers.logActivity('curl --url "http://127.0.0.1:7779" --data "{\\"userpass\\":\\"$userpass\\",\\"method\\":\\"enable\\",\\"coin\\":\\"' + coin + '\\"}"\n');
        disabledCoins = disabledCoins.filter(function (t) {
            return t != coin;
        });
        updateChart();
    }

    function disableCoin(coin) {
        helpers.logActivity('curl --url "http://127.0.0.1:7779" --data "{\\"userpass\\":\\"$userpass\\",\\"method\\":\\"disable\\",\\"coin\\":\\"' + coin + '\\"}"');
        disabledCoins.push(coin);
        updateChart();
    }

    function helper() {
        function logActivity(activity) {
            $('.logger').append('<p>' + activity + '</p>');
        }

        function getChartLabels(data) {
            var labels = [];
            data.forEach(function (d) {
                if (disabledCoins.indexOf(d['coin']) == -1) {
                    labels.push(d['coin']);
                }
            });
            return labels;
        }

        function getChartValues(data) {
            var values = [];
            data.forEach(function (d) {
                if (disabledCoins.indexOf(d['coin']) == -1) {
                    if (updatedCoins.indexOf(d['coin']) != -1) {
                        values.push(parseFloat(d['goalperc']).toFixed(2));
                    }
                    else {
                        values.push(d['perc']);
                    }
                }
            });
            return values;
        }

        function generateColorSets(size) {
            var results = {
                backgroundColor: [],
                borderColor: []
            };
            for (var i = 0; i < size; i++) {
                var background = randomColor({
                    luminosity: 'dark',
                    format: 'rgba',
                    alpha: 0.2
                });
                results['backgroundColor'].push(background);
                results['borderColor'].push(background.replace('0.2', 1));
            }
            return results;
        }

        return {
            logActivity: logActivity,
            getChartLabels: getChartLabels,
            getChartValues: getChartValues,
            generateColorSets: generateColorSets
        }
    }

    function elementEvents() {

        (function changeCoinStatus() {
            $('body').on('click', '.btn-status', function (e) {
                e.preventDefault();
                var coinId = $(this).parent().attr('id');
                var goalPercentageElement = $(this).parent().children(':nth-child(4)');
                var text = goalPercentageElement.text() == 'Disable' ? 'Enable' : 'Disable';
                goalPercentageElement.text(text);
                if (text == 'Disable') {
                    enableCoin(coinId);
                }
                else {
                    disableCoin(coinId);
                }
            });
        })();

        (function increaseNumber() {
            $('body').on('click', '.btn-green', function (e) {
                e.preventDefault();
                var coinId = $(this).parent().attr('id');
                var goalPercentageElement = $(this).parent().children(':nth-child(2)');
                var newVal = parseFloat(goalPercentageElement.text()) + 0.1;
                goalPercentageElement.text(newVal.toFixed(2));
                updateData(coinId, newVal.toFixed(2));
            });
        })();

        (function decreaseNumber() {
            $('body').on('click', '.btn-red', function (e) {
                e.preventDefault();
                var coinId = $(this).parent().attr('id');
                var goalPercentageElement = $(this).parent().children(':nth-child(2)');
                var newVal = parseFloat(goalPercentageElement.text()) - 0.1;
                if (newVal >= 0) {
                    goalPercentageElement.text(newVal.toFixed(2));
                    updateData(coinId, newVal.toFixed(2));
                }
            });
        })();


        (function onCoinChanged() {
            $('.coins').change(function (d) {
                var coinToShow = '#' + $(this).val();
                $('.wrap').hide();
                $(coinToShow).show();
            });
        })();
    }

    function init() {
        helpers = helper();
        elementEvents();
        initChart();
    }

    init();


});
