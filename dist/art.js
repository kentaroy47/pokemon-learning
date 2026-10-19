import{getPokemon,artworkUrl}from'./pokeapi.js';
const buddyArt='assets/25.png';
const artEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function pokemon(id,cls=''){
 const p=getPokemon(id),pid=p?.pokemonId||Number(id),image=Number(id)===25?buddyArt:p?.image||artworkUrl(pid);
 return `<img class="pokemon ${cls}" src="${artEscape(image)}" data-pokemon-image="${pid}" alt="${artEscape(p?.name||'ポケモン')}" loading="${cls.includes('buddy')||cls.includes('stage-poke')?'eager':'lazy'}" decoding="async" width="240" height="240" referrerpolicy="no-referrer">`;
}
export const landscape=`<svg class="landscape" viewBox="0 0 520 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="435" cy="56" r="29" fill="#f7dc85"/><g fill="#fbfcf0"><ellipse cx="104" cy="44" rx="46" ry="14"/><ellipse cx="361" cy="87" rx="37" ry="12"/></g><path d="M-20 211Q75 113 187 193t170-35 183 33v180H0Z" fill="#d5e2bd"/><path d="M-10 247q123-86 231-20t151-18 170 39v120H0Z" fill="#bdd29e"/><path d="M-10 304Q147 224 300 278t253 6v70H0Z" fill="#a7c18c"/><g fill="#a5be8d"><path d="m58 148 38-80 37 80Z"/><path d="m442 183 33-82 33 82Z"/><path d="m394 191 21-56 21 56Z"/></g><g stroke="#83a76d" stroke-width="3" stroke-linecap="round"><path d="m44 266 0-12m0 12-7-7m7 7 8-8m364 40v-11m0 11-7-6m7 6 7-7m-305-1v-11m0 11-7-6m7 6 7-7"/></g><g fill="#f7f4d4"><circle cx="391" cy="276" r="4"/><circle cx="405" cy="288" r="4"/><circle cx="80" cy="248" r="4"/></g></svg>`;
