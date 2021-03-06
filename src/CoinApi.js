import $ from 'jquery';

class CoinApi {

    BASE_URL;
    USERPASS;
    REQUEST_TYPE;
    METHOD;


    constructor() {
        this.BASE_URL = 'http://127.0.0.1:7779';
        this.REQUEST_TYPE = {
            GET: 'GET',
            POST: 'POST'
        };
        this.METHOD = {PORTFOLIO: 'portfolio', GET_COINS: 'getcoins', ENABLE_COIN: 'enable', DISABLE_COIN: 'disable', GOAL: 'goal'};
    }

    request(type, data) {

        if (localStorage['userpass']) {
            data.userpass = localStorage['userpass'];
        }

        return $.ajax({
            type: type,
            url: this.BASE_URL,
            data: JSON.stringify(data),
            dataType: 'json',
        }).done(response => {});
    }

    getPortfolio() {
        return this.request(this.REQUEST_TYPE.POST, {method: this.METHOD.PORTFOLIO});
    }

    getAllCoins() {
        return this.request(this.REQUEST_TYPE.POST, {method: this.METHOD.GET_COINS});
    }

    enableCoin(coin) {
        return this.request(this.REQUEST_TYPE.POST, {method: this.METHOD.ENABLE_COIN, coin: coin});
    }

    disableCoin(coin) {
        return this.request(this.REQUEST_TYPE.POST, {method: this.METHOD.DISABLE_COIN, coin: coin});
    }

    updateCoinGoal(coin, val) {
        return this.request(this.REQUEST_TYPE.POST, {method: this.METHOD.GOAL, coin: coin, val: val});
    }

    initApi() {
        return this.request(this.REQUEST_TYPE.POST, {method: this.METHOD.GET_COINS});
    }

}

export default CoinApi;