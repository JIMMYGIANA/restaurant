import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishCrudComponent } from './dish-crud.component';

describe('DishCrudComponent', () => {
  let component: DishCrudComponent;
  let fixture: ComponentFixture<DishCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DishCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
