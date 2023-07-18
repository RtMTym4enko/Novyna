using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Novyna.Data;
using Novyna.Data.Entities;
using Novyna.Model;
using System.Linq.Expressions;

namespace Novyna.Controllers
{
    [Route("api/news")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public NewsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        [HttpHead]
        public ActionResult<IEnumerable<NewsDto>> GetNews([FromQuery]string tags = null)
        {
            Expression<Func<News, bool>>? filter = tags == null ? null : (News n) => n.Tags.Any(t => t.Name == tags);
            var news = _unitOfWork.NewsRepository.Get(filter);
            var dtos = _mapper.Map<IEnumerable<NewsDto>>(news);
            return Ok(dtos);
        }

        [HttpGet("{newsId:guid}", Name = "GetNews")]
        [HttpHead]
        public ActionResult<NewsDto> GetNews(Guid newsId)
        {
            var fromRepo = _unitOfWork.NewsRepository.Find(newsId);
            return fromRepo != null ? Ok(_mapper.Map<NewsDto>(fromRepo)) : NotFound();
        }

        [HttpPost]
        public ActionResult<NewsDto> CreateNews([FromBody]CreateNewsDto createNews)
        {
            var newsEntity = _mapper.Map<News>(createNews);
            var createdEntity = _unitOfWork.NewsRepository.Create(newsEntity);
            _unitOfWork.Save();

            var entityToReturn = _mapper.Map<NewsDto>(createdEntity);
            return CreatedAtRoute("GetNews", new { newsId = entityToReturn.Id }, entityToReturn);
        }

        [HttpPut("{newsId}")]
        public ActionResult UpdateNews(Guid newsId, UpdateNewsDto updatedNewsDto)
        {
            var newsFromRepo = _unitOfWork.NewsRepository.Find(newsId);
            if (newsFromRepo == null)
            {
                return NotFound();
            }
            var updatedNews = _mapper.Map(updatedNewsDto, newsFromRepo);
            _unitOfWork.NewsRepository.Update(updatedNews);
            _unitOfWork.Save();

            return NoContent();
        }

        [HttpDelete("{newsId}")]
        public ActionResult DeleteNews(Guid newsId)
        {
            var newsFromRepo = _unitOfWork.NewsRepository.Find(newsId);
            if (newsFromRepo == null)
            {
                return NotFound();
            }
            _unitOfWork.NewsRepository.Delete(newsFromRepo);
            _unitOfWork.Save();

            return NoContent();
        }

        [HttpOptions]
        public IActionResult GetNewsOptions()
        {
            Response.Headers.Add("Allow", "GET,OPTIONS,POST,DELETE,PUT,HEAD");
            return Ok();
        }
    }
}
