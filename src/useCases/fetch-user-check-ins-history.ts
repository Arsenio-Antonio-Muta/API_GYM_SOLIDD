import { CheckinsRepository } from '@/repositories/check-ins-repository'
import { Checkin } from '@prisma/client'

interface FetchUserCheckInHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInHistoryUseCaseResponse {
  checkIns: Checkin[]
}

export class FetchUserCheckInHistoryUseCase {
  constructor(private checkinsRepository: CheckinsRepository) { }

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkinsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
