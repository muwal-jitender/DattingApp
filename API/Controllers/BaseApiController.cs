using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class BaseApiController : ControllerBase
    {
        public string Username
        {
            get { return User.FindFirst(ClaimTypes.NameIdentifier).Value; }
        }
    }
}