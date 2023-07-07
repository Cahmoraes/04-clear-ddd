import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  public async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.findAnswerById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.findQuestionById(answer.questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (!this.IsSameAuthorId(authorId, question)) {
      return left(new NotAllowedError())
    }

    await this.performChooseQuestionBestAnswer(answer, question)
    return right({ question })
  }

  private async findAnswerById(answerId: string) {
    return this.answersRepository.findById(answerId)
  }

  private async findQuestionById(questionId: UniqueEntityID) {
    return this.questionsRepository.findById(questionId.toString())
  }

  private IsSameAuthorId(authorId: string, aQuestion: Question) {
    return authorId === aQuestion.authorId.toString()
  }

  private async performChooseQuestionBestAnswer(
    anAnswer: Answer,
    aQuestion: Question,
  ) {
    aQuestion.bestAnswerId = anAnswer.id
    await this.questionsRepository.save(aQuestion)
  }
}
