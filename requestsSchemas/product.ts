import { Product } from '@prisma/client'
import joi from 'joi'
import { Categories } from '../globals/enums'
import { cpuSpecs, driveSpecs, gpuSpecs, keyboardSpecs, monitorSpecs, motherBoardSpecs, mouseSpecs, ramSpecs } from '../globals/types'

const cpuSpecsSchema = joi.object<cpuSpecs>({
    cores: joi.number().integer().valid(...[2, 4, 6, 8, 12, 16, 32, 64, 128]).required(),
    threads: joi.number().integer().valid(...[2, 4, 6, 8, 12, 16, 32, 64, 128]).required(),
    l1Cache: joi.number().required(),
    l2Cache: joi.number().required(),
    l3Cache: joi.number(),
    baseClock: joi.number().min(1).max(6).required(),
    boostClock: joi.number().greater(joi.ref('baseClock')).max(6),
    architecture: joi.string().allow(...['x64', 'x32', 'x86']).required(),
    socket: joi.string().required().min(1).max(10),
    integratedGraphics: joi.string()
})

const gpuSpecsSchema = joi.object<gpuSpecs>({
    cores: joi.number().integer().min(100).max(100000).required(),
    rops: joi.number(),
    memoryType: joi.string().allow(...['ddr3', 'ddr4', 'ddr5', 'ddr6']).required(),
    memorySize: joi.number().integer().allow(...[2, 4, 6, 8, 12, 16, 32]),
    busWidth: joi.number()
})

const ramSpecsSchema = joi.object<ramSpecs>({
    size: joi.number().integer().allow(...[2, 4, 8, 16, 32, 64, 128, 256]).required(),
    speed: joi.number().integer().allow(...[800, 1066, 1333, 1600, 1866, 2133, 2400, 3000, 3200, 3466, 3600, 3733, 4000, 4133, 4266, 4400, 4600, 4800, 5000, 5200, 5600, 6000, 6200, 6400, 6600, 6800, 7200, 7600, 8000]).required(),
    latency: joi.number().min(10).max(60).required(),
    memoryType: joi.string().allow(...['ddr3', 'ddr4', 'ddr5']).required(),
})

const motherBoardSpecsSchema = joi.object<motherBoardSpecs>({
    socket: joi.string().required(),
    memory: joi.number().integer().allow(...[2, 4, 8, 16, 32, 64, 128, 256]).required(),
    lan: joi.string(),
    storage: joi.string(),
    usb: joi.string(),
    network: joi.string(),
})

const driveSpecsSchema = joi.object<driveSpecs>({
    size: joi.number().integer().allow(...[128, 256, 512, 1000, 2000, 4000]).required(),
    readSpeed: joi.number().integer().required(),
    writeSpeed: joi.number().integer().required(),
    interface: joi.string().allow(...['sata', 'm.2']).required(),
    cache: joi.number(),
})

const monitorSpecsSchema = joi.object<monitorSpecs>({
    size: joi.number().required(),
    resolution: joi.string().required(),
    panel: joi.string().required(),
    refreshRate: joi.number().integer().allow(...[50, 60, 75, 85, 100, 120, 144, 156, 180, 200, 240, 244, 280, 300, 360, 480]).required(),
    brightness: joi.string(),
    colors: joi.string(),
})

const mouseSpecsSchema = joi.object<mouseSpecs>({
    keysNo: joi.number().integer().min(2).max(20).required(),
    isRgb: joi.boolean()
})

const keyboardSpecsSchema = joi.object<keyboardSpecs>({
    keysNo: joi.number().required(),
    size: joi.number().required(),
    isMechanical: joi.boolean().required(),
    isRgb: joi.boolean(),
    usbVersion: joi.number(),
})

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
    specs: joi.alternatives().try(cpuSpecsSchema, gpuSpecsSchema, ramSpecsSchema, motherBoardSpecsSchema, driveSpecsSchema, monitorSpecsSchema, mouseSpecsSchema, keyboardSpecsSchema)
})
