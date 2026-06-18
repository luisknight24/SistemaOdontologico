import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarOdontologoComponent } from './modal-eliminar-odontologo.component';

describe('ModalEliminarOdontologoComponent', () => {
  let component: ModalEliminarOdontologoComponent;
  let fixture: ComponentFixture<ModalEliminarOdontologoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEliminarOdontologoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarOdontologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
