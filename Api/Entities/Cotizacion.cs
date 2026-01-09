using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProyectoTesisApi.Entities
{
    [Table("Cotizacion", Schema = "DBO")]
    public class Cotizacion : CRUDEntities
    {
        [Key]
        public long IdCotizacion { get; set; }
        [ForeignKey(nameof(User))]
        public string IdUser { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; }
        [Required]
        public DateTime FechaCotizacion { get; set; }
        public int AreaTotal { get; set; }
        [ForeignKey(nameof(AreaComercial))]
        public long IdAreaComercial { get; set; }
        [JsonIgnore]
        public virtual AreaComercial AreaComercial { get; set; }
        [Required]
        public decimal Subtotal { get; set; }
        [Required]
        public decimal IVA { get; set; }
        [Required]
        public decimal Total { get; set; }
        [JsonIgnore]
        public virtual ICollection<DetalleCotizacion> DetalleCotizacion { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string ImageBase64 { get; set; }

    }
}
