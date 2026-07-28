import { mapPoints } from '../data/demoData'
import type { MapPoint } from '../types/content'
import { readWithFallback } from './fallback'

export const mapPointService = {
  list: () => readWithFallback<MapPoint>('map_points', mapPoints),
  demoList: () => mapPoints.filter((point) => point.active),
}
