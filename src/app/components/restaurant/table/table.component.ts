import { webSocket } from 'rxjs/webSocket';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, take } from 'rxjs';
import { ITable } from 'src/app/model/tableModel';
import { WaitersService } from 'src/app/services/waiters.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderMenuComponent } from '../order-menu/order-menu.component';
import { OrderTableComponent } from '../order-table/order-table.component';
import { WebSocketService } from 'src/app/services/webSocket.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() tableData!: ITable;

  @Input() tableNumber!: number

  protected clientsNumber: number = 0;


  private clientSubscription: Subscription | undefined;

  setClients(){
    if(this.clientsNumber == this.tableData.clients || this.clientsNumber == 0) return;

    this.waitersService.addClient({
      number: this.tableData.number,
      clients: this.clientsNumber
    }).pipe(
      take(1)
    ).subscribe(() => {
      this.waitersService.readTable(this.tableNumber).subscribe((table) => {
        console.log(table)
        this.tableData = table;
        this.webSocketService.notifySetClients();
        this.cdr.detectChanges();
      })
    });
  }

  updateClient(flag: boolean){
    this.clientsNumber += flag? 1:-1;
  }

  constructor(
    protected readonly router: Router,
    private waitersService: WaitersService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private webSocketService: WebSocketService
  ) {
    // Constructor logic (if needed)
    
  }
  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
  ngOnInit(): void {
    this.webSocketService.connect();
    if(!isNaN(this.tableData.clients)) this.clientsNumber = this.tableData.clients;
  }

  openOrderMenuDialog(): void {
    this.dialog.open(OrderMenuComponent, {
      width: '90%',  
      height: '90vh',
      data: { 
        tableNumber: this.tableData.number, 
        tableClients: this.tableData.clients, 
      }
    });
  }

  openOrders(): void { 
    this.dialog.open(OrderTableComponent, {
      width: '90%',  
      height: '90vh',
      data: { 
        tableNumber: this.tableData.number
      }
    })
  }
}
