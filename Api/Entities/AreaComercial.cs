using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProyectoTesisApi.Entities
{
    [Table("AreaComercial", Schema = "DBO")]
    public class AreaComercial
    {
        [Key]
        public long IdAreaComercial { get; set; }
        [Required]
        public string Nombre { get; set; }
        [Required]
        public string Url { get; set; }
        [JsonIgnore]
        public virtual ICollection<Cotizacion> Cotizacion { get; set; }
    }
}
