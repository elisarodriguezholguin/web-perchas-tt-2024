using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProyectoBaseNetCore.Middlewares;
using ProyectoTesisApi.Controllers;
using ProyectoTesisApi.Entities;
using ProyectoTesisApi.Filters;
using ProyectoTesisApi.Helpers;
using ProyectoTesisApi.Services;
using Serilog;
using Serilog.Events;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;

[assembly: ApiConventionType(typeof(DefaultApiConventions))]

namespace ProyectoTesisApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            string projectName = Assembly.GetEntryAssembly().GetName().Name;
             services.Configure<IISServerOptions>(options =>
                {
                    options.MaxRequestBodySize = int.MaxValue;
                });

            services.Configure<KestrelServerOptions>(options =>
                {
                    options.Limits.MaxRequestBodySize = int.MaxValue;
                });
            services.AddControllers(opciones =>
            {
                //Log para captar todos los exeptions n o capturados
                opciones.Filters.Add(typeof(ExceptionFilter));
            }).AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles).AddNewtonsoftJson();

            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddSerilog(Log.Logger);
            });

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("defaultConnection"))
                //.EnableSensitiveDataLogging() // Habilitar logging sensible
                //.LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information)
                );


            //Autenticacion
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).
                AddJwtBearer(opciones => {
                    opciones.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWTKey"])),
                        ClockSkew = TimeSpan.Zero
                    };

                    opciones.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var token = context.Request.Headers["X-JWT-Token"].FirstOrDefault();
                            if (!string.IsNullOrEmpty(token))
                            {
                                if (token.StartsWith("Bearer "))
                                {
                                    token = token.Substring("Bearer ".Length).Trim(); // Elimina el prefijo 'Bearer '
                                }
                                context.Token = token;
                                Console.WriteLine("Token recibido: " + token); // Asegúrate de que el token no tenga el prefijo 'Bearer '
                            }
                            return Task.CompletedTask;
                        }
                    };
                }
                );

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ProyectoTesisApi",
                    Version = "v1",
                    Description = "Este es un Proyecto API REST en .NET Core",
                    Contact = new OpenApiContact
                    {
                        Email = "elisa@correo.com",
                        Name = "Elisa",
                        Url = new Uri("https://Elisa.blog")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT"
                    },
                });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "X-JWT-Token",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[]{}
                    }
                });

                var archivoXML = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var rutaXML = Path.Combine(AppContext.BaseDirectory, archivoXML);
                c.IncludeXmlComments(rutaXML);
                //Omitir Endpoint que no pueden ser mapeados por swagger
                /*  c.DocInclusionPredicate((docName, apiDesc) => !new[] {
                          (typeof(PruebasController), "Respuestas"),
                         // (typeof(OtroControlador), "OtroMetodo")
                        }.Any(t =>
                        {
                            var methodInfo = apiDesc.TryGetMethodInfo(out var info) ? info : null;
                            return methodInfo != null && t.Item1 == methodInfo.DeclaringType && t.Item2 == methodInfo.Name;
                        }));*/
            });
            services.AddAutoMapper(typeof(Startup));
            services.AddScoped<MapperHelper>();
            services.AddDataProtection();

            services.AddTransient<HashService>();

            //CORS es relevante para navegadores y proyectos hechos en react, angular, etc, para aplicaciones moviles y de mas no tiene sentido realizarlo
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials()
                          .WithExposedHeaders("X-JWT-Token")
                          .SetIsOriginAllowed( origin => true);
                });
            });
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddIdentity<User, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = false).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            //Captar todas las peticiones en logs y en terminal
            app.UseMiddleware<LogHTTPResponseMiddleware>();
            app.UseLoggerResponseHTTP();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProyectoTesisApi v1");
            });
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                // endpoints.MapHub<ChatHub>("/chatHub"); // Configura el hub de SignalR
            });
            using var scope = app.ApplicationServices.CreateScope();
            var services = scope.ServiceProvider;
            var dbContext = services.GetRequiredService<ApplicationDbContext>();
            try
            {
                //dbContext.Database.EnsureCreated();
                //dbContext.Database.Migrate();
                var userManager = services.GetRequiredService<UserManager<User>>();
                //var roleManager = services.GetRequiredService<RoleManager<Rol>>();
                DbInitializer.InitializeAsync(userManager, dbContext).Wait();
            }
            catch (Exception ex)
            {
                logger.LogError($"Error durante la inicialización de la base de datos: {ex}");
                throw;
            }
        }
    }
}