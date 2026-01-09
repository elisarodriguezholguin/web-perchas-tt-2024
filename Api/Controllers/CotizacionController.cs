using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoTesisApi.DTOs;
using ProyectoTesisApi.Entities;
using ProyectoTesisApi.Services;

namespace ProyectoTesisApi.Controllers
{

    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/Cotizacion")]
    public class CotizacionController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly UserManager<User> userManager;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly string IdUser;
        public CotizacionController(ApplicationDbContext context, UserManager<User> userManager, IHttpContextAccessor httpContextAccessor)
        {
            this.context = context;
            this.userManager = userManager;
            this.httpContextAccessor = httpContextAccessor;
            this.IdUser = Task.Run(async () => (await userManager.FindByEmailAsync(httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type.Contains("email", StringComparison.CurrentCultureIgnoreCase))?.Value ?? "")).Id ?? "Desconocido").Result;
        }
        


        [HttpGet]
        public async Task<ActionResult> GetCotizaciones()
        {
            var rolAdmin = await context.Roles.FirstOrDefaultAsync(x => x.Nombre == "Administrador");
            var usuario = await userManager.FindByIdAsync(IdUser);

            var cotizaciones = await context.Cotizaciones
             .Include(c => c.User)
             .ThenInclude(u => u.Rol)
             .Include(c => c.AreaComercial)
             .Include(c => c.DetalleCotizacion)
             .ThenInclude(d => d.TexturaPercha)
             .Include(c => c.DetalleCotizacion)
             .ThenInclude(d => d.TipoPercha)
             .Where(x => x.Active)
             .ToListAsync();


            var cotizacionDTOs = new List<CotizacionDTO>();
            if (usuario.IdRol == rolAdmin.Id)
            {

                cotizacionDTOs = cotizaciones.Select(c => new CotizacionDTO
                {
                    IdCotizacion = c.IdCotizacion,
                    NameUser = $"{c.User.FirstName} {c.User.LastName}",
                    NameRol = c.User.Rol.Nombre,
                    FechaCotizacion = c.FechaCotizacion,
                    AreaTotal = c.AreaTotal,
                    NameAreaComercial = c.AreaComercial.Nombre,
                    Subtotal = c.Subtotal,
                    IVA = c.IVA,
                    Total = c.Total,
                    ImageBase64 = c.ImageBase64,
                    Detalles = c.DetalleCotizacion.Select(d => new DetalleCotizacionDTO
                    {
                        IdDetalleCotizacion = d.IdDetalleCotizacion,
                        TexturaPercha = new Items
                        {
                            Id = d.TexturaPercha.IdTexturaPercha,
                            Nombre = d.TexturaPercha.Nombre,
                            Url = d.TexturaPercha.Url,
                            Precio = d.TexturaPercha.Precio,
                            FactorPrecio = 0 // Asumiendo que no hay FactorPrecio para TexturaPercha, o ajusta según sea necesario
                        },
                        TipoPercha = new Items
                        {
                            Id = d.TipoPercha.IdTipoPercha,
                            Nombre = d.TipoPercha.Nombre,
                            Url = string.Empty, // Asumiendo que TipoPercha no tiene URL, ajusta según sea necesario
                            Precio = 0, // Asumiendo que no hay Precio para TipoPercha, ajusta según sea necesario
                            FactorPrecio = d.TipoPercha.FactorPrecio
                        },
                        Metros = d.Metros,
                        Divisiones = d.Divisiones
                    }).ToList()
                }).ToList();
            }
            else
            {

                cotizacionDTOs = cotizaciones.Where(x => x.IdUser == usuario.Id).Select(c => new CotizacionDTO
                {
                    IdCotizacion = c.IdCotizacion,
                    NameUser = $"{c.User.FirstName} {c.User.LastName}",
                    NameRol = c.User.Rol.Nombre,
                    FechaCotizacion = c.FechaCotizacion,
                    AreaTotal = c.AreaTotal,
                    NameAreaComercial = c.AreaComercial.Nombre,
                    Subtotal = c.Subtotal,
                    IVA = c.IVA,
                    Total = c.Total,
                    ImageBase64 = c.ImageBase64,
                    Detalles = c.DetalleCotizacion.Select(d => new DetalleCotizacionDTO
                    {
                        IdDetalleCotizacion = d.IdDetalleCotizacion,
                        TexturaPercha = new Items
                        {
                            Id = d.TexturaPercha.IdTexturaPercha,
                            Nombre = d.TexturaPercha.Nombre,
                            Url = d.TexturaPercha.Url,
                            Precio = d.TexturaPercha.Precio,
                            FactorPrecio = 0 // Asumiendo que no hay FactorPrecio para TexturaPercha, o ajusta según sea necesario
                        },
                        TipoPercha = new Items
                        {
                            Id = d.TipoPercha.IdTipoPercha,
                            Nombre = d.TipoPercha.Nombre,
                            Url = string.Empty, // Asumiendo que TipoPercha no tiene URL, ajusta según sea necesario
                            Precio = 0, // Asumiendo que no hay Precio para TipoPercha, ajusta según sea necesario
                            FactorPrecio = d.TipoPercha.FactorPrecio
                        },
                        Metros = d.Metros,
                        Divisiones = d.Divisiones
                    }).ToList()
                }).ToList();
            }
            return Ok(cotizacionDTOs);
        }


        [HttpPost]
        public async Task<ActionResult> PostCotizacion([FromBody] CotizacionRequest cotizacionRequest)
        {
            Console.WriteLine( "base64 : " + cotizacionRequest.ImageBase64.Length);
            var nuevaCotizacion = new Cotizacion
            {
                IdUser = IdUser,
                FechaCotizacion = DateTime.Now,
                AreaTotal = cotizacionRequest.AreaTotal,
                IdAreaComercial = cotizacionRequest.IdAreaComercial,
                Subtotal = cotizacionRequest.Subtotal,
                IVA = cotizacionRequest.IVA,
                Total = cotizacionRequest.Total,
                ImageBase64 = cotizacionRequest.ImageBase64,
                DetalleCotizacion = cotizacionRequest.Detalles.Select(d => new DetalleCotizacion
                {
                    IdTexturaPercha = d.IdTexturaPercha,
                    IdTipoPercha = d.IdTipoPercha,
                    Metros = d.Metros,
                    Divisiones = d.Divisiones
                }).ToList()
            };

            // Agregar la nueva cotización al contexto de base de datos
            await context.Cotizaciones.AddAsync(nuevaCotizacion);
            await context.SaveChangesAsync();

            return Ok("Cotización creada correctamente");

        }
    }
}
