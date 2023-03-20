import { InMemoryUsersRepository } from '@/repositories/In-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { expect, it, describe, beforeEach } from 'vitest'
import { UserAlreadyExists } from './errors/UserAlreadyExistsError'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase
describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('Should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Pedro',
      email: 'pedro@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Pedro',
      email: 'pedro@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not be able to register with same email', async () => {
    const email = 'canda@gmail.com'

    await sut.execute({
      name: 'Canda',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Canda',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})
