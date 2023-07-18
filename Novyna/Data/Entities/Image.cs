namespace Novyna.Data.Entities
{
    public sealed record Image
    {
        public Guid Id { get; }

        public Guid? NewsId { get; set; }

        public News? News { get; set; }

        public string FileName { get; set; }
    }
}
