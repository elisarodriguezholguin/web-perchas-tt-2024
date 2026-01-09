using AutoMapper;
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
    [Route("api/Catalogo")]
    public class CatalogoController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly UserManager<User> userManager;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly string IdUser;

        public CatalogoController(ApplicationDbContext context, UserManager<User> userManager, IHttpContextAccessor httpContextAccessor)
        {
            this.context = context;
            this.httpContextAccessor = httpContextAccessor;
            this.userManager = userManager;
            this.IdUser = Task.Run(async () => (await userManager.FindByEmailAsync(httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type.Contains("email", StringComparison.CurrentCultureIgnoreCase))?.Value ?? "")).Id ?? "Desconocido").Result;
        }

        // GET: api/Catalogo
        [HttpGet]
        public async Task<ActionResult> GetCatalogos()
        {
            var areaComerciales = await context.AreaComerciales
                .Select(ac => new Items
                {
                    Id = ac.IdAreaComercial,
                    Nombre = ac.Nombre,
                    Url = ac.Url,
                    FactorPrecio = 0,
                    Precio = 0
                }).ToListAsync();

            var tipoPerchas = await context.TipoPerchas
                .Select(tp => new Items
                {
                    Id = tp.IdTipoPercha,
                    Nombre = tp.Nombre,
                    Url = string.Empty,
                    FactorPrecio = tp.FactorPrecio,
                    Precio = 0
                }).ToListAsync();

            var texturaPerchas = await context.TexturaPerchas
                .Select(tp => new Items
                {
                    Id = tp.IdTexturaPercha,
                    Nombre = tp.Nombre,
                    Url = tp.Url,
                    FactorPrecio = 0,
                    Precio = tp.Precio
                }).ToListAsync();

            var catalogos = new List<CatalogoDTO>
            {
                new () { NombreCatalogo = "AreaComercial", Items = areaComerciales },
                new () { NombreCatalogo = "TipoPercha", Items = tipoPerchas },
                new () { NombreCatalogo = "TexturaPercha", Items = texturaPerchas }
            };

            return Ok(catalogos);
        }

        // POST: api/Catalogo
        [HttpPost]
        public async Task<ActionResult> PostCatalogoItem(string catalogo, [FromBody] Items item)
        {
            switch (catalogo.ToLower())
            {
                case "areacomercial":
                    var areaComercial = new AreaComercial
                    {
                        Nombre = item.Nombre,
                        Url = item.Url
                    };
                    await context.AreaComerciales.AddAsync(areaComercial);
                    break;

                case "tipopercha":
                    var tipoPercha = new TipoPercha
                    {
                        Nombre = item.Nombre,
                        FactorPrecio = item.FactorPrecio
                    };
                    await context.TipoPerchas.AddAsync(tipoPercha);
                    break;

                case "texturapercha":
                    var texturaPercha = new TexturaPercha
                    {
                        Nombre = item.Nombre,
                        Url = item.Url,
                        Precio = item.Precio
                    };
                    await context.TexturaPerchas.AddAsync(texturaPercha);
                    break;

                default:
                    return BadRequest("Catálogo no encontrado.");
            }

            await context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/Catalogo/AreaComercial/5
        [HttpPut]
        public async Task<ActionResult> PutCatalogoItem(string catalogo, [FromBody] Items item)
        {
            switch (catalogo.ToLower())
            {
                case "areacomercial":
                    var areaComercial = await context.AreaComerciales.FindAsync(item.Id);
                    if (areaComercial == null)
                        return NotFound("El id no exite");
                    areaComercial.Nombre = item.Nombre;
                    areaComercial.Url = item.Url;
                    break;

                case "tipopercha":
                    var tipoPercha = await context.TipoPerchas.FindAsync(item.Id);
                    if (tipoPercha == null)
                        return NotFound("El id no exite");
                    tipoPercha.Nombre = item.Nombre;
                    tipoPercha.FactorPrecio = item.FactorPrecio;
                    break;

                case "texturapercha":
                    var texturaPercha = await context.TexturaPerchas.FindAsync(item.Id);
                    if (texturaPercha == null)
                        return NotFound("El id no exite");
                    texturaPercha.Nombre = item.Nombre;
                    texturaPercha.Url = item.Url;
                    texturaPercha.Precio = item.Precio;
                    break;

                default:
                    return BadRequest("Catálogo no encontrado.");
            }

            await context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Catalogo/AreaComercial/5
        [HttpDelete]
        public async Task<ActionResult> DeleteCatalogoItem(string catalogo, long id)
        {
            switch (catalogo.ToLower())
            {
                case "areacomercial":
                    var areaComercial = await context.AreaComerciales.FindAsync(id);
                    if (areaComercial == null)
                        return NotFound("El id no exite");
                    context.AreaComerciales.Remove(areaComercial);
                    break;

                case "tipopercha":
                    var tipoPercha = await context.TipoPerchas.FindAsync(id);
                    if (tipoPercha == null)
                        return NotFound("El id no exite");
                    context.TipoPerchas.Remove(tipoPercha);
                    break;

                case "texturapercha":
                    var texturaPercha = await context.TexturaPerchas.FindAsync(id);
                    if (texturaPercha == null)
                        return NotFound("El id no exite");
                    context.TexturaPerchas.Remove(texturaPercha);
                    break;

                default:
                    return BadRequest("Catálogo no encontrado.");
            }

            await context.SaveChangesAsync();
            return NoContent();
        }


    }
}
