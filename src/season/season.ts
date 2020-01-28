import { SeasonStatus } from './seasonStatus'

export class Season {
  constructor(public id: string, public name: string, public status = SeasonStatus.Upcoming) {}
}

export function getExampleSeasons(): Season[] {
  const season1 = new Season('exampleId1', 'Example Season 1')
  const season2 = new Season('exampleId2', 'Example Season 2')
  const season3 = new Season('exampleId3', 'Example Season 3')
  season3.status = SeasonStatus.Finished
  const season4 = new Season('exampleId4', 'Example Season 4')
  season4.status = SeasonStatus.GroupStage
  return [season1, season2, season3, season4]
}
