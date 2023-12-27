import { UserService } from 'src/app/services/user.service';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ITable } from 'src/app/model/tableModel';
import { WaitersService } from 'src/app/services/waiters.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent {

  protected readonly restaurantName: string = 'Jimmy\'s reastaurant';

  protected readonly tables: Observable<ITable[]> = this.waitersService.readTables();

 
  protected logout(){
    this.userService.logout();
    this.router.navigate(['']);
  }

  constructor(
    protected readonly router: Router,
    private userService: UserService,
    private waitersService: WaitersService
    ){
      this.tables.forEach(t => console.log(t));
  }

}



// ...

// private logout() {
//   this.router.navigate(['/altro-endpoint']); // Sostituisci 'altro-endpoint' con l'URL desiderato
// }

