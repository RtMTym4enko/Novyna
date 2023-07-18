using Microsoft.EntityFrameworkCore;
using Novyna.Data.Entities;

namespace Novyna.Data
{
    public sealed class NovynaDbContext : DbContext
    {
        public NovynaDbContext(DbContextOptions<NovynaDbContext> dbContextOptions) : base(dbContextOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<News>().ToTable("News");
            modelBuilder.Entity<News>().HasKey(n => n.Id);
            modelBuilder.Entity<News>().Property(n => n.Title).IsRequired().HasMaxLength(200);
            modelBuilder.Entity<News>().Property(n => n.Content).IsRequired();
            modelBuilder.Entity<News>().HasMany(n => n.Tags).WithMany().UsingEntity(
            l => l.HasOne(typeof(Tag)).WithMany().OnDelete(DeleteBehavior.Cascade),
            r => r.HasOne(typeof(News)).WithMany().OnDelete(DeleteBehavior.Cascade));

            modelBuilder.Entity<Tag>().ToTable("Tags");
            modelBuilder.Entity<Tag>().HasKey(t => t.Id);
            modelBuilder.Entity<Tag>().Property(t => t.Name).IsRequired();
            modelBuilder.Entity<Tag>().Property(t => t.Color).IsRequired();

            modelBuilder.Entity<Image>().ToTable("Images");
            modelBuilder.Entity<Image>().HasKey(i => i.Id);
            modelBuilder.Entity<Image>().Property(i => i.FileName).IsRequired();
            modelBuilder.Entity<Image>().HasOne(i => i.News).WithMany(n => n.Images).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
