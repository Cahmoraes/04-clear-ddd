import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id)
  }

  get title(): string {
    return this.props.title
  }

  get link(): string {
    return this.props.link
  }
}
