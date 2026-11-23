// Script to generate valid PNG icon files for PWA (192x192 and 512x512)
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const toCrc = chunk.subarray(4, 8 + len);
  const crc = crc32(toCrc);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generatePng(size) {
  const width = size;
  const height = size;
  const rawBytes = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const center = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < height; y++) {
    rawBytes[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Squircle background corner radius
      const cornerR = size * 0.22;
      const rx = Math.max(0, Math.abs(dx) - (center - cornerR));
      const ry = Math.max(0, Math.abs(dy) - (center - cornerR));
      const isInside = Math.sqrt(rx * rx + ry * ry) <= cornerR;

      if (!isInside) {
        // Transparent
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        rawBytes[offset++] = 0;
        continue;
      }

      // Background color: Dark Slate #020617 to #0f172a
      let r = 2;
      let g = 6;
      let b = 23;
      let a = 255;

      // Draw dumbbell shape in center
      // Bar
      const inBar = Math.abs(dy) <= size * 0.025 && Math.abs(dx) <= size * 0.24;
      // Plates
      const inPlate1 = Math.abs(dx - size * 0.18) <= size * 0.035 && Math.abs(dy) <= size * 0.18;
      const inPlate2 = Math.abs(dx - size * 0.26) <= size * 0.025 && Math.abs(dy) <= size * 0.13;
      const inPlate3 = Math.abs(dx - size * 0.32) <= size * 0.018 && Math.abs(dy) <= size * 0.08;

      const inLeftPlate1 = Math.abs(dx + size * 0.18) <= size * 0.035 && Math.abs(dy) <= size * 0.18;
      const inLeftPlate2 = Math.abs(dx + size * 0.26) <= size * 0.025 && Math.abs(dy) <= size * 0.13;
      const inLeftPlate3 = Math.abs(dx + size * 0.32) <= size * 0.018 && Math.abs(dy) <= size * 0.08;

      // Pulse line
      const pulseY = center + size * 0.26;
      const inPulse = Math.abs(y - pulseY) <= size * 0.015 && Math.abs(dx) <= size * 0.32;

      if (inBar) {
        r = 226; g = 232; b = 240; // Slate 200
      } else if (inPlate1 || inLeftPlate1) {
        r = 16; g = 185; b = 129; // Emerald 500
      } else if (inPlate2 || inLeftPlate2) {
        r = 20; g = 184; b = 166; // Teal 500
      } else if (inPlate3 || inLeftPlate3) {
        r = 52; g = 211; b = 153; // Emerald 400
      } else if (inPulse) {
        r = 16; g = 185; b = 129; // Emerald pulse
      }

      rawBytes[offset++] = r;
      rawBytes[offset++] = g;
      rawBytes[offset++] = b;
      rawBytes[offset++] = a;
    }
  }

  const deflated = zlib.deflateSync(rawBytes, { level: 9 });

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const dir = 'C:/Users/Franz/.gemini/antigravity/scratch/fit-track-pwa/public';
fs.writeFileSync(path.join(dir, 'icon-192.png'), generatePng(192));
fs.writeFileSync(path.join(dir, 'icon-512.png'), generatePng(512));
fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), generatePng(180));
console.log('Generated icon-192.png, icon-512.png, and apple-touch-icon.png successfully!');
