import { Product } from '@prisma/client';
import joi from 'joi';
import { Categories } from '../globals/enums';
import { cpuSpecs, driveSpecs, gpuSpecs, keyboardSpecs, monitorSpecs, motherBoardSpecs, mouseSpecs, ramSpecs } from '../globals/types';

type generalSearchSchema = {
  category: string;
  minPrice: number;
  maxPrice: number;
  vendorId: number;
  isNew: boolean;
};

const cpuSpecsSearchSchema = joi.object<cpuSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.CPU).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  cores: joi
    .number()
    .integer()
    .valid(...[2, 4, 6, 8, 12, 16, 32, 64, 128]),
  threads: joi
    .number()
    .integer()
    .valid(...[2, 4, 6, 8, 12, 16, 32, 64, 128]),
  l1Cache: joi.number(),
  l2Cache: joi.number(),
  l3Cache: joi.number(),
  baseClock: joi.number().min(1).max(6),
  boostClock: joi.number().greater(joi.ref('baseClock')).max(6),
  architecture: joi.string().allow(...['x64', 'x32', 'x86']),
  socket: joi.string().min(1).max(10),
  integratedGraphics: joi.string()
});

const createOrUpdateCpuSpecsSchema = joi.object<cpuSpecs & { others: object }>({
  cores: joi
    .number()
    .integer()
    .valid(...[2, 4, 6, 8, 12, 16, 32, 64, 128])
    .required(),
  threads: joi
    .number()
    .integer()
    .valid(...[2, 4, 6, 8, 12, 16, 32, 64, 128])
    .required(),
  l1Cache: joi.number().required(),
  l2Cache: joi.number().required(),
  l3Cache: joi.number(),
  baseClock: joi.number().min(1).max(6).required(),
  boostClock: joi.number().greater(joi.ref('baseClock')).max(6),
  architecture: joi
    .string()
    .allow(...['x64', 'x32', 'x86'])
    .required(),
  socket: joi.string().min(1).max(10).required(),
  integratedGraphics: joi.string(),
  others: joi.object()
});

const gpuSpecsSearchSchema = joi.object<gpuSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.GPU).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  cores: joi.number().integer().min(100).max(100000),
  rops: joi.number(),
  memoryType: joi.string().allow(...['ddr3', 'ddr4', 'ddr5', 'ddr6']),
  memorySize: joi
    .number()
    .integer()
    .allow(...[2, 4, 6, 8, 12, 16, 32]),
  busWidth: joi.number()
});

const createOrUpdateGpuSpecsSchema = joi.object<gpuSpecs & { others: object }>({
  cores: joi.number().integer().min(100).max(100000).required(),
  rops: joi.number(),
  memoryType: joi
    .string()
    .allow(...['ddr3', 'ddr4', 'ddr5', 'ddr6'])
    .required(),
  memorySize: joi
    .number()
    .integer()
    .allow(...[2, 4, 6, 8, 12, 16, 32])
    .required(),
  busWidth: joi.number(),
  others: joi.object()
});

const ramSpecsSearchSchema = joi.object<ramSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.RAM).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  size: joi
    .number()
    .integer()
    .allow(...[2, 4, 8, 16, 32, 64, 128, 256]),
  speed: joi
    .number()
    .integer()
    .allow(...[800, 1066, 1333, 1600, 1866, 2133, 2400, 3000, 3200, 3466, 3600, 3733, 4000, 4133, 4266, 4400, 4600, 4800, 5000, 5200, 5600, 6000, 6200, 6400, 6600, 6800, 7200, 7600, 8000]),
  latency: joi.number().min(10).max(60),
  memoryType: joi.string().allow(...['ddr3', 'ddr4', 'ddr5'])
});

const CreateOrUpdateRamSpecsSchema = joi.object<ramSpecs & { others: object }>({
  size: joi
    .number()
    .integer()
    .allow(...[2, 4, 8, 16, 32, 64, 128, 256])
    .required(),
  speed: joi
    .number()
    .integer()
    .allow(...[800, 1066, 1333, 1600, 1866, 2133, 2400, 3000, 3200, 3466, 3600, 3733, 4000, 4133, 4266, 4400, 4600, 4800, 5000, 5200, 5600, 6000, 6200, 6400, 6600, 6800, 7200, 7600, 8000])
    .required(),
  latency: joi.number().min(10).max(60).required(),
  memoryType: joi
    .string()
    .allow(...['ddr3', 'ddr4', 'ddr5'])
    .required(),
  others: joi.object()
});

const motherBoardSpecsSearchSchema = joi.object<motherBoardSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.MOTHERBOARD).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  socket: joi.string(),
  memory: joi
    .number()
    .integer()
    .allow(...[2, 4, 8, 16, 32, 64, 128, 256]),
  lan: joi.string(),
  storage: joi.string(),
  usb: joi.string(),
  network: joi.string()
});

const CreateOrUpdateMotherBoardSpecsSchema = joi.object<motherBoardSpecs & { others: object }>({
  socket: joi.string().required(),
  memory: joi
    .number()
    .integer()
    .allow(...[2, 4, 8, 16, 32, 64, 128, 256])
    .required(),
  lan: joi.string(),
  storage: joi.string(),
  usb: joi.string(),
  network: joi.string(),
  others: joi.object()
});

