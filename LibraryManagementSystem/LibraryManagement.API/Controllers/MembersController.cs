using LibraryManagement.API.Models;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly MemberService _service;

    public MembersController(MemberService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var members = await _service.GetAllAsync();
        return Ok(members);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var member = await _service.GetByIdAsync(id);

        if (member == null)
        {
            return NotFound(new { message = "Member not found" });
        }

        return Ok(member);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(Member member)
    {
        await _service.CreateAsync(member);

        return CreatedAtAction(
            nameof(GetById),
            new { id = member.Id },
            member
        );
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Member member)
    {
        var existingMember = await _service.GetByIdAsync(id);

        if (existingMember == null)
        {
            return NotFound(new { message = "Member not found" });
        }

        member.Id = id;
        await _service.UpdateAsync(id, member);

        return Ok(member);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var member = await _service.GetByIdAsync(id);

        if (member == null)
        {
            return NotFound(new { message = "Member not found" });
        }

        await _service.DeleteAsync(id);

        return Ok(new { message = "Member deleted successfully" });
    }
}
