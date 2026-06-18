import { DetalleCita } from "./detalle-cita";
export interface Cita {

    id: number,
    numeroDocumento?: string,
    totalTexto?: string,
    DetalleCita?:DetalleCita[]

}
