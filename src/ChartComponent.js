class ChartComponent {

    values;
    labels;
    colors = {
        borderColor: ["#4e5d6c", "#4e5d6c", "#4e5d6c", "#4e5d6c", "#4e5d6c", "#4e5d6c", "#4e5d6c", "#4e5d6c"],
        backgroundColor: ["#ED5191", "#CEE85D", "#59D3A5", "#F7BF41", "#F26666", "#53DAF9", "#FF8247", "#FFFF7E"]
    };

    //,
    dataset;
    data;
    ctx;
    donut;
    valueParameter;

    constructor(data, ctx, valueParameter) {
        this.ctx = ctx;
        this.dataset = {};
        this.dataset['labels'] = [];
        this.dataset['datasets'] = [];
        this.valueParameter = valueParameter;
        this.donut = this.createDonut();
        this.update(data);
    }

    update(data) {
        this.data = data;
        this.updateChartLabels();
        this.updateChartValues();
        this.createPieDataset();
        this.donut.data.datasets = this.dataset['datasets'];
        this.donut.data.labels = this.dataset['labels'];
        this.donut.update();
    }

    updateChartValues() {
        this.values = [];
        this.data.forEach((d) => {
            this.values.push(parseFloat(d[this.valueParameter]).toFixed(2));
        });
    }

    updateChartLabels() {
        this.labels = [];
        this.data.forEach((d) => {
            this.labels.push(d['name']);
        });
    }

    createDonut() {
        return new Chart(this.ctx, {
            type: 'doughnut',
            data: this.dataset,
            options: {
                maintainAspectRatio: false,
                legend: false,
                title: {
                   // display: true,
                   //  text: 'Goal Data',
                   //  fontStyle: 'normal',
                   //  fontFamily: 'Roboto Thin, sans-serif',
                   //  fontSize: 35,
                   //  fontColor: "#fff"
                }
            }
        });
    }

    createPieDataset() {
        this.dataset = {};
        this.dataset['labels'] = this.labels;
        this.dataset['datasets'] = [{
            data: this.values,
            label: 'Goal Percentage',
            backgroundColor: this.colors['backgroundColor'],
            borderColor: this.colors['borderColor'],
            borderWidth: 0.3
        },
            {
                data: this.values,
                label: 'Real percentage',
                backgroundColor: this.colors['backgroundColor'],
                borderColor: this.colors['borderColor'],
                borderWidth: 0.3
            }];
    }
}

export default ChartComponent;