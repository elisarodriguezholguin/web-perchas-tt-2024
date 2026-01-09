using ProyectoTesisApi.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProyectoTesisApi.DTOs.SecurityDTOs
{
    public class UserLoginInfo
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class RegisterInfo : UserLoginInfo
    {
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Direccion { get; set; }

        public string Telefono { get; set; }

        public string Cedula { get; set; }


    }

    public class RolDTO
    {
        public string IdRol { get; set; }

        public string Nombre { get; set; }

        public string Descripcion { get; set; }

    }
}