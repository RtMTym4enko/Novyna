namespace Novyna.Services
{
    public interface IImageUrlProvider
    {
        string GetFileName(string fileUrl);

        string GetUrl(string fileName);
    }
}