import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items = new ExtendedSet<AnswerComment>()
  private ITEMS_PER_PAGE = 20

  async findManyByAnswerId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    return this.items
      .filter((item) => item.answerId.toString() === questionId)
      .toArray()
      .slice((page - 1) * this.ITEMS_PER_PAGE, page * this.ITEMS_PER_PAGE)
  }

  async findById(answerId: string): Promise<AnswerComment | null> {
    return (
      this.items.find((answer) => answer.id.toString() === answerId) ?? null
    )
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    if (this.items.has(answerComment)) this.items.delete(answerComment)
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.add(answerComment)
  }
}
