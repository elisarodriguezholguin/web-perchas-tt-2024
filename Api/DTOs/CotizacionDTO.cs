using ProyectoTesisApi.Entities;

namespace ProyectoTesisApi.DTOs
{
    public class CotizacionDTO
    {
        public long IdCotizacion { get; set; }
        public string NameUser { get; set; }
        public string NameRol { get; set; }
        public DateTime FechaCotizacion { get; set; }
        public int AreaTotal { get; set; }
        public string NameAreaComercial { get; set; }
        public decimal Subtotal { get; set; }
        public decimal IVA { get; set; }
        public decimal Total { get; set; }
        public List<DetalleCotizacionDTO> Detalles { get; set; }
        public string ImageBase64 { get; set; }
    }

    public class DetalleCotizacionDTO
    {
        public long IdDetalleCotizacion { get; set; }
        public Items TexturaPercha { get; set; }
        public Items TipoPercha { get; set; }
        public decimal Metros { get; set; }
        public int Divisiones { get; set; }
    }


    public class CotizacionRequest
    {
        public int AreaTotal { get; set; }
        public long IdAreaComercial { get; set; }
        public decimal Subtotal { get; set; }
        public decimal IVA { get; set; }
        public decimal Total { get; set; }
        public List<DetalleCotizacionRequest> Detalles { get; set; }
         public string ImageBase64 { get; set; }
    }

    public class DetalleCotizacionRequest
    {
        public long IdTexturaPercha { get; set; }
        public long IdTipoPercha { get; set; }
        public decimal Metros { get; set; }
        public int Divisiones { get; set; }
    }
}
