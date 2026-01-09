namespace ProyectoTesisApi.DTOs.SecurityDTOs
{
    public class AuthenticationResponse
    {
        public string Token { get; set; }
        public DateTime Expiracion { get; set; }
        public string UserName { get; set; }
        public string RolName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Direccion { get; set; }
        public string Cedula { get; set; }
        public string Telefono { get; set; }
    }
}