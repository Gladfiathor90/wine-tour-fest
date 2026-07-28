import { generalInfo } from '../data/demoData'
import type { GeneralInfo } from '../types/content'

export const generalInfoService = {
  get: async (): Promise<GeneralInfo> => generalInfo,
  demo: () => generalInfo,
}
