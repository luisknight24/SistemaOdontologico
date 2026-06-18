import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOdontologoComponent } from './modal-odontologo.component';

describe('ModalOdontologoComponent', () => {
  let component: ModalOdontologoComponent;
  let fixture: ComponentFixture<ModalOdontologoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOdontologoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOdontologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
