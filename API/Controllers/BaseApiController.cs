using System.Security.Claims;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[Controller]")]
    public class BaseApiController : ControllerBase
    {
        public string Username
        {
            get { return User.FindFirst(ClaimTypes.Name).Value; }
        }
    }
}