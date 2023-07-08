import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID(id)
    this.props = props
  }

  get id() {
    return this._id
  }

  equals(other: Entity<any>) {
    if (other === this) return this
    if (other.id === this._id) return true
    return false
  }
}
