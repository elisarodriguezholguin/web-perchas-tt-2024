using AutoMapper;

namespace ProyectoTesisApi.Services
{
    public class MapperHelper
    {
        private readonly IMapper mapper;

        public MapperHelper(IMapper mapper)
        {
            this.mapper = mapper;
        }

        public List<TDestination> GetMappedList<TSource, TDestination>(List<TSource> sourceList, Func<TSource, bool> condition) => mapper.Map<List<TDestination>>(sourceList.Where(condition).ToList());

        public TDestination GetMappedObject<TSource, TDestination>(TSource sourceObjetc) => mapper.Map<TDestination>(sourceObjetc);
    }
}