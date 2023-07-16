using Microsoft.AspNetCore.Mvc;

namespace Novyna.Model
{
    public sealed record CreateImageDto
    {
        public Guid NewsId { get; set; }

        public string Path { get; set; }

        [FromForm]
        public IFormFile File { get; set; }
    }
}