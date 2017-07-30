import CoinApi from './CoinApi';

class Coin {
    name;
    percentage;
    status;
    goalperc;
    coinApi;

    constructor(name, percentage, goalperc, status) {
        this.status = status;
        this.goalperc = goalperc;
        this.percentage = percentage;
        this.name = name;
        this.coinApi = new CoinApi();
    }

    increase(increment) {
        this.goalperc += increment;
        this.coinApi.updateCoinGoal(this.name, increment).then((response) => {
            console.log(response);
        });
    }

    decrease(decrement) {
        if (this.goalperc - decrement >= 0) {
            this.goalperc -= decrement;
        }
        else {
            this.goalperc = 0;
        }
        this.coinApi.updateCoinGoal(this.name, decrement, (response) => {
            console.log(response);
        });
    }

}

export default Coin;