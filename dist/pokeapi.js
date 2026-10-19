import{catalogSnapshot}from'./catalog.js';
import{formSnapshot}from'./forms.js';
export const API_ROOT='https://pokeapi.co/api/v2/';
export const FORM_LABELS={mega:'メガシンカ',gmax:'キョダイマックス'};
// Mega Evolution and Gigantamax forms are separate collectible entries keyed by their PokeAPI pokemon id (10001+).
const formNote=f=>f.form==='gmax'?`キョダイマックスした ${f.baseName}の すがただよ。`:`メガシンカした ${f.baseName}の すがただよ。`;
export const pokemons=[...catalogSnapshot.map(p=>({...p,note:`${p.genus}だよ。`})),...formSnapshot.map(f=>({...f,note:formNote(f),image:f.hasArtwork?artworkUrl(f.pokemonId):undefined}))];
const metadataKey='pokemon-pokeapi-metadata-v1',listKey='pokemon-pokeapi-new-species-v1';
const inflight=new Map();let detailCache={};
try{const cache=JSON.parse(localStorage.getItem(metadataKey)||'{}');if(cache&&typeof cache==='object'&&!Array.isArray(cache))detailCache=cache;const additions=JSON.parse(localStorage.getItem(listKey)||'[]');if(Array.isArray(additions))for(const p of additions)if(Number.isInteger(p.id)&&p.id>0&&!pokemons.some(x=>x.id===p.id))pokemons.push({...p});}catch{}
for(const p of pokemons){const saved=detailCache[p.id];if(saved&&saved.name)Object.assign(p,saved);}
pokemons.sort((a,b)=>a.id-b.id);
export function getPokemon(id){return pokemons.find(p=>p.id===Number(id));}
export function artworkUrl(id){return`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Number(id)}.png`;}
export function spriteUrl(id){return`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Number(id)}.png`;}
export function normalizeSearch(s){return String(s).normalize('NFKC').replace(/[ぁ-ゖ]/g,c=>String.fromCharCode(c.charCodeAt(0)+96)).replace(/\s/g,'').toLowerCase();}
export function filterCatalog(list,{query='',filter='all',generation='all',form='all'}={},owned=new Set()){
 const q=normalizeSearch(query);return list.filter(p=>(filter!=='caught'||owned.has(p.id))&&(filter!=='unseen'||!owned.has(p.id))&&(generation==='all'||p.generation===Number(generation))&&(form==='all'||(form==='normal'?!p.form:p.form===form))&&(!q||normalizeSearch(p.name).includes(q)||p.slug.includes(q)||normalizeSearch(FORM_LABELS[p.form]||'').includes(q)||(!p.form&&String(p.id).includes(q.replace(/^0+(?=\d)/,'')))));
}
export function chooseEncounter(list,owned,random=Math.random){const missing=list.filter(p=>!owned.has(p.id)),pool=missing.length?missing:list;if(!pool.length)return null;return pool[Math.min(pool.length-1,Math.floor(Math.max(0,random())*pool.length))].id;}
async function fetchApi(path){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),9000);try{const res=await fetch(API_ROOT+path,{signal:controller.signal,credentials:'omit'});if(!res.ok)throw new Error(`PokeAPI ${res.status}`);return await res.json();}finally{clearTimeout(timer);}}
const typesJa={normal:'ノーマル',fighting:'かくとう',flying:'ひこう',poison:'どく',ground:'じめん',rock:'いわ',bug:'むし',ghost:'ゴースト',steel:'はがね',fire:'ほのお',water:'みず',grass:'くさ',electric:'でんき',psychic:'エスパー',ice:'こおり',dragon:'ドラゴン',dark:'あく',fairy:'フェアリー'};
const safeArtwork=url=>typeof url==='string'&&url.startsWith('https://raw.githubusercontent.com/PokeAPI/sprites/')?url:null;
export async function loadPokemonDetails(id,{force=false}={}){
 const p=getPokemon(id);if(!p)return null;
 if(p.form)return p;// forms ship with their name, type and artwork; there is no species-level flavor text to fetch
 if(!force&&detailCache[id]?.fetchedAt&&Date.now()-detailCache[id].fetchedAt<7*86400000)return p;
 if(inflight.has(id))return inflight.get(id);
 const request=(async()=>{try{
  const [species,detail]=await Promise.all([fetchApi(`pokemon-species/${id}/`),fetchApi(`pokemon/${p.pokemonId||id}/`)]);
  if(species.id!==Number(id)||detail.species?.name!==species.name)throw new Error('Species mismatch');
  const name=species.names?.find(n=>n.language.name.toLowerCase()==='ja-hrkt')?.name||species.names?.find(n=>n.language.name==='ja')?.name||p.name;
  const genus=species.genera?.find(n=>n.language.name.toLowerCase()==='ja-hrkt')?.genus||p.genus;
  const flavor=species.flavor_text_entries?.find(n=>n.language.name.toLowerCase()==='ja-hrkt')?.flavor_text;
  const changes={name,genus,note:flavor?flavor.replace(/[\n\f\r]/g,' ').replace(/\s+/g,' '):`${genus||'ポケモン'}だよ。`,type:(detail.types||[]).sort((a,b)=>a.slot-b.slot).map(t=>typesJa[t.type.name]||t.type.name).join('・')||p.type,image:safeArtwork(detail.sprites?.other?.['official-artwork']?.front_default)||artworkUrl(p.pokemonId||id),fetchedAt:Date.now()};
  Object.assign(p,changes);detailCache[id]=changes;
  try{const entries=Object.entries(detailCache).sort((a,b)=>(b[1].fetchedAt||0)-(a[1].fetchedAt||0)).slice(0,200);detailCache=Object.fromEntries(entries);localStorage.setItem(metadataKey,JSON.stringify(detailCache));}catch{}
  return p;
 }catch{return null;}finally{inflight.delete(id);}})();inflight.set(id,request);return request;
}
export async function refreshCatalog(){
 try{let next='pokemon-species?limit=10000',all=[];for(let page=0;next&&page<20;page++){const data=await fetchApi(next);if(!Array.isArray(data.results))throw new Error('Invalid catalog');all.push(...data.results);next=data.next?.startsWith(API_ROOT)?data.next.slice(API_ROOT.length):null;if(all.length>=data.count)next=null;}
  for(const entry of all){const id=Number(entry.url?.match(/\/pokemon-species\/(\d+)\//)?.[1]);if(Number.isInteger(id)&&id>0&&!getPokemon(id))pokemons.push({id,pokemonId:id,slug:entry.name,name:`No. ${id}`,type:'しらべているよ',genus:'ポケモン',note:'ずかんを タップして なまえを しらべよう。',generation:0});}
  pokemons.sort((a,b)=>a.id-b.id);
  try{localStorage.setItem(listKey,JSON.stringify(pokemons.filter(p=>!p.form&&!catalogSnapshot.some(s=>s.id===p.id))));}catch{}
  return true;
 }catch{return false;}
}
