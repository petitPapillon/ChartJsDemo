class ChartComponent {

    values;
    labels;
    colors = {
        borderColor: ["rgba(91, 192, 222, 1)", "rgba(76, 174, 76, 1)", "rgba(212, 63, 58, 1)", "rgba(238, 162, 54, 1)"],
        backgroundColor: ["rgba(91, 192, 222, 0.5)", "rgba(76, 174, 76, 0.5)", "rgba(212, 63, 58, 0.5)", "rgba(238, 162, 54, 0.5)"]
    };
    dataset;
    data;
    ctx;
    donut;
    valueParameter

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
            type: 'pie',
            data: this.dataset,
            options: {
                maintainAspectRatio: false
            }
        });
    }

    createPieDataset() {
        this.dataset = {};
        this.dataset['labels'] = this.labels;
        this.dataset['datasets'] = [{
            data: this.values,
            label: 'Coins percentage',
            backgroundColor: this.colors['backgroundColor'],
            borderColor: this.colors['borderColor'],
            borderWidth: 1
        }];
    }
}

export default ChartComponent;