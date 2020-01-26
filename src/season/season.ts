import { SeasonStatus } from './seasonStatus';

export class Season {
    constructor(public id: String, public name: String, public status = SeasonStatus.Upcoming) {}
  }

export function getExampleSeasons(): Season[] {
    let season1 = new Season("exampleId1", "Example Season 1")
    let season2 = new Season("exampleId2", "Example Season 2")
    return [season1, season2]
}