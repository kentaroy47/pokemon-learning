import test from'node:test';
import assert from'node:assert/strict';
import{makeQuestions,clockSvg,KANJI,WORDS}from'../dist/drills.js';
const SUBJECTS=['math','calc','multiply','word','clock','lang'];
const calcOf=s=>Function(`return(${s.replace(/＋/g,'+').replace(/−/g,'-').replace(/×/g,'*').replace(/＝/g,'==')})`)();
const clockText=(h,m)=>`${h}じ${m?` ${m}ふん`:''}`,wrap12=h=>((h-1+12)%12)+1;
const chars=s=>Array.from(s),kata=s=>chars(s).map(c=>c>='ぁ'&&c<='ゖ'?String.fromCharCode(c.charCodeAt(0)+96):c).join('');
const keyOf=q=>`${q.text}|${q.h??''}:${q.m??''}|${[...q.options].sort()}`;
function checkQuestion(q){
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options.filter(o=>o===q.answer).length,1);assert.ok(q.hint);assert.ok(q.explain);
 // The equation(s) in the explanation are true, and the last one ends in the answer (except fill-in-the-blank, whose answer is the missing number).
 if(q.eq){const clauses=q.eq.split('、');for(const c of clauses)assert.ok(calcOf(c),`Wrong equation ${c}`);if(!['blank','seq','ten'].includes(q.variant))assert.equal(parseInt(q.answer),Number(clauses.at(-1).split('＝')[1]),`Answer disagrees with ${q.eq}`);}
 const first=q.text.split('\n')[0];
 if(q.kind==='calc'||q.kind==='multiply'){
  if(first.includes('？')&&first.includes('＝'))assert.ok(calcOf(first.replace('？',q.answer)),`Wrong answer for ${q.text}`);
  if(first.includes('□')&&first.includes('＝'))assert.ok(calcOf(first.replace('□',q.answer)),`Wrong blank for ${q.text}`);
  if(q.variant==='seq'){const n=q.text.split('\n')[1].split('→').map(x=>x.trim()).map(x=>x==='□'?Number(q.answer):Number(x));const d=n[1]-n[0];assert.ok(n.every((x,i)=>i===0||x-n[i-1]===d),`Not a sequence ${q.text}`);assert.ok(n.every(x=>x>=0));}
  if(q.variant==='bigger'){const o=q.options.map(Number);assert.equal(Number(q.answer),q.text.includes('おおきい')?Math.max(...o):Math.min(...o));}
  if(q.variant==='ten')assert.equal(Number(q.answer)+Number(q.text.match(/^(\d+)/)[1]),10);
  if(q.kind==='multiply'){assert.ok(q.a>=1&&q.a<=3&&q.b>=1&&q.b<=9);assert.equal(q.eq,`${q.a} × ${q.b} ＝ ${q.a*q.b}`);if(q.variant==='blank')assert.ok(q.hidePicture,'A fill-in-the-blank must not show its answer as a picture');}
 }
 if(q.kind==='word'){// the numbers in the first equation all come from the story
  const ops=q.eq.split('、')[0].split('＝')[0].match(/\d+/g);for(const o of ops)assert.ok(new RegExp(`(^|\\D)${o}(\\D|$)`).test(q.text),`${o} missing from "${q.text}"`);
 }
 if(q.kind==='clock'){const{h,m}=q,exp={read:clockText(h,m),after1:clockText(wrap12(h+1),m),before1:clockText(wrap12(h-1),m),after30:m===0?clockText(h,30):clockText(wrap12(h+1),0)}[q.variant];assert.equal(q.answer,exp);}
 if(q.kind==='lang'){
  const w=q.text.match(/「([^」]+)」/)?.[1];
  if(q.text.includes('はじめの もじ'))assert.equal(q.answer,chars(w)[0]);
  if(q.text.includes('おわりの もじ'))assert.equal(q.answer,chars(w).at(-1));
  if(/なんもじ/.test(q.text))assert.equal(q.answer,`${chars(w).length}もじ`);
  if(q.text.includes('を カタカナにすると'))assert.equal(q.answer,kata(w));
  if(q.text.startsWith('しりとり')){assert.equal(chars(q.answer)[0],chars(w).at(-1));assert.notEqual(chars(w).at(-1),'ん');}
  if(q.text.includes('の ＿に はいる もじ')){const cw=chars(w),full=chars(WORDS.find(x=>chars(x[0]).length===cw.length&&chars(x[0]).every((c,i)=>cw[i]==='＿'||cw[i]===c))[0]);assert.equal(full[cw.indexOf('＿')],q.answer);}
  const k=KANJI.find(x=>q.text===`「${x.k}」は なんと よむ？`);if(k)assert.equal(q.answer,k.r);
  const k2=KANJI.find(x=>q.text===`「${x.r}」を かんじで かくと？`);if(k2)assert.equal(q.answer,k2.k);
 }
}
test('all generated questions have exactly one correct choice, true equations and no repeats within a drill',()=>{
 for(let day=0;day<150;day++)for(const kind of SUBJECTS)for(const range of[10,20])for(const clock of['half','five']){
  const qs=makeQuestions(kind,16,`day-${day}`,{range,clock});assert.equal(qs.length,16);
  for(const q of qs)checkQuestion(q);
  assert.equal(new Set(qs.map(keyOf)).size,16,`Repeated question in ${kind} day-${day}`);
 }
});
test('kanji and word content is unambiguous',()=>{
 assert.equal(new Set(KANJI.map(k=>k.r)).size,KANJI.length,'duplicate reading');assert.equal(new Set(KANJI.map(k=>k.k)).size,KANJI.length,'duplicate kanji');
 assert.ok(KANJI.length>=60);assert.equal(new Set(WORDS.map(w=>w[0])).size,WORDS.length);assert.ok(WORDS.length>=50);
});
test('daily generation is reproducible, includes all four math topics and respects settings',()=>{
 assert.deepEqual(makeQuestions('math',12,'2026-10-10'),makeQuestions('math',12,'2026-10-10'));
 assert.deepEqual(makeQuestions('lang',12,'2026-10-10'),makeQuestions('lang',12,'2026-10-10'));
 for(const n of[8,12,16])assert.deepEqual(new Set(makeQuestions('math',n,'today').map(q=>q.kind)),new Set(['calc','multiply','word','clock']));
 assert.ok(makeQuestions('math',16,'tomorrow',{multiply:false}).every(q=>q.kind!=='multiply'));
 assert.equal(new Set(makeQuestions('lang',12,'today').map(q=>q.tag)).size,5);
 for(const q of makeQuestions('math',200,'range10',{range:10}).filter(q=>q.kind==='calc'||q.kind==='word'))assert.ok(q.value<=10,`${q.text} exceeds 10`);
 for(const q of makeQuestions('math',200,'range20',{range:20}).filter(q=>q.kind==='calc'||q.kind==='word'))assert.ok(q.value<=20&&q.value>=0);
});
test('questions are varied: many formats, shuffled order, and little repetition from day to day',()=>{
 const days=Array.from({length:30},(_,i)=>`2026-11-${i+1}`);
 const math=days.flatMap(d=>makeQuestions('math',12,d+'math-1')),lang=days.flatMap(d=>makeQuestions('lang',12,d+'lang-1'));
// Multiplication facts (27) and clock faces are small spaces that are meant to be practised repeatedly, so math allows more repeats than language.
 const ratio=qs=>new Set(qs.map(keyOf)).size/qs.length;
 assert.ok(ratio(math)>.75,`math repeats too much (${ratio(math)})`);assert.ok(ratio(lang)>.85,`lang repeats too much (${ratio(lang)})`);
 const variants=new Set(math.map(q=>`${q.kind}/${q.variant}`));assert.ok(variants.size>=20,`only ${variants.size} math formats`);
 assert.ok(new Set(math.filter(q=>q.kind==='word').map(q=>q.variant)).size>=9,'word problem templates');
 const orders=new Set(days.map(d=>makeQuestions('math',12,d).map(q=>q.kind).join()));assert.ok(orders.size>=10,'question order should not be a fixed cycle');
 const style=q=>`${q.tag}/${q.text.replace(/「[^」]*」/g,'').replace(/[\u{1F000}-\u{1FFFF}☀-➿️⭐]/gu,'').replace(/\s/g,'').slice(0,8)}`;
 const langStyles=new Set(lang.map(style));assert.ok(langStyles.size>=30,`only ${langStyles.size} language formats`);
});
test('multiplication covers all 1–3 times 1–9 facts across daily drills',()=>{
 const facts=new Set();for(let i=0;i<100;i++)for(const q of makeQuestions('multiply',16,i))facts.add(`${q.a}x${q.b}`);assert.equal(facts.size,27);
});
test('clock hour hand advances between hours and minute hand uses the actual minutes',()=>{
 const svg=clockSvg(3,30);assert.match(svg,/rotate\(105 120 120\)/);assert.match(svg,/rotate\(180 120 120\)/);
 assert.match(clockSvg(12,0),/rotate\(0 120 120\)/);
});
