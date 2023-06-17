import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items = new ExtendedSet<AnswerAttachment>()

  async findManyByAnswerId(answerId: string) {
    return this.items
      .filter((item) => item.answerId.toString() === answerId)
      .toArray()
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
    this.items = new ExtendedSet(answerAttachments)
  }
}
