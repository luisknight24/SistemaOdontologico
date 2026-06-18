import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerServicioComponent } from './modal-ver-servicio.component';

describe('ModalVerServicioComponent', () => {
  let component: ModalVerServicioComponent;
  let fixture: ComponentFixture<ModalVerServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerServicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
