namespace ProyectoTesisApi.DTOs
{
    public class CatalogoDTO
    {
        public string NombreCatalogo { get; set; }
        public List<Items> Items { get; set; }
    }
    public class Items
    {
        public long Id { get; set; }
        public string Nombre { get; set; }
        public string Url { get; set; }
        public decimal FactorPrecio { get; set; }
        public decimal Precio { get; set; }
    }
}
