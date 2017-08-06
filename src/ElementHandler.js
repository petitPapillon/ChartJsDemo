import Coin from './Coin';
import ChartComponent from './ChartComponent';

class ElementHandler {
    $body;
    $activeCoins;
    $inactiveCoins;
    $inactiveCoinsDropdown;
    api;
    coins;
    step;
    coinsArray;
    goalChart;
    goalChartCtx;
    borderColor =  ["rgb(91, 192, 222)", "#FF8247", "#DFFFA5", "#CDAF95", "#FFFF7E",
        "rgba(46, 65, 114, 0.5)", "rgba(5, 155, 134, 0.5)", "rgba(111, 14, 165, 0.5)"];
    constructor(api) {
        this.$body = $('body');
        this.$activeCoins = $('#active-coins-container');
        this.$inactiveCoins = $('#inactive-coins-container');
        this.$inactiveCoinsDropdown = $('#inactive-coins-dropdown');
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
            this.goalChartCtx = document.getElementById('goalChart').getContext('2d');
            this.goalChart = new ChartComponent([], this.goalChartCtx, 'goal');
            this.updateCoins();
            this.changeCoinStatus();
            this.decreaseGoal();
            this.increaseGoal();
        });
    }

    updateCoins() {
        this.coinsArray = [];
        this.$activeCoins.html("");
        this.$inactiveCoinsDropdown.html("");
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
            response.portfolio.forEach((coin, index) => {
                let newCoin = new Coin(coin['coin'], coin['perc'], coin['goal'], coin['goalperc'], 'active', this.api);
                this.addActiveCoin(newCoin, index);
                this.coins[coin['coin']] = newCoin;
                this.coinsArray.push(newCoin);
            });
            this.goalChart.update(this.coinsArray);
        });
    }

    addInactiveCoin(coin) {
        let coinTemplateOption = coin.generateInactiveOptionTemplate();
        this.$inactiveCoinsDropdown.append($(coinTemplateOption));
    }

    addActiveCoin(coin, index) {
        let coinTemplate = coin.generateActiveTemplate(this.borderColor[index] || '#fff', index);
        this.$activeCoins.append($(coinTemplate));
    }

    changeCoinStatus() {
        this.$body.on('click', '.btn-status', (e) => {
            e.preventDefault();
            let parent = $(e.target).closest('li');
            if ($(e.target).closest('li').length == 0) {
                parent = $(e.target).closest('tr');
            }
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