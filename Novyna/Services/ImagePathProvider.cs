namespace Novyna.Services
{
    internal sealed class ImagePathProvider : IImagePathProvider
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImagePathProvider(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public string CreatePath(string fileName)
        {
            var directory = _webHostEnvironment.ContentRootPath + "\\Pictures\\";
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            var generatedName = Guid.NewGuid().ToString("N") + fileName;
            return Path.Combine(directory, generatedName);
        }

        public string GetPath(string fileName)
        {
            return Path.Combine(_webHostEnvironment.ContentRootPath, fileName);
        }
    }
}