const driveSpecsSearchSchema = joi.object<driveSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.DRIVE).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  size: joi
    .number()
    .integer()
    .allow(...[128, 256, 512, 1000, 2000, 4000]),
  readSpeed: joi.number().integer(),
  writeSpeed: joi.number().integer(),
  interface: joi.string().allow(...['sata', 'm.2']),
  cache: joi.number()
});

const CreateOrUpdateDriveSpecsSchema = joi.object<driveSpecs & { others: object }>({
  size: joi
    .number()
    .integer()
    .allow(...[128, 256, 512, 1000, 2000, 4000])
    .required(),
  type: joi.string().allow('hdd', 'sdd').required(),
  readSpeed: joi.number().integer().required(),
  writeSpeed: joi.number().integer().required(),
  interface: joi.string().allow(...['sata', 'm.2']),
  cache: joi.number(),
  others: joi.object()
});

const monitorSpecsSearchSchema = joi.object<monitorSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.MONITOR).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  size: joi.number(),
  resolution: joi.string(),
  panel: joi.string(),
  refreshRate: joi
    .number()
    .integer()
    .allow(...[50, 60, 75, 85, 100, 120, 144, 156, 180, 200, 240, 244, 280, 300, 360, 480]),
  brightness: joi.string(),
  colors: joi.string()
});

const CreateOrUpdateMonitorSpecsSchema = joi.object<monitorSpecs & { others: object }>({
  size: joi.number().required(),
  resolution: joi.string().required(),
  panel: joi.string().required(),
  refreshRate: joi
    .number()
    .integer()
    .allow(...[50, 60, 75, 85, 100, 120, 144, 156, 180, 200, 240, 244, 280, 300, 360, 480])
    .required(),
  brightness: joi.string(),
  colors: joi.string(),
  others: joi.object()
});

const mouseSpecsSearchSchema = joi.object<mouseSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.MOUSE).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  keysNo: joi.number().integer().min(2).max(20),
  isRgb: joi.boolean()
});

const CreateOrUpdateMouseSpecsSchema = joi.object<mouseSpecs & { others: object }>({
  keysNo: joi.number().integer().min(2).max(20).required(),
  isRgb: joi.boolean().required(),
  others: joi.object()
});

const keyboardSpecsSearchSchema = joi.object<keyboardSpecs & generalSearchSchema>({
  category: joi.string().allow(Categories.KEYBOARD).required(),
  minPrice: joi.number().integer().min(1),
  maxPrice: joi.number().integer().greater(joi.ref('minPrice')),
  vendorId: joi.number().integer().min(1),
  isNew: joi.bool(),
  keysNo: joi.number(),
  size: joi.number(),
  isMechanical: joi.boolean(),
  isRgb: joi.boolean(),
  usbVersion: joi.number()
});

const createOrUpdateKeyboardSpecsSchema = joi.object<keyboardSpecs & { others: object }>({
  keysNo: joi.number().required(),
  size: joi.number().required(),
  isMechanical: joi.boolean().required(),
  isRgb: joi.boolean(),
  usbVersion: joi.number(),
  others: joi.object()
});

export const searchProductsSchema = joi
  .alternatives()
  .try(cpuSpecsSearchSchema, gpuSpecsSearchSchema, ramSpecsSearchSchema, motherBoardSpecsSearchSchema, driveSpecsSearchSchema, monitorSpecsSearchSchema, mouseSpecsSearchSchema, keyboardSpecsSearchSchema);

export const updateProductSchema = joi.object<Omit<Product, 'id' | 'isDeleted' | 'vendorId' | 'isNew'>>({
  name: joi.string().min(3).max(100),
  desc: joi.string().min(10).max(200),
  stock: joi.number().integer().min(0),
  price: joi.number().greater(0),
  manufacturer: joi.string(),
  warranty: joi.number().integer().min(1).max(5),
  model: joi.string().min(1).max(30),
  year: joi.number().integer().min(2000).max(new Date().getFullYear()),
  category: joi.string().valid(...Object.keys(Categories)),
  specs: joi
    .alternatives()
    .try(
      createOrUpdateCpuSpecsSchema,
      createOrUpdateGpuSpecsSchema,
      CreateOrUpdateRamSpecsSchema,
      CreateOrUpdateMotherBoardSpecsSchema,
      CreateOrUpdateDriveSpecsSchema,
      CreateOrUpdateMonitorSpecsSchema,
      createOrUpdateKeyboardSpecsSchema,
      CreateOrUpdateMouseSpecsSchema
    )
});

export const createProductSchema = joi.object<Omit<Product, 'id'>>({
  name: joi.string().min(3).max(100).required(),
  desc: joi.string().min(10).max(200),
  stock: joi.number().integer().min(0).required(),
  price: joi.number().greater(0).required(),
  manufacturer: joi.string().required(),
  warranty: joi.number().integer().min(1).max(5).required(),
  model: joi.string().min(1).max(30).required(),
  year: joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
  category: joi
    .string()
    .valid(...Object.keys(Categories))
    .required(),
  specs: joi
    .alternatives()
    .try(
      createOrUpdateCpuSpecsSchema,
      createOrUpdateGpuSpecsSchema,
      CreateOrUpdateRamSpecsSchema,
      CreateOrUpdateMotherBoardSpecsSchema,
      CreateOrUpdateDriveSpecsSchema,
      CreateOrUpdateMonitorSpecsSchema,
      createOrUpdateKeyboardSpecsSchema,
      CreateOrUpdateMouseSpecsSchema
    )
    .required()
});
