using System.Linq.Expressions;

namespace Novyna.Data
{
    public interface IRepository<T> where T : class
    {
        T Create(T entity);

        void Update(T entity);

        void Delete(T entity);

        T? Find(Guid newsId);

        IEnumerable<T> Get(Expression<Func<T, bool>>? filter = null, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null);
    }
}