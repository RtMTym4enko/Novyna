namespace Novyna.Model
{
    public sealed record NewsDto
    {
        public Guid Id { get; init; }

        public string Title { get; set; }

        public string Content { get; set; }

        public int CoverIndex { get; set; }

        public ImageDto[] Images { get; set; }

        public TagDto[] Tags { get; set; }
    }
}