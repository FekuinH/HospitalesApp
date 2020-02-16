import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-graficodona',
  templateUrl: './graficoDona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

   @Input() doughnutChartLabels: Label[] = [];
   @Input() doughnutChartData: MultiDataSet[] = [];
   @Input() doughnutChartType: ChartType = 'doughnut';

  constructor() { }

  ngOnInit() {
  }

}
