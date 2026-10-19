import{readFileSync,writeFileSync}from'node:fs';
const read=p=>readFileSync(p,'utf8');
const css=read('dist/style.css').replace(/^@import[^\n]+\n/,'');
const js=['catalog','pokeapi','art','drills','learning-state','app'].map(n=>read(`dist/${n}.js`).replace(/^import[^\n]+\n/gm,'').replace(/\bexport (?=(?:const|function|async)\b)/g,'')).join('\n').replace("const buddyArt='assets/25.png';","const buddyArt='data:image/png;base64,"+readFileSync('dist/assets/25.png').toString('base64')+"';");
const icon='data:image/svg+xml,'+encodeURIComponent(read('dist/icon.svg'));
const html=read('index.template.html').replace('<link rel="stylesheet" href="style.css">',`<style>${css}</style>`).replace('<script type="module" src="app.js"></script>',`<script>(()=>{'use strict';\n${js}\n})();</script>`).replaceAll('src="icon.svg"',`src="${icon}"`).replaceAll('href="icon.svg"',`href="${icon}"`);
// Lessons and the Japanese catalog are embedded; Pokémon art and updates use PokeAPI.
writeFileSync('dist/index.html',html);
writeFileSync('dist/.nojekyll','');
if(process.env.STANDALONE_EXPORT_PATH)writeFileSync(process.env.STANDALONE_EXPORT_PATH,html);
console.log('Built self-contained app ('+Buffer.byteLength(html)+' bytes).');
