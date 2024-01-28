import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDrinkComponent } from './order-drink.component';

describe('OrderDrinkComponent', () => {
  let component: OrderDrinkComponent;
  let fixture: ComponentFixture<OrderDrinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDrinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
