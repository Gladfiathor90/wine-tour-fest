type DetectedBarcode = {
  rawValue: string
}

type BarcodeDetectorOptions = {
  formats?: string[]
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions)
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>
}

interface Window {
  BarcodeDetector?: typeof BarcodeDetector
}
