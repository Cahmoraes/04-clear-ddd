import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items = new ExtendedSet<QuestionComment>()
  private ITEMS_PER_PAGE = 20

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .toArray()
      .slice((page - 1) * this.ITEMS_PER_PAGE, page * this.ITEMS_PER_PAGE)
  }

  async findById(questionId: string): Promise<QuestionComment | null> {
    return this.items.find((item) => item.id.toString() === questionId) ?? null
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    if (this.items.has(questionComment)) this.items.delete(questionComment)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.add(questionComment)
  }
}
