import assert from'node:assert/strict';
import{upgradeLearningState,newSessionFields,creditQuestion,registerCapture,capturedIds,finishDailyRecord,finishLearningRecord}from'../dist/learning-state.js';
const session=(mode='daily',n=24)=>({...newSessionFields(),mode,date:'2026-10-11',questions:Array(n).fill({}),index:0,count:n/2,stage:'questions',seconds:900,missed:[],mistakes:0});
let db=upgradeLearningState({history:{'2026-10-10':{pokemon:25,questions:24,seconds:900}},session:session()});
assert.equal(db.catches.length,1);assert.ok(capturedIds(db).has(25));assert.equal(db.rewardProgress,0);
function clear(n){let due=0;for(let i=0;i<n;i++){db.session.index++;if(creditQuestion(db))due++;assert.equal(creditQuestion(db),false,'A completed question cannot count twice');}return due;}
assert.equal(clear(11),0);assert.equal(db.rewardProgress,11);assert.equal(clear(1),1);assert.equal(db.rewardProgress,0);
Object.assign(db.session,{stage:'capture',reward:133,captureId:`${db.session.id}:12`});
// Reload while a catch is pending, then retry the same catch: one durable entry.
db=upgradeLearningState(JSON.parse(JSON.stringify(db)));assert.equal(registerCapture(db),true);assert.equal(registerCapture(db),false);assert.equal(db.catches.length,2);assert.ok(capturedIds(db).has(133));assert.equal(db.history['2026-10-11'],undefined,'Daily completion is separate from a mid-session catch');
db.session.stage='questions';assert.equal(clear(12),1);Object.assign(db.session,{stage:'capture',reward:1025,captureId:`${db.session.id}:24`});assert.equal(registerCapture(db),true);assert.equal(finishDailyRecord(db),true);assert.deepEqual(db.history['2026-10-11'].pokemonIds,[133,1025]);assert.equal(db.history['2026-10-11'].questions,24);assert.equal(db.catches.length,3);assert.equal(finishDailyRecord(db),true);assert.equal(db.catches.length,3);
// Remainders survive day/session changes and practice also contributes.
db.session=session('practice',5);assert.equal(clear(5),0);assert.equal(db.rewardProgress,5);db=upgradeLearningState(JSON.parse(JSON.stringify(db)));db.session=session('practice',5);assert.equal(clear(5),0);assert.equal(db.rewardProgress,10);db.session=session('daily',16);assert.equal(clear(2),1);assert.equal(db.rewardProgress,0);
const legacy=upgradeLearningState({history:{'2026-10-10':{pokemon:25,questions:24,seconds:900}},session:{mode:'daily',date:'2026-10-10',stage:'caught',reward:25,index:24,count:12,questions:Array(24).fill({}),missed:[],mistakes:0,seconds:900}});assert.equal(legacy.session.afterCaptureStage,'daily-done');assert.equal(registerCapture(legacy),false);assert.equal(legacy.catches.length,1);
const pending=upgradeLearningState({history:{},session:{mode:'daily',date:'2026-10-11',stage:'capture',reward:7,index:24,count:12,questions:Array(24).fill({}),missed:[],mistakes:0,seconds:900}});assert.equal(registerCapture(pending),true);assert.equal(registerCapture(pending),false);assert.equal(pending.catches.length,1);
console.log('PASS: catches at questions 12/24, reload persistence, no duplicate claims, legacy collection and pending-catch migration, daily records, carry-over and practice progress.');

// Repeatable quests and daily drills accumulate on the same date exactly once.
db=upgradeLearningState({history:{},session:null});
for(let run=0;run<3;run++){
 db.session=session('practice',12);assert.equal(clear(12),1);
 Object.assign(db.session,{stage:'capture',reward:run+1,captureId:`${db.session.id}:12`});
 assert.equal(registerCapture(db),true);assert.equal(finishLearningRecord(db),true);
 assert.equal(finishLearningRecord(db),true);db=upgradeLearningState(JSON.parse(JSON.stringify(db)));
 assert.equal(finishLearningRecord(db),true);
 assert.equal(db.history['2026-10-11'].questRuns,run+1);
 assert.equal(db.history['2026-10-11'].questions,(run+1)*12);
 assert.equal(db.history['2026-10-11'].dailyRuns,0);
 assert.equal(db.catches.length,run+1);
}
for(let run=0;run<2;run++){
 db.session=session();for(let block=0;block<2;block++){
  assert.equal(clear(12),1);Object.assign(db.session,{stage:'capture',reward:10+run*2+block,captureId:`${db.session.id}:${db.session.index}`});assert.equal(registerCapture(db),true);db.session.stage='questions';
 }
 assert.equal(finishLearningRecord(db),true);assert.equal(finishLearningRecord(db),true);
}
assert.equal(db.history['2026-10-11'].questions,84);
assert.equal(db.history['2026-10-11'].dailyRuns,2);
assert.equal(db.history['2026-10-11'].questRuns,3);
assert.equal(db.history['2026-10-11'].pokemonIds.length,7);
assert.equal(db.history['2026-10-11'].sessionIds.length,5);
assert.equal(db.catches.length,7);assert.equal(db.rewardProgress,0);
assert.equal(finishLearningRecord(legacy),true);assert.equal(legacy.history['2026-10-10'].questions,24);
console.log('PASS: unlimited same-day quests/daily replays, accumulated history, reload idempotence, old completion preserved.');
