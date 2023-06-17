import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items = new ExtendedSet<Question>()
  public ITEMS_PER_PAGE = 20

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async save(question: Question): Promise<void> {
    if (this.items.has(question)) this.items.delete(question)
    this.create(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    return this.items
      .toArray()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * this.ITEMS_PER_PAGE, page * this.ITEMS_PER_PAGE)
  }

  async findById(id: string): Promise<Question | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((i) => i.slug.value === slug) ?? null
  }

  async create(question: Question): Promise<void> {
    this.items.add(question)
  }

  async delete(question: Question): Promise<void> {
    this.items.delete(question)
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
