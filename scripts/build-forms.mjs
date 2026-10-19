// Regenerates dist/forms.js (Mega Evolution and Gigantamax forms) from PokeAPI.
// Run: node scripts/build-forms.mjs   (needs network; not part of the CI build)
import{writeFileSync}from'node:fs';
import{catalogSnapshot}from'../dist/catalog.js';
const API='https://pokeapi.co/api/v2/',get=async u=>{for(let i=0;i<4;i++){try{const r=await fetch(u);if(r.ok)return await r.json();}catch{}await new Promise(r=>setTimeout(r,500*(i+1)));}throw new Error('fetch failed '+u);};
const typesJa={normal:'ノーマル',fighting:'かくとう',flying:'ひこう',poison:'どく',ground:'じめん',rock:'いわ',bug:'むし',ghost:'ゴースト',steel:'はがね',fire:'ほのお',water:'みず',grass:'くさ',electric:'でんき',psychic:'エスパー',ice:'こおり',dragon:'ドラゴン',dark:'あく',fairy:'フェアリー'};
const list=(await get(API+'pokemon?offset=1025&limit=1000')).results.concat((await get(API+'pokemon?offset=10000&limit=1000')).results);
const wanted=list.filter((x,i,a)=>/-(mega|mega-[xyz]|gmax)$/.test(x.name)&&a.findIndex(y=>y.name===x.name)===i);
// PokeAPI has no Japanese names for these forms, so build them: メガ+name(+X/Y/Z) and キョダイ+name.
const variant={'meowstic-male-mega':'♂','meowstic-female-mega':'♀','tatsugiri-curly-mega':'そったすがた','tatsugiri-droopy-mega':'たれたすがた','tatsugiri-stretchy-mega':'のびたすがた','magearna-original-mega':'500ねんまえの いろ','toxtricity-amped-gmax':'ハイなすがた','toxtricity-low-key-gmax':'ローなすがた','urshifu-single-strike-gmax':'いちげきの かた','urshifu-rapid-strike-gmax':'れんげきの かた'};
function jaName(slug,base){const letter=slug.match(/-mega-([xyz])$/)?.[1]?.toUpperCase()||'',v=variant[slug];const core=(slug.includes('gmax')?'キョダイ':'メガ')+base+letter;return v?(v==='♂'||v==='♀'?core+v:`${core}（${v}）`):core;}
const ja=o=>o?.find(n=>n.language.name.toLowerCase()==='ja-hrkt')||o?.find(n=>n.language.name==='ja');
const out=[];
for(const {name,url} of wanted){
 const id=Number(url.match(/\/(\d+)\/$/)[1]),d=await get(url),sp=await get(d.species.url),base=catalogSnapshot.find(p=>p.id===sp.id);
 if(!base)throw new Error('No base species for '+name);
 const kind=name.includes('gmax')?'gmax':'mega';
 const art=d.sprites?.other?.['official-artwork']?.front_default;
 if(art){const h=await fetch(art,{method:'HEAD'});if(!h.ok)throw new Error('Missing artwork '+art);}
 out.push({id,slug:name,pokemonId:id,speciesId:sp.id,form:kind,name:jaName(name,base.name),baseName:base.name,genus:ja(sp.genera)?.genus||base.genus,type:d.types.sort((a,b)=>a.slot-b.slot).map(t=>typesJa[t.type.name]).join('・'),generation:base.generation,legendary:base.legendary,mythical:base.mythical,hasArtwork:!!art});
 console.log(id,name,out.at(-1).name,out.at(-1).type,art?'':'NO ARTWORK');
}
out.sort((a,b)=>a.id-b.id);
writeFileSync(new URL('../dist/forms.js',import.meta.url),'export const formSnapshot='+JSON.stringify(out)+';\n');
console.log('wrote',out.length,'forms');
