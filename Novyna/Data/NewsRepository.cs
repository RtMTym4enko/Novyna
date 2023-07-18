using Microsoft.EntityFrameworkCore;
using Novyna.Data.Entities;
using System.Data;
using System.Linq.Expressions;

namespace Novyna.Data
{
    internal sealed class NewsRepository : Repository<News>
    {
        public NewsRepository(NovynaDbContext novynaDbContext) : base(novynaDbContext)
        { 
        }

        public override IEnumerable<News> Get(Expression<Func<News, bool>> filter = null, Func<IQueryable<News>, IOrderedQueryable<News>> orderBy = null)
        {
            IQueryable<News> query = filter != null ? DbContext.Set<News>().Where(filter) : DbContext.Set<News>();
            query = query.Include(n => n.Tags).Include(n => n.Images);
            return orderBy != null ? orderBy(query) : query;
        }

        public override News Create(News entity)
        {
            ReAttach(entity.Tags);
            ReAttach(entity.Images);
            return base.Create(entity);
        }

        private void ReAttach<T>(IEnumerable<T> values)
        {
            foreach (var value in values)
            {
                if (DbContext.Entry(value).State == EntityState.Detached)
                {
                    DbContext.Attach(value);
                }
            }
        }
    }
}
