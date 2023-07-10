import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt = new Date()
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question
    this.bestAnswerId = bestAnswerId
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
