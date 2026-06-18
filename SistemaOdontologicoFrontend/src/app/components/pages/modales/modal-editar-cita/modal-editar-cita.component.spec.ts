import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarCitaComponent } from './modal-editar-cita.component';

describe('ModalEditarCitaComponent', () => {
  let component: ModalEditarCitaComponent;
  let fixture: ComponentFixture<ModalEditarCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditarCitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
