class ChartComponent {

    values;
    labels;
    colors = {
        borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
        backgroundColor: ["rgb(91, 192, 222)", "#FF8247", "#DFFFA5", "#CDAF95", "#FFFF7E",
            "rgba(46, 65, 114, 0.5)", "rgba(5, 155, 134, 0.5)", "rgba(111, 14, 165, 0.5)"]
    };
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
                   display: true,
                    text: 'Real Chart'
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
            borderWidth: 0.5
        },
            {
                data: this.values,
                label: 'Real percentage',
                backgroundColor: this.colors['backgroundColor'],
                borderColor: this.colors['borderColor'],
                borderWidth: 0.5
            }];
    }
}

export default ChartComponent;