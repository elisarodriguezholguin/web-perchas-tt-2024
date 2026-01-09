using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProyectoTesisApi.DTOs.SecurityDTOs;
using ProyectoTesisApi.Entities;
using ProyectoTesisApi.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProyectoTesisApi.Controllers
{
    [ApiController]
    [Route("api/Security")]
    public class SecurityController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly IConfiguration configuration;
        private readonly SignInManager<User> signInManager;
        private readonly HashService hashService;
        private readonly IDataProtector dataProtector;
        private readonly ApplicationDbContext context;
        private readonly IHttpContextAccessor httpContextAccessor;
        //private readonly string IdUser;
        //private readonly string EmailUser;
        private string JWTKey { get; set; }


        public SecurityController(UserManager<User> userManager,
                                 IConfiguration configuration,
                                 SignInManager<User> signInManager,
                                 IDataProtectionProvider dataProtectionProvider,
                                 HashService hashService,
                                 ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            JWTKey = configuration["JWTKey"];
            this.userManager = userManager;
            this.configuration = configuration;
            this.signInManager = signInManager;
            this.hashService = hashService;
            dataProtector = dataProtectionProvider.CreateProtector(JWTKey);
            this.context = context;
            this.httpContextAccessor = httpContextAccessor;
            //this.IdUser = Task.Run(async () => (await userManager.FindByEmailAsync(httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type.Contains("email", StringComparison.CurrentCultureIgnoreCase))?.Value ?? "")).Id ?? "Desconocido").Result;
            //this.EmailUser = Task.Run(async () => (await userManager.FindByEmailAsync(httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type.Contains("email", StringComparison.CurrentCultureIgnoreCase))?.Value ?? "")).Email ?? "Desconocido").Result;

        }

        [HttpGet("Encrypt")]
        public ActionResult Encriptar()
        {
            var textoPlano = "Texto Ejemplo";
            var textoCifrado = dataProtector.Protect(textoPlano);
            var textoDesencriptado = dataProtector.Unprotect(textoCifrado);
            return Ok(new
            {
                textoPlano,
                textoCifrado,
                textoDesencriptado
            });
        }

        [HttpGet("EncryptByTime")]
        public ActionResult EncriptarPorTiempo()
        {
            var protectoLimitadoPorTiempo = dataProtector.ToTimeLimitedDataProtector();

            var textoPlano = "Texto Ejemplo";
            var textoCifrado = protectoLimitadoPorTiempo.Protect(textoPlano, lifetime: TimeSpan.FromSeconds(5));
            Thread.Sleep(TimeSpan.FromSeconds(6));
            var textoDesencriptado = protectoLimitadoPorTiempo.Unprotect(textoCifrado);
            return Ok(new
            {
                textoPlano,
                textoCifrado,
                textoDesencriptado
            });
        }

        [HttpGet("hash/{textoPlano}")]
        public ActionResult RealizarHash(string textoPlano)
        {
            var result1 = hashService.Hash(textoPlano);
            var result2 = hashService.Hash(textoPlano);
            return Ok(new
            {
                textoPlano,
                hash1 = result1,
                hash2 = result2,
            });
        }

        [HttpPost("Register")]
        public async Task<ActionResult<AuthenticationResponse>> Registrar(DTOs.SecurityDTOs.RegisterInfo registerInfo)
        {
            // Obtiene el rol "User"
            var Role = await context.Roles.FirstOrDefaultAsync(x => x.Nombre == "Usuario");

            if (Role == null)
            {
                return BadRequest("El rol 'Usuario' no existe.");
            }

            // Crear un nuevo usuario con el rol "admin"
            var newUser = new User
            {
                UserName = registerInfo.Username,
                LastName = registerInfo.LastName,
                FirstName = registerInfo.FirstName,
                Email = registerInfo.Email,
                Direccion = registerInfo.Direccion,
                Telefono = registerInfo.Telefono,
                Cedula = registerInfo.Cedula,
                IdRol = Role.Id // Asignar el Id del rol "admin"
            };

            var result = await userManager.CreateAsync(newUser, registerInfo.Password);
            if (!result.Succeeded)
            {
                return BadRequest("Ocurrio un error al registrar usuario");

            }

            return await CreateToken(registerInfo.Username);

        }


        [HttpGet("Roles")]
        public async Task<ActionResult> GetRoles()
        {
            var roles = await context.Roles.ToListAsync();
            return Ok(roles);
        }


        /* [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
         [HttpGet("RenewToken")]
         public async Task<ActionResult<AuthenticationResponse>> Renovar()
         {
             return await CreateToken(EmailUser);
         }*/

        //Generar Hash y Token
        [HttpPost("Login")]
        public async Task<ActionResult<AuthenticationResponse>> Login(DTOs.SecurityDTOs.UserLoginInfo userLoginInfo)
        {
            try
            {
                // Desencriptar los datos recibidos
                //var decryptedData = EncryptionHelper.Decrypt(encryptedLoginInfo, JWTKey);
                // var userLoginInfo = JsonConvert.DeserializeObject<DTOs.SecurityDTOs.UserLoginInfo>(decryptedData);
                var result = await signInManager.PasswordSignInAsync(userLoginInfo.Username,
                                                                    userLoginInfo.Password,
                                                                    isPersistent: false,
                                                                    lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var tokenResponse = await CreateToken(userLoginInfo.Username);

                    // Encriptar la respuesta
                    //var encryptedResponse = EncryptionHelper.Encrypt(JsonConvert.SerializeObject(tokenResponse), JWTKey).ToString();
                    return Ok(tokenResponse);
                }
                else
                {
                    return BadRequest("Login incorrecto");
                }
            }
            catch (Exception ex)
            {
                // Manejar excepciones
                return StatusCode(500, "Error del servidor: " + ex.Message);
            }
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("ValidateToken")]
        public async Task<ActionResult> ValidateTokenUser(string token)
        {
            try
            {
                var validateToken = await ValidateToken(token);
                if (validateToken is null)
                {
                    return BadRequest("Token no valido");
                }
                return Ok(validateToken);
            }
            catch (Exception)
            {
                return BadRequest("Token no valido");
            }
        }


        private async Task<AuthenticationResponse> CreateToken(string username)
        {
            var claims = new List<Claim>()
            {
                new("email", username),
            };

            var user = await userManager.FindByNameAsync(username);
            var claimsDB = await userManager.GetClaimsAsync(user);
            var rol = await context.Roles.FindAsync(user.IdRol);
            claims.AddRange(claimsDB);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddYears(1);

            var securityToken = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiration, signingCredentials: creds);

            return new AuthenticationResponse()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(securityToken),
                Expiracion = expiration,
                UserName = user.UserName,
                RolName = rol.Nombre,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Direccion = user.Direccion,
                Cedula = user.Cedula,
                Telefono = user.Telefono
            };
        }

        private Task<string> ValidateToken(string token)
        {
            if (token == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(JWTKey);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == "email").Value;

                // return user id from JWT token if validation successful
                return Task.FromResult(userId);
            }
            catch
            {
                // return null if validation fails
                return null;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("ChangePassword")]
        public async Task<ActionResult> ChangePassword(DTOs.SecurityDTOs.UserLoginInfo credencialesUsuario)
        {
            User user = await userManager.FindByNameAsync(credencialesUsuario.Username);
            if (user == null)
            {
                return NotFound();
            }
            user.PasswordHash = userManager.PasswordHasher.HashPassword(user, credencialesUsuario.Password);
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Ocurrio un error al cmabiar su contraseña");
            }
            return Ok("Contraseña actualizada con exito!");
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPatch("UpdateUserInfo")]
        public async Task<ActionResult> UpdateUserInfo (AuthenticationResponse authenticationResponse, string username) {
            var user = await userManager.FindByNameAsync(username);
            if (user is null)
                return NotFound();
            user.FirstName = authenticationResponse.FirstName;
            user.LastName = authenticationResponse.LastName;
            user.Direccion = authenticationResponse.Direccion;
            user.Cedula = authenticationResponse.Cedula;
            user.Telefono = authenticationResponse.Telefono;
            user.Email = authenticationResponse.UserName;
            user.UserName = authenticationResponse.UserName;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("Ocurrio un error al actualizar la información del usuario");
            
            return Ok(new AuthenticationResponse() { 
                Token = "",
                Expiracion = DateTime.Now,
                UserName = authenticationResponse.UserName,
                RolName = authenticationResponse.RolName,
                FirstName = authenticationResponse.FirstName,
                LastName = authenticationResponse.LastName,
                Direccion = authenticationResponse.Direccion,
                Cedula = authenticationResponse.Cedula,
                Telefono = authenticationResponse.Telefono
             });
        }
    }
}