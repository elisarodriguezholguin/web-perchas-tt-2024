using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using ProyectoTesisApi.DTOs.SecurityDTOs;
using System.Security.Cryptography;

namespace ProyectoTesisApi.Services
{
    public class HashService
    {
        public HashResult Hash(string textoPlano)
        {
            var sal = new byte[16];
            using (var random = RandomNumberGenerator.Create())
            {
                random.GetBytes(sal);
            }

            return Hash(textoPlano, sal);
        }

        public HashResult Hash(string textoPlano, byte[] sal)
        {
            var llaveDerivada = KeyDerivation.Pbkdf2(password: textoPlano,
                salt: sal, prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 32);

            var hash = Convert.ToBase64String(llaveDerivada);

            return new HashResult()
            {
                Hash = hash,
                Sal = sal
            };
        }
    }
}