import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarServicioComponent } from './modal-eliminar-servicio.component';

describe('ModalEliminarServicioComponent', () => {
  let component: ModalEliminarServicioComponent;
  let fixture: ComponentFixture<ModalEliminarServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEliminarServicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
