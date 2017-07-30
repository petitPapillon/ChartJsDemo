import Coin from './Coin';
import ChartComponent from './ChartComponent';

class ElementHandler {
    $body;
    $activeCoins;
    $inactiveCoins;
    api;
    coins;
    step;
    chart;
    coinsArray;
    realChart;
    goalChart;

    constructor(api) {
        this.$body = $('body');
        this.$activeCoins = $('#active-coins-container');
        this.$inactiveCoins = $('#inactive-coins-container');
        this.api = api;
        this.step = 0.5;
        this.coins = new Map();
        this.coinsArray = [];
        this._init();
    }

    _init() {
        this.api.initApi().then((response) => {
            if (response.userpass) {
                localStorage['userpass'] = response.userpass;
            }
            this.goalChart = document.getElementById('pieChart').getContext('2d');
            this.chart = new ChartComponent([], this.goalChart);
            this.updateCoins();
            this.changeCoinStatus();
            this.decreaseGoal();
            this.increaseGoal();
        });
    }

    updateCoins() {
        this.coinsArray = [];
        this.$activeCoins.html("");
        this.$inactiveCoins.html("");
        this.updateInactiveCoins();
        this.updateActiveCoins();
    }

    updateInactiveCoins() {
        this.api.getAllCoins().then(response => {
            response = response['coins'] || response;
            response.filter(coin => coin.status === 'inactive')
                .forEach((coin) => {
                    let newCoin = new Coin(coin['coin'], coin['perc'], coin['goal'], coin['goalperc'], coin['status'], this.api);
                    this.addInactiveCoin(newCoin);
                    this.coins[coin['coin']] = newCoin;
                });
        });
    }

    updateActiveCoins() {
        this.api.getPortfolio().then((response) => {
            response.portfolio.forEach((coin) => {
                let newCoin = new Coin(coin['coin'], coin['perc'], coin['goal'], coin['goalperc'], 'active', this.api);
                this.addActiveCoin(newCoin);
                this.coins[coin['coin']] = newCoin;
                this.coinsArray.push(newCoin);
            });
            this.chart.update(this.coinsArray);
        });
    }

    addInactiveCoin(coin) {
        let coinTemplate = coin.generateInactiveTemplate();
        this.$inactiveCoins.append($(coinTemplate));
    }

    addActiveCoin(coin) {
        let coinTemplate = coin.generateActiveTemplate();
        this.$activeCoins.append($(coinTemplate));
    }

    changeCoinStatus() {
        this.$body.on('click', '.btn-status', (e) => {
            e.preventDefault();
            const parent = $(e.target).closest('tr');
            const coinId = parent.attr('id');
            const coin = this.coins[coinId];
            if (coin.status === 'inactive') {
                this.coins[coinId].enable().then(() => this.updateCoins());
            }
            else {
                this.coins[coinId].disable().then(() => this.updateCoins());
            }
        });
    }

    increaseGoal() {
        this.$body.on('click', '.btn-increase', (e) => {
            e.preventDefault();
            const parent = $(e.target).closest('tr');
            const coinId = parent.attr('id');
            this.coins[coinId].increase(this.step).then(() => this.updateCoins());
        });
    }

    decreaseGoal() {
        this.$body.on('click', '.btn-decrease', (e) => {
            e.preventDefault();
            const parent = $(e.target).closest('tr');
            const coinId = parent.attr('id');
            this.coins[coinId].decrease(this.step).then(() => this.updateCoins());
        });
    }


}

export default ElementHandler;