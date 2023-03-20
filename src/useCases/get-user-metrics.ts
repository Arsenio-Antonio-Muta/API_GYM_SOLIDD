import { CheckinsRepository } from '@/repositories/check-ins-repository'
import { Checkin } from '@prisma/client'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkinsRepository: CheckinsRepository) { }

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkinsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
