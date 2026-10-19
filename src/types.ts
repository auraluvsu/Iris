export type CardStatus = 'urgent' | 'pressing' | 'lenient'
export type CardStage = 'todo' | 'inprogress' | 'done'

export interface Subcard {
  id: string
  title: string
  done: boolean
}

export interface LinkItem {
  id: string
  url: string
  title: string
}

export interface Card {
  id: string
  title: string
  desc: string
  status: CardStatus
  stage: CardStage
  subcards: Subcard[]
  links: LinkItem[]
  dueDate: string
  archivedAt?: string
}
