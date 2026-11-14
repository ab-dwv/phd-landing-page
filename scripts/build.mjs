import { mkdir, cp, copyFile } from 'node:fs/promises';
await mkdir('dist', {recursive:true});
for (const name of ['index.html','styles.css','app.js']) await copyFile(name, `dist/${name}`);
await cp('assets', 'dist/assets', {recursive:true});
console.log('Built static hero in dist/');
