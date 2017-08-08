import CoinApi from './CoinApi';

class Coin {
    name;
    percentage;
    status;
    goal;
    goalperc;
    coinApi;
    colors;

    constructor(name, percentage, goal, goalperc, status, coinApi) {
        this.status = status;
        this.goal = goal;
        this.goalperc = goalperc;
        this.percentage = percentage;
        this.name = name;
        this.coinApi = coinApi;
        this.colors = ["ED5191", "CEE85D", "59D3A5", "F7BF41", "F26666", "53DAF9", "FF8247", "FFFF7E"];
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

    generateActiveTemplate(color, idx) {
        return `<tr id="${this.name}"><td>
                <span class="coin-${this.colors[idx]} coin-title">${this.name}</span></td>
                <td>
                    <input class="form-control input-sm goal" type="number" value="${this.goal}" />
                </td>
                <td><input type="button" class="btn btn-success btn-xs btn-increase btn-overall" value="Increase"/></td>
                <td><input type="button" href="#" class="btn btn-primary btn-xs btn-decrease btn-overall" value="Decrease"/></td>
                 <td><input type="button" class="btn-disable btn-overall btn-status" value="Disable"/></td></tr>`;


    }

    generateInactiveTemplate() {
        return `<tr id="${this.name}"><td>${this.name}</td>
                <td><a href="#" class="btn btn-success btn-xs btn-status">Enable</a></td>`;
    }

    generateInactiveOptionTemplate() {
        return `<li id="${this.name}">
                    ${this.name}<a href="#" c class="btn-enable btn-overall btn-status">Enable</a>
                </li>`;
    }
}

export default Coin;