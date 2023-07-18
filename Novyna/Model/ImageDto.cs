namespace Novyna.Model
{
    public sealed record ImageDto
    {
        public Guid Id { get; set; }

        public Guid? NewsId { get; set; }

        public string FileUrl { get; set; }
    }
}