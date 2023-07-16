using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Novyna.Data;
using Novyna.Model;
using Novyna.Services;
using Image = Novyna.Data.Entities.Image;

namespace Novyna.Controllers
{

    [Route("api/images")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IImagePathProvider _imagePathProvider;

        public ImagesController(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IImagePathProvider imagePathProvider )
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _imagePathProvider = imagePathProvider;
        }

        [HttpGet("{id}", Name = "GetImage")]
        [HttpHead]
        public ActionResult<ImageDto> GetImage([FromRoute] Guid id)
        {
            var fromRepo = _unitOfWork.ImageRepository.Find(id);
            if (fromRepo != null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ImageDto>(fromRepo));
        }

        [HttpPost]
        public ActionResult<ImageDto> UploadImage([FromForm(Name = "image")] IFormFile image)
        {
            var filePath = _imagePathProvider.CreatePath(image.FileName);
            using (FileStream filestream = System.IO.File.Create(filePath))
            {
                image.CopyTo(filestream);
                filestream.Flush();
            }
            var newImage = new Image() { FileName = Path.GetFileName(filePath) };
            _unitOfWork.ImageRepository.Create(newImage);
            _unitOfWork.Save();

            var dto = _mapper.Map<ImageDto>(newImage);
            return CreatedAtRoute("GetImage", new { id = newImage.Id }, dto);
        }

        [HttpDelete("{imageId}")]
        public ActionResult DeleteImage(Guid imageId)
        {
            var imgFromRepo = _unitOfWork.ImageRepository.Find(imageId);
            if (imgFromRepo == null)
            {
                return NotFound();
            }
            _unitOfWork.ImageRepository.Delete(imgFromRepo);
            _unitOfWork.Save();

            var filePath = _imagePathProvider.GetPath(imgFromRepo.FileName);
            var fileInfo = new FileInfo(filePath);
            fileInfo.Delete();
            return NoContent();
        }

        [HttpOptions]
        public IActionResult GetNewsOptions()
        {
            Response.Headers.Add("Allow", "GET,OPTIONS,POST,DELETE,HEAD");
            return Ok();
        }
    }
}
