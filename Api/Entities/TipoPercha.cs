using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProyectoTesisApi.Entities
{
    [Table("TipoPercha", Schema = "DBO")]
    public class TipoPercha
    {
        [Key]
        public long IdTipoPercha { get; set; }
        [Required]
        public string Nombre { get; set; }
        [Required]
        public decimal FactorPrecio { get; set; }
        [JsonIgnore]
        public virtual ICollection<DetalleCotizacion> DetalleCotizacion { get; set; }
    }
}
