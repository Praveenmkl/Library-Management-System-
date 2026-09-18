using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;

namespace LibraryManagement.API.Services;

public class MemberService
{
    private readonly MemberRepository _repository;

    public MemberService(MemberRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Member>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Member?> GetByIdAsync(string id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task CreateAsync(Member member)
    {
        await _repository.CreateAsync(member);
    }

    public async Task UpdateAsync(string id, Member member)
    {
        await _repository.UpdateAsync(id, member);
    }

    public async Task DeleteAsync(string id)
    {
        await _repository.DeleteAsync(id);
    }
}
