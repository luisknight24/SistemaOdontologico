import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerPacienteComponent } from './modal-ver-paciente.component';

describe('ModalVerPacienteComponent', () => {
  let component: ModalVerPacienteComponent;
  let fixture: ComponentFixture<ModalVerPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
