import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerOdontologoComponent } from './modal-ver-odontologo.component';

describe('ModalVerOdontologoComponent', () => {
  let component: ModalVerOdontologoComponent;
  let fixture: ComponentFixture<ModalVerOdontologoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerOdontologoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerOdontologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
