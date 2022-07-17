import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadSongsComponent } from './load-songs.component';

describe('LoadSongsComponent', () => {
  let component: LoadSongsComponent;
  let fixture: ComponentFixture<LoadSongsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadSongsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
