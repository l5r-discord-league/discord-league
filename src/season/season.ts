import { SeasonStatus } from './seasonStatus'

export class Season {
  constructor(public id: string, public name: string, public status = SeasonStatus.Upcoming) {}
}
