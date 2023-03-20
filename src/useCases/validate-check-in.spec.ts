import { InMemoryCheckInRepository } from '@/repositories/In-memory/in-memory-checkins-repository'
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { ResourceNotFound } from './errors/ResourceNotFoundError'
import { ValidateCheckinUseCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInRepository
let sut: ValidateCheckinUseCase
describe('Validate CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository()
    sut = new ValidateCheckinUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('Should be able to validate check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validate_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validate_at).toEqual(expect.any(Date))
  })

  it('Should not be able to validate an inexistent check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('Should not be able to validate the check in after 20 minutes of the creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
