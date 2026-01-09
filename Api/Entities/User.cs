using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProyectoTesisApi.Entities
{
    [Table("Users", Schema = "SEG")]
    public class User : IdentityUser
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public bool Bloqueo { get; set; }
        [Required]
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Cedula { get; set; }
        [ForeignKey(nameof(Rol))]
        public long IdRol { get; set; }
        [JsonIgnore]
        public virtual Rol Rol { get; set; }
        [JsonIgnore]
        public virtual ICollection<Cotizacion> Cotizacion { get; set; }
    }
}