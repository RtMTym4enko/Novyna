using AutoMapper;
using Novyna.Data.Entities;
using Novyna.Model;
using Novyna.Services;

namespace Novyna.Profiles
{
    internal sealed class SetFileUlrAction : IMappingAction<Image, ImageDto>
    {
        private readonly IImageUrlProvider _imageUrlProvider;

        public SetFileUlrAction(IImageUrlProvider imageUrlProvider)
        {
            _imageUrlProvider = imageUrlProvider;
        }

        public void Process(Image source, ImageDto dto, ResolutionContext context)
        {
            dto.FileUrl = _imageUrlProvider.GetUrl(source.FileName);
        }
    }
}
