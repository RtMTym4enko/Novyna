using Novyna.Data.Entities;

namespace Novyna.Data
{
    public interface IUnitOfWork
    {
        IRepository<News> NewsRepository { get; }

        IRepository<Tag> TagRepository { get; }

        IRepository<Image> ImageRepository { get; }

        void Save();
    }
}