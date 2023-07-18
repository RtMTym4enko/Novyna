namespace Novyna.Data.Entities
{
    public sealed record Tag
    {
        public Guid Id { get; init; }

        public string Name { get; set; }

        public string Color { get; set; }
    }
}
