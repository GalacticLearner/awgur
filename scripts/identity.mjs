import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('resources',{recursive:true});
const mark = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" rx="200" fill="#17594e"/><path d="M280 280v464M744 280v464M280 512h464" fill="none" stroke="#f6f4eb" stroke-width="90" stroke-linecap="round"/><circle cx="512" cy="512" r="94" fill="#e9bf63"/><path d="m474 512 26 27 54-55" fill="none" stroke="#193b36" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
await sharp(Buffer.from(mark)).png().toFile('resources/icon.png');
await sharp({create:{width:2732,height:2732,channels:4,background:'#f6f4eb'}}).composite([{input:await sharp(Buffer.from(mark)).resize(620).png().toBuffer(),gravity:'centre'}]).png().toFile('resources/splash.png');
console.log('Authored route/check mark icon and paper splash.');
