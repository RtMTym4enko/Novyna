using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;

namespace Novyna.Data
{
    internal class Repository<T> : IRepository<T>, IDisposable where T : class
    {
        private readonly DbSet<T> _dataSet;
        private bool _disposedValue;

        public Repository(NovynaDbContext novynaDbContext)
        {
            DbContext = novynaDbContext;
            _dataSet = DbContext.Set<T>();
        }

        protected NovynaDbContext DbContext { get; set; }

        public virtual IEnumerable<T> Get(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null)
        {
            IQueryable<T> query = filter != null ? _dataSet.Where(filter) : _dataSet;
            return orderBy != null ? orderBy(query) : query;
        }

        public void Delete(T entity)
        {
            var entitryState = DbContext.Entry(entity).State;
            if (entitryState == EntityState.Detached)
            {
                _dataSet.Attach(entity);
            }
            _dataSet.Remove(entity);
        }

        public void Update(T entity)
        {
            _dataSet.Attach(entity);
            DbContext.Entry(entity).State = EntityState.Modified;
        }

        public virtual T Create(T entity)
        {
            return _dataSet.Add(entity).Entity;
        }
        
        public T? Find(Guid newsId) => _dataSet.Find(newsId);

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposedValue)
            {
                if (disposing)
                {
                    DbContext.Dispose();
                }
                _disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
