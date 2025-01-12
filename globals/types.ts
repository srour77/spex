export type cpuSpecs = {
  cores: number;
  threads: number;
  l1Cache: number;
  l2Cache: number;
  l3Cache?: number;
  baseClock: number;
  boostClock: number;
  architecture: string;
  socket: string;
  integratedGraphics?: string;
};

export type ramSpecs = {
  size: number;
  speed: number;
  latency: number;
  memoryType: string;
};

export type gpuSpecs = {
  cores: number;
  rops?: number;
  memoryType: string;
  memorySize: number;
  busWidth?: number;
};

export type motherBoardSpecs = {
  socket: string;
  memory: string;
  lan?: string;
  storage?: string;
  usb?: string;
  network?: string;
};

export type driveSpecs = {
  size: number;
  readSpeed: number;
  writeSpeed: number;
  interface: string;
  cache?: number;
};

export type monitorSpecs = {
  size: number;
  resolution: string;
  panel: string;
  refreshRate: number;
  brightness?: string;
  colors?: string;
};

export type mouseSpecs = {
  keysNo: number;
  isRgb: boolean;
};

export type keyboardSpecs = {
  keysNo: number;
  size: number;
  isMechanical: boolean;
  isRgb?: boolean;
  usbVersion?: number;
};
