import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

// Create a valid uncompressed/deflated PNG buffer
function createPng(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr.writeUInt8(8, 8) // bit depth: 8
  ihdr.writeUInt8(6, 9) // color type: 6 (RGBA)
  ihdr.writeUInt8(0, 10) // compression
  ihdr.writeUInt8(0, 11) // filter
  ihdr.writeUInt8(0, 12) // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr)

  // Raw image data with scanline filter 0
  const rowSize = 1 + width * 4
  const rawData = Buffer.alloc(rowSize * height)

  const radius = width * 0.22
  const cx = width / 2
  const cy = height / 2

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize
    rawData[rowOffset] = 0 // filter type None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4
      
      // Background color #557A46 (85, 122, 70)
      let pr = 85
      let pg = 122
      let pb = 70
      let pa = 255

      // Draw rounded center or letter block in white (255, 255, 255)
      // Letter R simplified block:
      const nx = x / width
      const ny = y / height
      
      // Stem of R: nx between 0.35 and 0.45, ny between 0.25 and 0.75
      const isStem = nx >= 0.32 && nx <= 0.44 && ny >= 0.25 && ny <= 0.75
      // Top bar: nx 0.32 to 0.65, ny 0.25 to 0.35
      const isTopBar = nx >= 0.32 && nx <= 0.65 && ny >= 0.25 && ny <= 0.35
      // Mid bar: nx 0.32 to 0.65, ny 0.45 to 0.55
      const isMidBar = nx >= 0.32 && nx <= 0.65 && ny >= 0.45 && ny <= 0.55
      // Right loop: nx 0.55 to 0.68, ny 0.25 to 0.55
      const isRightLoop = nx >= 0.55 && nx <= 0.68 && ny >= 0.25 && ny <= 0.55
      // Leg: diagonal nx - ny
      const isLeg = nx >= 0.48 && nx <= 0.68 && ny >= 0.52 && ny <= 0.75 && (nx - ny >= -0.15) && (nx - ny <= 0.05)

      if (isStem || isTopBar || isMidBar || isRightLoop || isLeg) {
        pr = 255
        pg = 255
        pb = 255
      }

      rawData[pixelOffset] = pr
      rawData[pixelOffset + 1] = pg
      rawData[pixelOffset + 2] = pb
      rawData[pixelOffset + 3] = pa
    }
  }

  const compressedData = zlib.deflateSync(rawData)
  const idatChunk = makeChunk('IDAT', compressedData)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function makeChunk(type, data) {
  const len = data.length
  const buf = Buffer.alloc(4 + 4 + len + 4)
  buf.writeUInt32BE(len, 0)
  buf.write(type, 4, 4, 'ascii')
  data.copy(buf, 8)

  const crc = crc32(buf.subarray(4, 8 + len))
  buf.writeUInt32BE(crc, 8 + len)
  return buf
}

// CRC32 implementation
function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff]
  }
  return (~c) >>> 0
}

const table = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
  }
  table[n] = c
}

// Ensure dir exists
const iconsDir = path.resolve('public/icons')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192, 85, 122, 70))
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512, 85, 122, 70))
console.log('Successfully generated public/icons/icon-192.png and icon-512.png!')
