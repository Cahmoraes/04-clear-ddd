import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/events/domain-event'
import { Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt = new Date()

  constructor(public answer: Answer) {}

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
