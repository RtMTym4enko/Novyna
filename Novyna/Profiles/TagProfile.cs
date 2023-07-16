using AutoMapper;
using Novyna.Data.Entities;
using Novyna.Model;

namespace Novyna.Profiles
{
    internal sealed class TagProfile : Profile
    {
        public TagProfile()
        {
            CreateMap<Tag, TagDto>();
            CreateMap<TagDto, Tag>();
            CreateMap<CreateTagDto, Tag>();
            CreateMap<UpdateTagDto, Tag>();
        }
    }
}
