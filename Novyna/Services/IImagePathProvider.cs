namespace Novyna.Services
{
    public interface IImagePathProvider
    {
        string CreatePath(string fileName);

        string GetPath(string fileName);
    }
}