using AutoMapper;
using Novyna.Data.Entities;
using Novyna.Model;

namespace Novyna.Profiles
{
    internal sealed class ImageProfile : Profile
    {
        public ImageProfile()
        {
            CreateMap<Image, ImageDto>()
                .AfterMap<SetFileUlrAction>();
            CreateMap<ImageDto, Image>()
                .AfterMap<SetFileNameFromUlrAction>();
        }
    }
}
