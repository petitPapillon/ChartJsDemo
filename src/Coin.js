import CoinApi from './CoinApi';

class Coin {
    name;
    percentage;
    status;
    goal;
    goalperc;
    coinApi;


    constructor(name, percentage, goal, goalperc, status, coinApi) {
        this.status = status;
        this.goal = goal;
        this.goalperc = goalperc;
        this.percentage = percentage;
        this.name = name;
        this.coinApi = coinApi;
    }

    increase(increment) {
        this.goal += increment;
        return this.coinApi.updateCoinGoal(this.name, this.goal);
    }

    decrease(decrement) {
        if (this.goal - decrement >= 0) {
            this.goal -= decrement;
        }
        else {
            this.goal = 0;
        }
        return this.coinApi.updateCoinGoal(this.name, this.goal);
    }

    enable() {
        return this.coinApi.enableCoin(this.name);
    }

    disable() {
        return this.coinApi.disableCoin(this.name);
    }

    generateActiveTemplate() {
        return `<tr id="${this.name}"><td>${this.name}</td>
                <td><a href="#" class="btn btn-primary btn-xs btn-status">Disable</a></td>
                <td>
                    <input class="form-control input-sm goal" type="number" value="${this.goal}" />
                </td>
                <td><a href="#" class="btn btn-success btn-xs btn-increase">Increase</a></td>
                <td><a href="#" class="btn btn-primary btn-xs btn-decrease">Decrease</a></td></tr>`;
    }

    generateInactiveTemplate() {
        return `<tr id="${this.name}"><td>${this.name}</td>
                <td><a href="#" class="btn btn-success btn-xs btn-status">Enable</a></td>`;
    }
}

export default Coin;