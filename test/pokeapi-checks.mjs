import assert from'node:assert/strict';
import{catalogSnapshot}from'../dist/catalog.js';
import{formSnapshot}from'../dist/forms.js';
const memory={};globalThis.localStorage={getItem:k=>memory[k]||null,setItem:(k,v)=>memory[k]=v};
const{pokemons,getPokemon,chooseEncounter,filterCatalog,loadPokemonDetails,refreshCatalog}=await import('../dist/pokeapi.js');
assert.equal(catalogSnapshot.length,1025);
assert.equal(new Set(catalogSnapshot.map(p=>p.id)).size,1025);
for(let id=1;id<=1025;id++){const p=getPokemon(id);assert.ok(p,`Missing species ${id}`);assert.ok(/[ァ-ヶぁ-ゖ]/.test(p.name),`Japanese name missing for ${id}`);assert.ok(p.type);assert.ok(p.pokemonId);}
assert.equal(getPokemon(25).name,'ピカチュウ');assert.equal(getPokemon(1025).name,'モモワロウ');
assert.equal(filterCatalog(pokemons,{query:'ぴかちゅう'})[0].id,25);
assert.equal(filterCatalog(pokemons,{query:'ﾋﾟｶﾁｭｳ'})[0].id,25);
assert.equal(filterCatalog(pokemons,{query:'1025'})[0].id,1025);
assert.equal(filterCatalog(pokemons,{query:'pecharunt'})[0].id,1025);
assert.equal(filterCatalog(pokemons,{filter:'caught'},new Set([25,1025])).length,2);
assert.equal(filterCatalog(pokemons,{filter:'unseen'},new Set([25,1025])).length,1025+formSnapshot.length-2);
assert.ok(filterCatalog(pokemons,{generation:'9'}).every(p=>p.generation===9));
// Every national species and every Mega/Gigantamax form can be selected; no duplicates before all are collected.
const TOTAL=1025+formSnapshot.length,owned=new Set();for(let i=0;i<TOTAL;i++){const id=chooseEncounter(pokemons,owned,()=>.731);assert.ok(!owned.has(id));owned.add(id);}assert.equal(owned.size,TOTAL);assert.ok(owned.has(chooseEncounter(pokemons,owned,()=>.8)));
assert.equal(chooseEncounter(pokemons,new Set(),()=>.999999),formSnapshot.at(-1).id);
const originalFetch=globalThis.fetch,calls=[];
globalThis.fetch=async url=>{calls.push(url);if(url.includes('pokemon-species/1025/'))return{ok:true,json:async()=>({id:1025,name:'pecharunt',names:[{language:{name:'ja-hrkt'},name:'モモワロウ'}],genera:[{language:{name:'ja-hrkt'},genus:'しはいポケモン'}],flavor_text_entries:[{language:{name:'ja-hrkt'},flavor_text:'テストの\nせつめい。'}]})};if(url.includes('pokemon/1025/'))return{ok:true,json:async()=>({species:{name:'pecharunt'},types:[{slot:1,type:{name:'poison'}},{slot:2,type:{name:'ghost'}}],sprites:{other:{'official-artwork':{front_default:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1025.png'}}}})};throw new Error('Unexpected request: '+url);};
let loaded=await loadPokemonDetails(1025,{force:true});assert.equal(loaded.name,'モモワロウ');assert.equal(loaded.type,'どく・ゴースト');assert.equal(loaded.note,'テストの せつめい。');assert.equal(calls.length,2);assert.ok(JSON.parse(memory['pokemon-pokeapi-metadata-v1'])['1025']);
await loadPokemonDetails(1025);assert.equal(calls.length,2,'Cached details avoid extra network calls');
globalThis.fetch=async()=>{throw new Error('offline');};assert.equal(await loadPokemonDetails(1,{force:true}),null);assert.equal(await refreshCatalog(),false);assert.equal(getPokemon(1).name,'フシギダネ');assert.equal(pokemons.length,TOTAL);
globalThis.fetch=async()=>({ok:true,json:async()=>({count:1026,next:null,results:[...catalogSnapshot.map(p=>({name:p.slug,url:`https://pokeapi.co/api/v2/pokemon-species/${p.id}/`})),{name:'new-species',url:'https://pokeapi.co/api/v2/pokemon-species/1026/'}]})});assert.equal(await refreshCatalog(),true);assert.ok(getPokemon(1026));assert.equal(pokemons.length,TOTAL+1);assert.equal(JSON.parse(memory['pokemon-pokeapi-new-species-v1'])[0].id,1026);
globalThis.fetch=originalFetch;
// Mega Evolution and Gigantamax forms.
const megas=formSnapshot.filter(f=>f.form==='mega'),gmaxes=formSnapshot.filter(f=>f.form==='gmax');
assert.ok(megas.length>=48&&gmaxes.length>=32,'All Mega Evolutions (incl. Legends Z-A) and Gigantamax forms');
assert.equal(new Set(formSnapshot.map(f=>f.id)).size,formSnapshot.length);assert.equal(new Set(formSnapshot.map(f=>f.name)).size,formSnapshot.length,'Form names are unique');
for(const f of formSnapshot){const p=getPokemon(f.id);assert.ok(p&&f.id>10000,`Form ${f.slug} is in the catalog`);assert.ok(catalogSnapshot.some(c=>c.id===f.speciesId),`Base species for ${f.slug}`);assert.ok(/[ァ-ヶ]/.test(p.name)&&p.type&&p.note,`Japanese name/type/note for ${f.slug}`);assert.equal(p.image,`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${f.id}.png`);}
assert.equal(getPokemon(10034).name,'メガリザードンX');assert.equal(getPokemon(10034).type,'ほのお・ドラゴン');assert.equal(getPokemon(10196).name,'キョダイリザードン');assert.equal(getPokemon(10199).name,'キョダイピカチュウ');
assert.equal(filterCatalog(pokemons,{form:'mega'}).length,megas.length);assert.equal(filterCatalog(pokemons,{form:'gmax'}).length,gmaxes.length);assert.equal(filterCatalog(pokemons,{form:'normal'}).length,pokemons.length-formSnapshot.length);
assert.equal(filterCatalog(pokemons,{query:'めがりざーどん'}).length,2);assert.equal(filterCatalog(pokemons,{query:'キョダイ'}).length,gmaxes.length);assert.equal(filterCatalog(pokemons,{query:'メガシンカ'}).length,megas.length);assert.equal(filterCatalog(pokemons,{query:'10034'}).length,0,'Form ids are not shown, so they are not searchable by number');
assert.equal(await loadPokemonDetails(10034),getPokemon(10034),'Forms need no network lookup');
console.log('PASS: 1,025 Japanese species plus Mega/Gigantamax forms, search/filters, all-species encounters, no duplicates, PokeAPI details/cache, offline fallback and future catalog expansion.');
