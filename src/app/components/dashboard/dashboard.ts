import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboardservice';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);
  private cryptoService = inject(CryptoService);
  private cdr = inject(ChangeDetectorRef);

  dashboard: any = {};

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {

    const clientAES = localStorage.getItem('clientAES') || '';


    this.dashboardService.getSummary().subscribe({

      next: (res: any) => {

        if (res.status) {

          this.dashboard = {

            DistrictCount: Number(this.cryptoService.decryptAES(res.data.districtCount, clientAES)),
            BlockCount: Number(this.cryptoService.decryptAES(res.data.blockCount, clientAES)),
            PanchayatCount: Number(this.cryptoService.decryptAES(res.data.panchayatCount, clientAES)),
            AwayabCount: Number(this.cryptoService.decryptAES(res.data.awayabCount, clientAES)),
            DepartmentCount: Number(this.cryptoService.decryptAES(res.data.departmentCount, clientAES)),
            SchemeCount: Number(this.cryptoService.decryptAES(res.data.schemeCount, clientAES))

          };
          console.log(this.dashboard);
          this.cdr.detectChanges();

        }

      }

    });

  }

}