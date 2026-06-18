import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCitaComponent } from './modal-cita.component';

describe('ModalCitaComponent', () => {
  let component: ModalCitaComponent;
  let fixture: ComponentFixture<ModalCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
