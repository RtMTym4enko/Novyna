using System.ComponentModel.DataAnnotations;

namespace Novyna.Model
{
    public sealed record UpdateTagDto
    {
        [Required]
        [MaxLength(20)]
        public string Name { get; set; }

        [Required]
        public string Color { get; set; }
    }
}