import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerCitaComponent } from './modal-ver-cita.component';

describe('ModalVerCitaComponent', () => {
  let component: ModalVerCitaComponent;
  let fixture: ComponentFixture<ModalVerCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerCitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
