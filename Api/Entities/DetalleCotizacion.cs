using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProyectoTesisApi.Entities
{
    [Table("DetalleCotizacion", Schema = "DBO")]
    public class DetalleCotizacion
    {
        [Key]
        public long IdDetalleCotizacion { get; set; }
        [ForeignKey(nameof(Cotizacion))]
        public long IdCotizacion { get; set; }
        [JsonIgnore]
        public virtual Cotizacion Cotizacion { get; set; }
        [ForeignKey(nameof(TexturaPercha))]
        public long IdTexturaPercha { get; set; }
        [JsonIgnore]
        public virtual TexturaPercha TexturaPercha { get; set; }
        [ForeignKey(nameof(TipoPercha))]
        public long IdTipoPercha { get; set; }
        [JsonIgnore]
        public virtual TipoPercha TipoPercha { get; set; }
        [Required]
        public decimal Metros { get; set; }
        [Required]
        public int Divisiones { get; set; }
    }
}
