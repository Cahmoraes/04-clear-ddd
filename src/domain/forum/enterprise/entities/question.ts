import dayjs from 'dayjs'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  slug: Slug
  title: string
  content: string
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

const THREE_DAYS = 3

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ): Question {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(aBestAnswerId: UniqueEntityID | undefined) {
    if (aBestAnswerId && aBestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, aBestAnswerId),
      )
    }
    this.props.bestAnswerId = aBestAnswerId
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  set title(aTitle: string) {
    this.props.title = aTitle
    this.props.slug = Slug.createFromText(aTitle)
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get excerpt(): string {
    return this.content.slice(0, 120).trim().concat('...')
  }

  get content() {
    return this.props.content
  }

  set content(aContent: string) {
    this.props.content = aContent
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= THREE_DAYS
  }
}
