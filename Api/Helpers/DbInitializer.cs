using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProyectoTesisApi.Entities;

namespace ProyectoTesisApi.Helpers
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(UserManager<User> userManager, ApplicationDbContext context)
        {
            await InitializeRolesAsync(context);
            await InitializeUsersAsync(userManager, context);
            await InitializeAreaComercialAsync(context);
            await InitializeTipoPerchaAsync(context);
            await InitializeTexturaPerchaAsync(context);
        }

        private static async Task InitializeRolesAsync(ApplicationDbContext dbContext)
        {
            // Lista de roles predeterminados
            var roles = new[]
            {
                new Rol { Nombre = "Administrador", Descripcion = "Rol de administrador" },
                new Rol { Nombre = "Usuario", Descripcion = "Rol de usuario regular" }
            };

            foreach (var role in roles)
            {
                // Verifica si el rol ya existe
                var existingRole = await dbContext.Roles.FirstOrDefaultAsync(x => x.Nombre == role.Nombre);
                if (existingRole == null)
                {
                    // Si el rol no existe, crea el rol
                    await dbContext.Roles.AddAsync(role);
                }
            }
            await dbContext.SaveChangesAsync();
        }

        private static async Task InitializeUsersAsync(UserManager<User> userManager, ApplicationDbContext dbContext)
        {
            // Lista de usuarios predeterminados
            var users = new[]
            {
                new User
                {
                    UserName = "admin@email.com",
                    Email = "admin@email.com",
                    FirstName = "Admin",
                    LastName = "User",
                    Bloqueo = false,
                    Direccion = "Dirección de Admin",
                    Telefono = "123456789",
                    Cedula = "1234567890"
                },
                new User
                {
                    UserName = "user1@email.com",
                    Email = "user1@email.com",
                    FirstName = "User1",
                    LastName = "Lastname1",
                    Bloqueo = false,
                    Direccion = "Dirección de User1",
                    Telefono = "987654321",
                    Cedula = "0987654321"
                },
                new User
                {
                    UserName = "user2@email.com",
                    Email = "user2@email.com",
                    FirstName = "User2",
                    LastName = "Lastname2",
                    Bloqueo = false,
                    Direccion = "Dirección de User2",
                    Telefono = "555555555",
                    Cedula = "5555555555"
                }
            };

            foreach (var user in users)
            {
                // Verifica si el usuario ya existe
                var existingUser = await userManager.FindByEmailAsync(user.Email);
                if (existingUser == null)
                {
                    // Busca el rol por nombre
                    var rolName = user.UserName.Contains("admin") ? "Administrador" : "Usuario"; // El rol que deseas asignar
                    var rol = await dbContext.Roles.FirstOrDefaultAsync(r => r.Nombre == rolName);
                    if (rol != null)
                    {
                        user.IdRol = rol.Id; // Asigna el Id del rol encontrado al usuario
                    }
                    else
                    {
                        Console.WriteLine($"No se encontró el rol {rolName}. Asegúrate de haber inicializado los roles correctamente.");
                        return;
                    }

                    // Si el usuario no existe, crea el usuario con una contraseña segura
                    var result = await userManager.CreateAsync(user, "Abc123*+");
                    if (!result.Succeeded)
                    {
                        foreach (var error in result.Errors)
                        {
                            Console.WriteLine($"Error creando usuario {user.UserName}: {error.Description}");
                        }
                    }
                }
            }
        }

        private static async Task InitializeAreaComercialAsync(ApplicationDbContext context)
        {
            // Datos de ejemplo
            var areasComerciales = new[]
            {
                new AreaComercial
                {
                    Nombre = "Tienda",
                    Url = "https://media.istockphoto.com/id/1129368394/es/foto/interior-supermercado-con-productos-y-banners.jpg?s=612x612&w=0&k=20&c=lDJePaKNwheP6bQGL4_dLJVaWmJDoGodK4bcrfXe84c="
                },
                new AreaComercial
                {
                    Nombre = "Minimarket",
                    Url = "https://t4.ftcdn.net/jpg/02/39/15/07/360_F_239150705_ydiu52xf0O5V4rAQnmDqC9vpMYMRXb5L.jpg"
                }
            };

            foreach (var area in areasComerciales)
            {
                // Verifica si el área comercial ya existe
                var existingArea = await context.AreaComerciales.FirstOrDefaultAsync(a => a.Nombre == area.Nombre);
                if (existingArea == null)
                {
                    // Si el área comercial no existe, agrégala a la base de datos
                    await context.AreaComerciales.AddAsync(area);
                }
                else
                {
                    // Si el área comercial existe, actualiza la URL
                    existingArea.Url = area.Url;
                    context.AreaComerciales.Update(existingArea);
                }
            }
            // Guarda los cambios en la base de datos
            await context.SaveChangesAsync();
        }

        private static async Task InitializeTipoPerchaAsync(ApplicationDbContext context)
        {
            // Datos de ejemplo
            var tiposPerchas = new[]
            {
                new TipoPercha { Nombre = "Percha", FactorPrecio = 1 },
                new TipoPercha { Nombre = "Gondola", FactorPrecio = 1.2m },
                new TipoPercha { Nombre = "Rack", FactorPrecio = 1.4m }
            };

            foreach (var tipo in tiposPerchas)
            {
                // Verifica si el tipo de percha ya existe
                var existingTipo = await context.TipoPerchas.FirstOrDefaultAsync(t => t.Nombre == tipo.Nombre);
                if (existingTipo == null)
                {
                    // Si el tipo de percha no existe, agrégalo a la base de datos
                    await context.TipoPerchas.AddAsync(tipo);
                }
            }

            // Guarda los cambios en la base de datos
            await context.SaveChangesAsync();
        }

        private static async Task InitializeTexturaPerchaAsync(ApplicationDbContext context)
        {
            // Datos de ejemplo
            var texturasPerchas = new[]
            {
                new TexturaPercha
                {
                    Nombre = "Textura Plástica",
                    Url = "https://thumbs.dreamstime.com/b/textura-pl%C3%A1stica-blanca-del-pvc-36405709.jpg",
                    Precio = 5
                },
                new TexturaPercha
                {
                    Nombre = "Textura de Madera",
                    Url = "https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg",
                    Precio = 25
                },
                new TexturaPercha
                {
                    Nombre = "Textura de Metal",
                    Url = "https://static8.depositphotos.com/1167801/945/i/450/depositphotos_9453776-stock-photo-brushed-metal-plate.jpg",
                    Precio = 10
                },
                new TexturaPercha
                {
                    Nombre = "Textura de Vidrio",
                    Url = "https://media.istockphoto.com/id/696307908/es/foto/color-blanco-mate-fondo-de-textura-de-vidrio.jpg?s=612x612&w=0&k=20&c=iMJdKvJkuqQ1gbPbtIVFsyYfsXeLgQL8t63BjzbzVq0=",
                    Precio = 40
                }
            };

            foreach (var textura in texturasPerchas)
            {
                // Verifica si la textura de percha ya existe
                var existingTextura = await context.TexturaPerchas.FirstOrDefaultAsync(t => t.Nombre == textura.Nombre);
                if (existingTextura == null)
                {
                    // Si la textura de percha no existe, agrégala a la base de datos
                    await context.TexturaPerchas.AddAsync(textura);
                }
                else
                {
                    // Si la textura de percha existe, actualiza la URL
                    existingTextura.Url = textura.Url;
                    context.TexturaPerchas.Update(existingTextura);
                }
            }

            // Guarda los cambios en la base de datos
            await context.SaveChangesAsync();
        }
    }
}
