import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarPacienteComponent } from './modal-eliminar-paciente.component';

describe('ModalEliminarPacienteComponent', () => {
  let component: ModalEliminarPacienteComponent;
  let fixture: ComponentFixture<ModalEliminarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEliminarPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
