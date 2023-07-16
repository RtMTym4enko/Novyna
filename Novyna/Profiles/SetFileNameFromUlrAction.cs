using AutoMapper;
using Novyna.Data.Entities;
using Novyna.Model;
using Novyna.Services;

namespace Novyna.Profiles
{
    internal sealed class SetFileNameFromUlrAction : IMappingAction<ImageDto, Image>
    {
        private readonly IImageUrlProvider _imageUrlProvider;

        public SetFileNameFromUlrAction(IImageUrlProvider imageUrlProvider)
        {
            _imageUrlProvider = imageUrlProvider;
        }

        public void Process(Image source, ImageDto dto, ResolutionContext context)
        {
            dto.FileUrl = _imageUrlProvider.GetUrl(source.FileName);
        }

        public void Process(ImageDto source, Image destination, ResolutionContext context)
        {
            destination.FileName = _imageUrlProvider.GetFileName(source.FileUrl);
        }
    }
}
