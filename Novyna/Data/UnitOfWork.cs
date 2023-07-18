using Novyna.Data.Entities;

namespace Novyna.Data
{
    internal sealed class UnitOfWork : IUnitOfWork, IDisposable
    {
        private NovynaDbContext _context;

        public UnitOfWork(
            NovynaDbContext context,
            IRepository<News> newsRepository,
            IRepository<Tag> tagRepository,
            IRepository<Image> imageRepository)
        {
            _context = context;
            NewsRepository = newsRepository;
            TagRepository = tagRepository;
            ImageRepository = imageRepository;
        }

        public IRepository<News> NewsRepository { get; }

        public IRepository<Tag> TagRepository { get; }

        public IRepository<Image> ImageRepository { get; }

        public void Save() => _context.SaveChanges();

        public void Dispose() => _context.Dispose();
    }
}
