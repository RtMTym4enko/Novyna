namespace Novyna.Services
{
    internal sealed class ImageUrlProvider : IImageUrlProvider
    {
        public string GetFileName(string fileUrl)
        {
            return  Path.GetFileName(fileUrl);
        }

        public string GetUrl(string fileName)
        {
            return $"/pictures/{fileName}";
        }
    }
}
