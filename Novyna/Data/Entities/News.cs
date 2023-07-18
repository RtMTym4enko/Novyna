namespace Novyna.Data.Entities
{
    public sealed record News
    {
        public Guid Id { get; init; }

        public string Title { get; set; }

        public string Content { get; set; }

        public int CoverIndex { get; set; }

        public List<Image> Images { get; set; }

        public List<Tag> Tags { get; set; }
    }
}
