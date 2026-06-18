import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarUsuarioComponent } from './modal-eliminar-usuario.component';

describe('ModalEliminarUsuarioComponent', () => {
  let component: ModalEliminarUsuarioComponent;
  let fixture: ComponentFixture<ModalEliminarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEliminarUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
