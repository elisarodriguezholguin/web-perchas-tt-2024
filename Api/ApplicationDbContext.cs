using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProyectoTesisApi.Entities;

namespace ProyectoTesisApi
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public ApplicationDbContext()
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>().ToTable("Users", "SEG");
            //modelBuilder.Entity<Rol>().ToTable("Roles", "SEG");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UsersToken", "SEG");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaim", "SEG");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRole", "SEG");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaim", "SEG");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogin", "SEG");
            modelBuilder.Entity<Cotizacion>(entity =>
            {
                
                entity.Property(e => e.ImageBase64)
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");  // Asegura que el campo en la base de datos sea suficientemente grande
            });
        }

        public DbSet<Cotizacion> Cotizaciones { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<DetalleCotizacion> DetalleCotizaciones { get; set; }
        public DbSet<AreaComercial> AreaComerciales { get; set; }
        public DbSet<TexturaPercha> TexturaPerchas { get; set; }
        public DbSet<TipoPercha> TipoPerchas { get; set; }
    }
}