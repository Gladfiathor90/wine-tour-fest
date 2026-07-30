import { eventService } from './eventService'
import { generalInfoService } from './generalInfoService'
import { gameSettingsService } from './gameSettingsService'
import { mapPointService } from './mapPointService'
import { newsService } from './newsService'
import { sponsorService } from './sponsorService'
import { checkInService } from './checkInService'
import { wineryService } from './wineryService'
import { gastronomyDays } from '../data/demoData'

export const contentService = {
  wineries: wineryService,
  events: eventService,
  news: newsService,
  sponsors: sponsorService,
  checkIns: checkInService,
  mapPoints: mapPointService,
  generalInfo: generalInfoService,
  gameSettings: gameSettingsService,
  gastronomy: {
    demoList: () => gastronomyDays,
  },
}
