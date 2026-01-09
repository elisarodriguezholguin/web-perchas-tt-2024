using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProyectoTesisApi.Entities
{
    [Table("TexturaPercha", Schema = "DBO")]
    public class TexturaPercha
    {
        [Key]
        public long IdTexturaPercha { get; set; }
        [Required]
        public string Nombre { get; set; }
        [Required]
        public string Url { get; set; }
        [Required]
        public decimal Precio { get; set; }
        [JsonIgnore]
        public virtual ICollection<DetalleCotizacion> DetalleCotizacion { get; set; }
    }
}
