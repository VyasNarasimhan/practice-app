import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySongModalComponent } from './modify-song-modal.component';

describe('ModifySongModalComponent', () => {
  let component: ModifySongModalComponent;
  let fixture: ComponentFixture<ModifySongModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifySongModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifySongModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
