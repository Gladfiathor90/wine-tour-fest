import { eventService } from './eventService'
import { generalInfoService } from './generalInfoService'
import { gameSettingsService } from './gameSettingsService'
import { mapPointService } from './mapPointService'
import { newsService } from './newsService'
import { sponsorService } from './sponsorService'
import { wineryService } from './wineryService'
import { gastronomyDays } from '../data/demoData'

export const contentService = {
  wineries: wineryService,
  events: eventService,
  news: newsService,
  sponsors: sponsorService,
  mapPoints: mapPointService,
  generalInfo: generalInfoService,
  gameSettings: gameSettingsService,
  gastronomy: {
    demoList: () => gastronomyDays,
  },
}
