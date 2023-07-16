using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Novyna.Data;
using Novyna.Data.Entities;
using Novyna.Model;

namespace Novyna.Controllers
{
    [Route("api/tags")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TagsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        [HttpHead]
        public ActionResult<IEnumerable<TagDto>> GetTags()
        {
            var tags = _unitOfWork.TagRepository.Get().ToArray();
            var mappedTags = _mapper.Map<IEnumerable<TagDto>>(tags);
            return Ok(mappedTags);
        }

        [HttpGet("{tagId:guid}", Name = "GetTag")]
        [HttpHead]
        public ActionResult<TagDto> GetTag(Guid tagId)
        {
            var fromRepo = _unitOfWork.TagRepository.Find(tagId);
            return fromRepo != null ? Ok(_mapper.Map<TagDto>(fromRepo)) : NotFound();
        }

        [HttpPost]
        public ActionResult<TagDto> CreateTag([FromBody] CreateTagDto createTag)
        {
            var tagEntity = _mapper.Map<Tag>(createTag);
            var createdEntity = _unitOfWork.TagRepository.Create(tagEntity);
            _unitOfWork.Save();

            var entityToReturn = _mapper.Map<TagDto>(createdEntity);
            return CreatedAtRoute("GetTag", new { tagId = entityToReturn.Id }, entityToReturn);
        }

        [HttpPut("{tagId}")]
        public ActionResult UpdateTag(Guid tagId, UpdateTagDto updateTagDto)
        {
            var tagFromRepo = _unitOfWork.TagRepository.Find(tagId);
            if (tagFromRepo == null)
            {
                return NotFound();
            }
            _mapper.Map(updateTagDto, tagFromRepo);
            _unitOfWork.TagRepository.Update(tagFromRepo);
            _unitOfWork.Save();

            return NoContent();
        }

        [HttpDelete("{tagId}")]
        public ActionResult DeleteNews(Guid tagId)
        {
            var tagFromRepo = _unitOfWork.TagRepository.Find(tagId);
            if (tagFromRepo == null)
            {
                return NotFound();
            }
            _unitOfWork.TagRepository.Delete(tagFromRepo);
            _unitOfWork.Save();

            return NoContent();
        }

        public IActionResult GetNewsOptions()
        {
            Response.Headers.Add("Allow", "GET,OPTIONS,POST,DELETE,PUT,HEAD");
            return Ok();
        }
    }
}
