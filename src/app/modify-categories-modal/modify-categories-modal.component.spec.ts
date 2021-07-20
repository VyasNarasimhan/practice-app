import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCategoriesModalComponent } from './modify-categories-modal.component';

describe('ModifyCategoriesModalComponent', () => {
  let component: ModifyCategoriesModalComponent;
  let fixture: ComponentFixture<ModifyCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
