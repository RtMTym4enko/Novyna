using System.ComponentModel.DataAnnotations;

namespace Novyna.Model
{
    public sealed record UpdateNewsDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public int CoverIndex { get; set; }
    }
}