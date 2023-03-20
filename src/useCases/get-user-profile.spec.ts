import { InMemoryUsersRepository } from '@/repositories/In-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { expect, it, describe, beforeEach } from 'vitest'
import { ResourceNotFound } from './errors/ResourceNotFoundError'
import { GetUserProfileUseCase } from './get-user-profiler'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase
describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('Should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Pedro Chipungo',
      email: 'pedro@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Pedro Chipungo')
  })

  it('Should not be able to get user profile with wrong email', async () => {
    await expect(() =>
      sut.execute({ userId: 'not-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
