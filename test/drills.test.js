import test from'node:test';
import assert from'node:assert/strict';
import{makeQuestions,clockSvg}from'../dist/drills.js';
test('all generated questions have exactly one correct choice and four unique options',()=>{
 for(let day=0;day<200;day++)for(const kind of['math','calc','multiply','word','clock','lang'])for(const range of[10,20])for(const clock of['half','five']){
  const qs=makeQuestions(kind,16,`day-${day}`,{range,clock});
  for(const q of qs){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options.filter(o=>o===q.answer).length,1);assert.ok(q.hint);assert.ok(q.explain);if(q.kind==='multiply'){assert.ok(q.a>=1&&q.a<=3);assert.ok(q.b>=1&&q.b<=9);assert.equal(Number(q.answer),q.a*q.b);}if(q.kind==='clock'){assert.ok(q.h>=1&&q.h<=12);assert.ok(q.m>=0&&q.m<60);assert.equal(q.m%5,0);}if(q.kind==='calc'){const [a,op,b]=q.text.split(' ');assert.equal(Number(q.answer),op==='＋'?Number(a)+Number(b):Number(a)-Number(b));assert.ok(Number(q.answer)>=0&&Number(q.answer)<=range);}}
 }
});
test('daily generation is reproducible, includes all four math topics and respects settings',()=>{
 assert.deepEqual(makeQuestions('math',12,'2026-10-10'),makeQuestions('math',12,'2026-10-10'));
 assert.deepEqual(new Set(makeQuestions('math',12,'today').map(q=>q.kind)),new Set(['calc','multiply','word','clock']));
 assert.ok(makeQuestions('math',16,'tomorrow',{multiply:false}).every(q=>q.kind!=='multiply'));
 assert.equal(new Set(makeQuestions('lang',12,'today').map(q=>q.tag)).size,5);
});
test('multiplication covers all 1–3 times 1–9 facts across daily drills',()=>{
 const facts=new Set();for(let i=0;i<100;i++)for(const q of makeQuestions('multiply',16,i))facts.add(`${q.a}x${q.b}`);assert.equal(facts.size,27);
});
test('clock hour hand advances between hours and minute hand uses the actual minutes',()=>{
 const svg=clockSvg(3,30);assert.match(svg,/rotate\(105 120 120\)/);assert.match(svg,/rotate\(180 120 120\)/);
 assert.match(clockSvg(12,0),/rotate\(0 120 120\)/);
});
