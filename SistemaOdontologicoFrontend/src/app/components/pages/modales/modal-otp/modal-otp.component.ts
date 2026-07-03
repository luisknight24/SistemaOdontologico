import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-modal-otp',
  templateUrl: './modal-otp.component.html',
  styleUrls: ['./modal-otp.component.css']
})
export class ModalOtpComponent implements OnInit {
  formOtp: FormGroup;
  loading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _usuarioServicio: UsuarioService
  ) {
    this.formOtp = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {}

  verificarOTP() {
    if (this.formOtp.invalid) return;
    this.loading = true;
    const codigo = this.formOtp.value.codigo;
    this._usuarioServicio.ValidarOTP(this.data.correo, codigo).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.estado && resp.valor) {
          this._snackBar.open("Cuenta creada y activada exitosamente", "Exito", { duration: 3000 });
          this.dialogRef.close('activado');
        } else {
          this._snackBar.open("El código es incorrecto o ha expirado", "Error", { duration: 3000 });
        }
      },
      error: () => {
        this.loading = false;
        this._snackBar.open("Error al validar el código", "Error", { duration: 3000 });
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
