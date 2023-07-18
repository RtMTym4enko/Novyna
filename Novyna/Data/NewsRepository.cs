using Microsoft.EntityFrameworkCore;
using Novyna.Data.Entities;
using System.Data;
using System.Linq.Expressions;
using System.Reflection.Metadata;

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

        public override void Update(News entity)
        {
            InsertUpdateOrDeleteGraph(entity);
        }

        public void InsertUpdateOrDeleteGraph(News news)
        {
            var existingNews = DbContext.Set<News>()
                .Include(n => n.Images)
                .Include(n => n.Tags)
                .FirstOrDefault(n => n.Id == news.Id);

            if (existingNews == null)
            {
                DbContext.Add(news);
            }
            else
            {
                DbContext.Entry(existingNews).CurrentValues.SetValues(news);
                SyncRelatedData(news.Images, existingNews.Images, (i1,i2) => i1.Id == i2.Id);
                SyncRelatedData(news.Tags, existingNews.Tags, (i1, i2) => i1.Id == i2.Id);
            };
        }

        private void SyncRelatedData<T>(IEnumerable<T> source, IList<T> target, Func<T, T, bool> selector)
        {
            foreach (var sourceItem in source)
            {
                var existingItem = target
                    .FirstOrDefault(ti => selector(ti, sourceItem));

                if (existingItem == null)
                {
                    target.Add(sourceItem);
                }
                else
                {
                    DbContext.Entry(existingItem).CurrentValues.SetValues(sourceItem);
                }
            }

            foreach (var targetItem in target)
            {
                if (!source.Any(i => selector(i,targetItem)))
                {
                    DbContext.Remove(targetItem);
                }
            }
        }

        public override News? Find(Guid newsId)
        {
            return DbContext.Set<News>()
              .Include(n => n.Tags)
              .Include(n => n.Images)
              .AsNoTrackingWithIdentityResolution()
              .FirstOrDefault(n => n.Id == newsId);
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
