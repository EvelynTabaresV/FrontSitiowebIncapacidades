import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import {InvoiceCountService} from './invoice-count.service'; 
import { ReportListService } from './report-list.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  countInvoice: any[] = [];
  single = this.countInvoice;
  bubbleData: any[] = [];
  circle_chart_data: any[] = [];

  view: [number, number] = [900, 400]; 
  // gradient: boolean = false;
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#8ee486', '#b3a4f3', '#d893a3', '#AAAAAA']
  };
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  /**
   * Vertical bar chart
   */
  multi: any[] | undefined;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Tipo de incapacidad';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Cantidad de incapacidades';
  legendTitle: string = 'Años';

  /**
   * Points bar chart
   */
 
  xAxisLabelYear: string = 'Mes';
  maxRadius: number = 10;
  minRadius: number = 1;
  yScaleMin: number = 1;
  yScaleMax: number = 10;

  /**
   * Color scheme for the status of the reports
   */
  viewCircle: [number, number] = [900, 300]; 

  colorSchemeStatus: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal, 
    domain: ['#ebc474', '#6fcaea', '#8ee486', '#d893a3' ]
  };


 
  public userRole: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _invoiceCountService: InvoiceCountService,
    private _reportListService: ReportListService,
    private router: Router,
    private location: Location

  ) {
    
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      if (user) {
        this.userRole = user.charge;
      }
      else {
        this.userRole = 'no-role';
      }
    }
  }

  ngOnInit(): void {
    this._invoiceCountService.getCount().subscribe(data => {
      this.countInvoice = [
        {
          name: 'Pagadas',
          value: data.paid_count
        },
        {
          name: 'Cobradas',
          value: data.charged_count
        },
        {
          name: 'Rechazadas',
          value: data.rejected_count
        }
      ];
      this.single = this.countInvoice;
      this.multi = data.disability_counts;
      this.bubbleData =data.disability_counts_month;
    });

    this._reportListService.listAllReport().subscribe((data: any) => {
      this.circle_chart_data = data.data;
    });

  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}