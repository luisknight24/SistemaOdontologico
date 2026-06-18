import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerUsuarioComponent } from './modal-ver-usuario.component';

describe('ModalVerUsuarioComponent', () => {
  let component: ModalVerUsuarioComponent;
  let fixture: ComponentFixture<ModalVerUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
