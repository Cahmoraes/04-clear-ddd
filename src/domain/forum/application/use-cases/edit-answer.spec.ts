import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachments'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items
      .add(
        makeAnswerAttachment({
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID('1'),
        }),
      )
      .add(
        makeAnswerAttachment({
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID('2'),
        }),
      )

    await sut.execute({
      authorId: 'author-1',
      content: 'Conteúdo Teste',
      answerId: newAnswer.id.toString(),
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryAnswersRepository.items.size).toBe(1)

    expect(inMemoryAnswersRepository.items.toArray()[0]).toMatchObject({
      content: 'Conteúdo Teste',
    })

    expect(
      inMemoryAnswersRepository.items.toArray()[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(
      inMemoryAnswersRepository.items.toArray()[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
    const newQuestion = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryAnswersRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      content: 'Conteúdo Teste',
      answerId: newQuestion.id.toString(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
