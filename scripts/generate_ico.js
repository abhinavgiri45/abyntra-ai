import fs from 'fs';
import path from 'path';

const pngPath = path.resolve('public/logo.png');
const icoPath = path.resolve('public/logo.ico');
const downloadsIcoPath = path.resolve('public/downloads/app.ico');

if (fs.existsSync(pngPath)) {
  const pngData = fs.readFileSync(pngPath);
  
  // Create valid PNG-based Windows .ICO header
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(1, 4); // 1 Image
  
  // Image Entry
  header.writeUInt8(0, 6); // 256px width (0 means 256)
  header.writeUInt8(0, 7); // 256px height (0 means 256)
  header.writeUInt8(0, 8); // Color count
  header.writeUInt8(0, 9); // Reserved
  header.writeUInt16LE(1, 10); // Color planes
  header.writeUInt16LE(32, 12); // Bits per pixel
  header.writeUInt32LE(pngData.length, 14); // Image size in bytes
  header.writeUInt32LE(22, 18); // Offset to image data
  
  const icoData = Buffer.concat([header, pngData]);
  fs.writeFileSync(icoPath, icoData);
  fs.writeFileSync(downloadsIcoPath, icoData);
  console.log('✅ Generated valid Windows .ICO icon with Abyntra Logo:', icoData.length, 'bytes');
}
