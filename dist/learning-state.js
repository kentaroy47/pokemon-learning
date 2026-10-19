export const QUESTIONS_PER_CATCH=12;
export function upgradeLearningState(state){
 if(!Array.isArray(state.catches))state.catches=Object.entries(state.history||{}).flatMap(([date,h])=>(Array.isArray(h.pokemonIds)?h.pokemonIds:[h.pokemon]).filter(id=>Number.isInteger(id)&&id>0).map((pokemon,i)=>({id:`legacy-${date}-${i}`,pokemon,date,mode:'daily',caughtAt:h.completedAt||`${date}T12:00:00`})));
 if(!Number.isInteger(state.rewardProgress)||state.rewardProgress<0||state.rewardProgress>=QUESTIONS_PER_CATCH)state.rewardProgress=0;
 const s=state.session;if(s&&!s.rewardVersion){s.rewardVersion=2;s.id=s.id||`legacy-session-${s.mode}-${s.date}`;s.creditedThrough=s.index;s.catchIds=[];if(s.stage==='capture'||s.stage==='caught'){s.afterCaptureStage=s.index>=s.questions.length?(s.mode==='daily'?'daily-done':'practice-done'):s.mode==='daily'&&s.index===s.count?'break':'questions';s.captureId=`${s.id}:${s.index}:legacy`;if(s.stage==='caught'){const prior=state.catches.find(c=>c.date===s.date&&c.pokemon===s.reward);if(prior){s.captureId=prior.id;s.catchIds=[prior.id];s.historyRecorded=true;}}}}
 if(s?.stage==='daily-done'&&state.history[s.date])s.historyRecorded=true;
 return state;
}
export function newSessionFields(){return{rewardVersion:2,id:`session-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,creditedThrough:0,catchIds:[]};}
export function creditQuestion(state){const s=state.session;if(!s||s.creditedThrough>=s.index)return false;s.creditedThrough=s.index;state.rewardProgress++;if(state.rewardProgress>=QUESTIONS_PER_CATCH){state.rewardProgress=0;return true;}return false;}
export function capturedIds(state){return new Set(state.catches.map(c=>c.pokemon));}
export function registerCapture(state,now=new Date().toISOString()){
 const s=state.session;if(!s||!['capture','caught'].includes(s.stage)||!Number.isInteger(s.reward))return false;
 const id=s.captureId||`${s.id}:${s.index}`;let added=false;
 if(!state.catches.some(c=>c.id===id)){state.catches.push({id,pokemon:s.reward,date:s.date,mode:s.mode,sessionId:s.id,caughtAt:now});added=true;}
 if(!s.catchIds.includes(id))s.catchIds.push(id);s.captureId=id;s.stage='caught';return added;
}
export function finishLearningRecord(state,now=new Date().toISOString()){
 const s=state.session;if(!s||s.index<s.questions.length)return false;
 const prior=state.history[s.date];if(s.historyRecorded||prior?.sessionIds?.includes(s.id)){s.historyRecorded=true;return true;}
 const catches=state.catches.filter(c=>s.catchIds.includes(c.id));
 const previousIds=prior?.pokemonIds||[prior?.pokemon].filter(Boolean);
 const legacyDailyRuns=prior?(prior.dailyRuns??1):0;
 state.history[s.date]={...prior,pokemon:catches.at(-1)?.pokemon||prior?.pokemon||null,pokemonIds:[...previousIds,...catches.map(c=>c.pokemon)],seconds:(prior?.seconds||0)+s.seconds,questions:(prior?.questions||0)+s.questions.length,missed:(prior?.missed||0)+s.missed.length,mistakes:(prior?.mistakes||0)+s.mistakes,completedAt:now,dailyRuns:legacyDailyRuns+(s.mode==='daily'?1:0),questRuns:(prior?.questRuns||0)+(s.mode==='practice'?1:0),lastDailyCount:s.mode==='daily'?s.count:prior?.lastDailyCount,sessionIds:[...(prior?.sessionIds||[]),s.id]};
 s.historyRecorded=true;return true;
}
export function finishDailyRecord(state,now){return finishLearningRecord(state,now);}
export function makeBackup(state){return{app:'pokemon-learning',version:1,exportedAt:new Date().toISOString(),settings:state.settings,history:state.history,catches:state.catches,rewardProgress:state.rewardProgress};}
export function parseBackup(text){
 let data;try{data=JSON.parse(text);}catch{throw new Error('invalid-backup');}
 const plain=o=>o&&typeof o==='object'&&!Array.isArray(o);
 if(!plain(data)||data.app!=='pokemon-learning'||data.version!==1||!plain(data.history)||!Array.isArray(data.catches))throw new Error('invalid-backup');
 const catches=data.catches.filter(c=>plain(c)&&typeof c.id==='string'&&Number.isInteger(c.pokemon)&&c.pokemon>0&&typeof c.date==='string').map(c=>({...c}));
 return upgradeLearningState({settings:plain(data.settings)?data.settings:{},history:data.history,catches,rewardProgress:data.rewardProgress,session:null});
}
