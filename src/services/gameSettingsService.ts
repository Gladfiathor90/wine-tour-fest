import { gameSettings } from '../data/demoData'
import type { GameSettings } from '../types/content'

export const gameSettingsService = {
  get: async (): Promise<GameSettings> => gameSettings,
  demo: () => gameSettings,
}
