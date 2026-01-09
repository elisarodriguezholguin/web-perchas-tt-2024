using Microsoft.EntityFrameworkCore;
using ProyectoTesisApi.DTOs.SecurityDTOs;
using ProyectoTesisApi.Entities;

namespace ProyectoTesisApi.Services
{
    public class ExampleService
    {
        private string userName;
        private string ip;
        private readonly MapperHelper mapperHelper;

        public ExampleService()
        {
        }

        public ExampleService(string userName, string ip, MapperHelper mapperHelper)
        {
            this.userName = userName;
            this.ip = ip;
            this.mapperHelper = mapperHelper;
        }

        public async Task<List<UserInfoDTO>> GetUsers()
        {
            var user = this.userName;
            var ip = this.ip;
            using (var context = new ApplicationDbContext())
            {
                return mapperHelper.GetMappedList<User, UserInfoDTO>(await context.Users.ToListAsync(), x => true);
            }
        }
    }
}