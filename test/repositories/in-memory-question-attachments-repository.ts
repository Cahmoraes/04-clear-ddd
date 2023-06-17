import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items = new ExtendedSet<QuestionAttachment>()

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .toArray()
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachmentList = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
    this.items = new ExtendedSet<QuestionAttachment>(questionAttachmentList)
  }
}
