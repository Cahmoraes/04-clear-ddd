import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items = new ExtendedSet<Notification>()

  async save(notification: Notification): Promise<void> {
    const existisNotification = await this.findById(notification.id.toString())
    if (!existisNotification) return
    this.items.delete(existisNotification)
    this.items.add(notification)
  }

  async findById(id: string): Promise<Notification | null> {
    return this.items.find((item) => item.id.toString() === id)
  }

  async create(question: Notification): Promise<void> {
    this.items.add(question)
  }
}
