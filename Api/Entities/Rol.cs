using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProyectoTesisApi.Entities
{
    [Table("Rol", Schema = "SEG")]
    public class Rol
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public string Nombre { get; set; }
        [Required]
        public string Descripcion { get; set; }
        [JsonIgnore]
        public virtual ICollection<User> User { get; set; }
    }
}
