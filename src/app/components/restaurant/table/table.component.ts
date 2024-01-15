import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, take } from 'rxjs';
import { ITable } from 'src/app/model/tableModel';
import { WaitersService } from 'src/app/services/waiters.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderMenuComponent } from '../order-menu/order-menu.component';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() tableData!: ITable;

  protected clientsNumber: number = 0;


  private clientSubscription: Subscription | undefined;

  generateNumbers(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  setClients(){
    if(this.clientsNumber == this.tableData.clients) return;

    this.clientSubscription = this.waitersService.addClient({
      number: this.tableData.number,
      clients: this.clientsNumber
    }).pipe(
      take(1)
    ).subscribe();
  }

  updateClient(flag: boolean){
    this.clientsNumber += flag? 1:-1;
  }

  constructor(
    protected readonly router: Router,
    private waitersService: WaitersService,
    private dialog: MatDialog
  ) {
    // Constructor logic (if needed)
    
  }
  ngOnInit(): void {
    if(!isNaN(this.tableData.clients)) this.clientsNumber = this.tableData.clients;
    
  }

  openOrderMenuDialog(): void {
    this.dialog.open(OrderMenuComponent, {
      width: '90%',  
      height: '90vh',
      data: { 
        tableNumber: this.tableData.number, 
        tableClients: this.tableData.clients 
      }
    });
  }
}
