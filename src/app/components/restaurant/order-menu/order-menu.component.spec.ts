import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMenuComponent } from './order-menu.component';

describe('OrderMenuComponent', () => {
  let component: OrderMenuComponent;
  let fixture: ComponentFixture<OrderMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderMenuComponent]
    });
    fixture = TestBed.createComponent(OrderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
