import { DetalleCita } from "./detalle-cita";
export interface Cita {

    id: number,
    numeroDocumento?: string,
    totalTexto?: string,
    estado?: string,
    DetalleCita?:DetalleCita[]

}
