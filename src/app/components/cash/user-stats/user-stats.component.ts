import { UserRole } from './../../../model/userModel';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of, tap } from 'rxjs';
import { IReceipt } from 'src/app/model/receiptModel';
import { CashierService } from 'src/app/services/cashier.service';
import { IOrder } from 'src/app/model/orderModel';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { WaitersService } from 'src/app/services/waiters.service';
import { WebSocketService } from 'src/app/services/webSocket.service';
import { IOrderStatistics } from 'src/app/model/statisticsModels/orderStatisticsModel';


@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.css'
})
export class UserStatsComponent {

  UserRole = UserRole;

  protected readonly userStats$: Observable<IOrderStatistics[]>;

  protected readonly waiterStats$?: Observable<IOrderStatistics[]>;

  protected readonly userRole$: Observable<UserRole>;
  protected readonly userEmail$: Observable<string>;

  constructor(
    private dialogRef: MatDialogRef<UserStatsComponent>,
    private cashierService: CashierService,
    @Inject(MAT_DIALOG_DATA) public data: { userEmail: string, userRole: UserRole }
  ) {
    this.userRole$ = of(data.userRole);
    this.userEmail$ = of(data.userEmail);

    switch(data.userRole){
      case(UserRole.Waiters): 
        this.userStats$ = this.cashierService.readCreationStats(data.userEmail);
        this.waiterStats$ = this.cashierService.readServeStats(data.userEmail);
        break;
      case(UserRole.Bartenders): 
        this.userStats$ = this.cashierService.readPreparationDrinkStats(data.userEmail);
        break;
      case(UserRole.Cook): 
        this.userStats$ = this.cashierService.readPreparationCookStats(data.userEmail);
        break;
      default:
        throw new Error();
    }

  }
}
