namespace Novyna.Model
{
    public sealed record TagDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Color { get; set; }
    }
}