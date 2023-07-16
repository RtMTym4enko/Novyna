using AutoMapper;
using Novyna.Data.Entities;
using Novyna.Model;

namespace Novyna.Profiles
{
    internal sealed class NewsProfile : Profile
    {
        public NewsProfile()
        {
            CreateMap<News, NewsDto>();
            CreateMap<CreateNewsDto, News>();
            CreateMap<UpdateNewsDto, News>();
        }
    }
}
