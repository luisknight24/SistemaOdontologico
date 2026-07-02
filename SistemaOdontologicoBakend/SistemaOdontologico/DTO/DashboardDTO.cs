using System.Collections.Generic;

namespace SistemaOdontologico.DTO
{
    public class DashboardDTO
    {
        public int TotalPacientes { get; set; }
        public int TotalOdontologos { get; set; }
        public int TotalCitas { get; set; }
        public string TotalIngresos { get; set; }
        public List<CitasPorMesDTO> GraficoCitas { get; set; }
    }

    public class CitasPorMesDTO
    {
        public string Mes { get; set; }
        public int Cantidad { get; set; }
    }
}
