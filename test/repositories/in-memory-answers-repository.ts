import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { DomainEvents } from '@/events/domain-events'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items = new ExtendedSet<Answer>()
  public ITEMS_PER_PAGE = 20

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    this.items.add(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    if (this.items.has(answer)) this.items.delete(answer)
    this.create(answer)
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .toArray()
      .slice((page - 1) * this.ITEMS_PER_PAGE, page * this.ITEMS_PER_PAGE)
  }

  async findById(id: string): Promise<Answer | null> {
    return this.items.find((i) => i.id.toString() === id)
  }

  async delete(answer: Answer): Promise<void> {
    this.items.delete(answer)
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
