namespace ProyectoTesisApi.DTOs
{
    public class PaginacionDTO
    {
        public int Pagina { get; set; }
        private int datosPorPagina = 10;
        private readonly int datosMaxPorPagina = 50;

        public int DatosPorPagina
        {
            get { return datosPorPagina; }
            set { datosPorPagina = (value > datosMaxPorPagina) ? datosMaxPorPagina : value; }
        }
    }
}