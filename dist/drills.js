export function rng(seed){let s=2166136261;for(const c of String(seed))s=Math.imul(s^c.charCodeAt(0),16777619);return()=>{s+=0x6D2B79F5;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
export function shuffle(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function numberOptions(answer,r,format=String){const pool=[answer];for(let d=1;pool.length<4;d++){if(answer-d>=0)pool.push(answer-d);if(pool.length<4)pool.push(answer+d);}return shuffle(pool,r).map(format);}
const animal=n=>`${n}${[0,1,6,8].includes(n%10)?'ぴき':n%10===3?'びき':'ひき'}`;
const langBank=[
 ['ひらがな','「あめ」の はじめの もじは？','あ',['あ','め','ま','ぬ'],'「あ・め」と ゆっくり よんでみよう。'],
 ['ひらがな','「さかな」の まんなかの もじは？','か',['さ','か','な','に'],'「さ・か・な」の 2ばんめだよ。'],
 ['ひらがな','「ねこ」の おわりの もじは？','こ',['ね','こ','の','め'],'「ね・こ」の さいごを よんでみよう。'],
 ['ひらがな','「くるま」の はじめの もじは？','く',['く','る','ま','つ'],'「く・る・ま」の 1ばんめだよ。'],
 ['ひらがな','「りんご」の おわりの もじは？','ご',['り','ん','こ','ご'],'「ご」には てんてんが つくよ。'],
 ['ひらがな','🐸 この いきものの なまえは？','かえる',['かえる','かえろ','かえり','かいる'],'「か・え・る」と よむよ。'],
 ['ひらがな','🌸 この はなの なまえは？','さくら',['さくら','さくろ','さこら','さくらん'],'はるに さく「さ・く・ら」だよ。'],
 ['ひらがな','「いぬ」は なんもじ？','2もじ',['1もじ','2もじ','3もじ','4もじ'],'「い」と「ぬ」を ゆびで かぞえよう。'],
 ['ひらがな','「ひこうき」は なんもじ？','4もじ',['2もじ','3もじ','4もじ','5もじ'],'「ひ・こ・う・き」。ひとつずつ かぞえよう。'],
 ['ひらがな','「きって」の まんなかは？','ちいさい「っ」',['おおきい「つ」','ちいさい「っ」','ちいさい「ゃ」','ちいさい「ょ」'],'「きっ」で いったん おとを とめるよ。'],
 ['カタカナ','「あ」を カタカナにすると？','ア',['ア','イ','ウ','エ'],'「ア」は「あ」と おなじ おとだよ。'],
 ['カタカナ','「い」を カタカナにすると？','イ',['ア','イ','エ','オ'],'「イ」は「い」と おなじ おとだよ。'],
 ['カタカナ','「か」を カタカナにすると？','カ',['カ','サ','タ','ナ'],'「カ」は「か」と おなじ おとだよ。'],
 ['カタカナ','「ねこ」を カタカナにすると？','ネコ',['ネコ','ネロ','メコ','ネカ'],'「ね」は「ネ」、「こ」は「コ」だよ。'],
 ['カタカナ','「いぬ」を カタカナにすると？','イヌ',['イヌ','イネ','アヌ','イノ'],'「い」は「イ」、「ぬ」は「ヌ」だよ。'],
 ['カタカナ','「ピカチュウ」の はじめは？','ピ',['ピ','カ','チュ','ウ'],'「ピ・カ・チュ・ウ」と よんでみよう。'],
 ['カタカナ','「ゼニガメ」の おわりは？','メ',['ゼ','ニ','ガ','メ'],'「ゼ・ニ・ガ・メ」の さいごだよ。'],
 ['かんじ','「山」は なんと よむ？','やま',['やま','かわ','そら','もり'],'たかく そびえる「やま」だよ。'],
 ['かんじ','「川」は なんと よむ？','かわ',['やま','かわ','いけ','うみ'],'みずが ながれる「かわ」だよ。'],
 ['かんじ','「月」は なんと よむ？','つき',['ひ','つき','ほし','そら'],'よるの そらに みえる「つき」だよ。'],
 ['かんじ','「木」は なんと よむ？','き',['き','くさ','はな','もり'],'えだと はっぱが ある「き」だよ。'],
 ['かんじ','「水」は なんと よむ？','みず',['ひ','みず','つち','いし'],'のんだり ながれたりする「みず」だよ。'],
 ['かんじ','「火」は なんと よむ？','ひ',['ひ','みず','つき','き'],'あかく もえる「ひ」だよ。'],
 ['かんじ','「犬」は なんと よむ？','いぬ',['いぬ','ねこ','とり','むし'],'「わんわん」と なく「いぬ」だよ。'],
 ['かんじ','「一」は いくつ？','1',['1','2','3','4'],'よこぼうが ひとつだよ。'],
 ['かんじ','「三」は いくつ？','3',['1','2','3','4'],'よこぼうが みっつだよ。'],
 ['かんじ','「五」は いくつ？','5',['3','4','5','6'],'「いち・に・さん・し・ご」の ごだよ。'],
 ['かんじ','「七」は いくつ？','7',['5','6','7','8'],'「なな」とも よむよ。'],
 ['かんじ','「上」は なんと よむ？','うえ',['うえ','した','なか','そと'],'あたまの ほうは「うえ」だよ。'],
 ['かんじ','「下」は なんと よむ？','した',['うえ','した','なか','そと'],'あしの ほうは「した」だよ。'],
 ['ことば','「おおきい」の はんたいは？','ちいさい',['ちいさい','ながい','たかい','あかい'],'おおきい ものと、ちいさい ものを くらべよう。'],
 ['ことば','「ながい」の はんたいは？','みじかい',['みじかい','ちいさい','ひくい','おもい'],'ながい えんぴつと、みじかい えんぴつだよ。'],
 ['ことば','「あつい」の はんたいは？','つめたい',['つめたい','おおきい','はやい','やわらかい'],'あつい おちゃと、つめたい おちゃだよ。'],
 ['ことば','「はやい」の はんたいは？','おそい',['おそい','ひくい','ながい','ひろい'],'はやく はしる。ゆっくり おそく はしる。'],
 ['ぶんを よもう','ピカチュウは きのみを たべました。\nなにを たべた？','きのみ',['きのみ','りんご','パン','みかん'],'「たべました」の まえを よんでみよう。'],
 ['ぶんを よもう','イーブイが こうえんで あそびました。\nどこで あそんだ？','こうえん',['こうえん','いえ','がっこう','やま'],'「で」の まえに ばしょが かいてあるよ。'],
 ['ぶんを よもう','ゼニガメと ヒトカゲが さんぽしました。\nだれと だれが さんぽした？','ゼニガメと ヒトカゲ',['ゼニガメと ヒトカゲ','ピカチュウと イーブイ','プリンと コダック','ゼニガメと プリン'],'「さんぽしました」の まえの なまえを よもう。'],
 ['ぶんを よもう','あさ、プリンは うたを うたいました。\nいつ うたった？','あさ',['あさ','ひる','ゆうがた','よる'],'ぶんの はじめに「いつ」が かいてあるよ。'],
 ['ぶんを よもう','フシギダネは あかい はなを みつけました。\nはなは なにいろ？','あか',['あか','あお','きいろ','しろ'],'「はな」の まえの いろを よもう。'],
 ['ぶんを よもう','コダックは あめなので かさを さしました。\nなぜ かさを さした？','あめだから',['あめだから','あついから','ねむいから','はれだから'],'「なので」の まえに りゆうが あるよ。']
];
// ---- Question content ------------------------------------------------------
const toKata=s=>Array.from(s,c=>c>='ぁ'&&c<='ゖ'?String.fromCharCode(c.charCodeAt(0)+96):c).join('');
const toHira=s=>Array.from(s,c=>c>='ァ'&&c<='ヶ'?String.fromCharCode(c.charCodeAt(0)-96):c).join('');
const KANA=Array.from('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'),KATA=KANA.map(toKata);
const SMALL=new Set(Array.from('ゃゅょっぁぃぅぇぉャュョッァィゥェォー'));
const VOICED={か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',は:'ば',ひ:'び',ふ:'ぶ',へ:'べ',ほ:'ぼ'},SEMI={は:'ぱ',ひ:'ぴ',ふ:'ぷ',へ:'ぺ',ほ:'ぽ'};
const HIRA_LOOK={ぬ:'め',め:'ぬ',わ:'ね',ね:'れ',れ:'わ',る:'ろ',ろ:'る',さ:'き',き:'さ',ま:'も',も:'ま',は:'ほ',ほ:'は',い:'こ',こ:'い',ち:'ら',ら:'ち',た:'な',な:'た',り:'い',す:'ま',う:'ち',け:'は'};
const KATA_LOOK={シ:'ツ',ツ:'シ',ソ:'ン',ン:'ソ',ク:'ケ',ケ:'ク',ウ:'ワ',ワ:'ウ',ヌ:'ス',ス:'ヌ',ノ:'ハ',コ:'ユ',ミ:'メ',メ:'ナ',ナ:'メ',ア:'マ',マ:'ア',チ:'テ',テ:'チ',タ:'ク',ラ:'ヲ',フ:'ワ'};
// [word, picture]
export const WORDS=[['いぬ','🐶'],['ねこ','🐱'],['さかな','🐟'],['うさぎ','🐰'],['さる','🐵'],['ぞう','🐘'],['かめ','🐢'],['くま','🐻'],['ぶた','🐷'],['かえる','🐸'],['へび','🐍'],['かに','🦀'],['たこ','🐙'],['くじら','🐳'],['ひよこ','🐥'],['にわとり','🐔'],['うま','🐴'],['うし','🐮'],['きりん','🦒'],['しか','🦌'],['ごりら','🦍'],['らくだ','🐪'],['とり','🐦'],['あり','🐜'],['はち','🐝'],['りんご','🍎'],['みかん','🍊'],['すいか','🍉'],['いちご','🍓'],['ばなな','🍌'],['たまご','🥚'],['おにぎり','🍙'],['なす','🍆'],['もち','🍡'],['くるま','🚗'],['ひこうき','✈️'],['ふね','🚢'],['ほし','⭐'],['くも','☁️'],['かさ','☂️'],['とけい','⏰'],['えんぴつ','✏️'],['はさみ','✂️'],['いす','💺'],['まくら','🛏️'],['めがね','👓'],['くつ','👟'],['かばん','🎒'],['はな','🌸'],['つき','🌙'],['ゆき','⛄'],['たいよう','☀️'],['すいか','🍉'],['かぼちゃ','🎃']].filter((w,i,a)=>a.findIndex(x=>x[0]===w[0])===i);
const KATA_WORDS=[['パン','🍞'],['ケーキ','🍰'],['バナナ','🍌'],['ピアノ','🎹'],['ギター','🎸'],['カメラ','📷'],['テレビ','📺'],['バス','🚌'],['トマト','🍅'],['ジュース','🧃'],['アイス','🍨'],['サッカー','⚽'],['ボール','⚾'],['ピザ','🍕'],['ライオン','🦁'],['パンダ','🐼'],['ペンギン','🐧'],['コアラ','🐨'],['トラック','🚚'],['ロケット','🚀']];
const POKE_NAMES=['ピカチュウ','イーブイ','ヒトカゲ','ゼニガメ','フシギダネ','プリン','コダック','ニャース','ポッチャマ','ミミッキュ','ヤドン','ピッピ','カビゴン','ラッキー','ルカリオ','ゲンガー','ミュウ','ナゾノクサ'];
// kanji|reading|hint (Grade 1 kanji; readings are unique so there is exactly one right answer)
export const KANJI=['一|いち|よこぼうが ひとつだよ。','二|に|よこぼうが ふたつだよ。','三|さん|よこぼうが みっつだよ。','五|ご|「いち・に・さん・し・ご」の ごだよ。','六|ろく|「ご」の つぎの かずだよ。','七|なな|「ろく」の つぎの かずだよ。','八|はち|「なな」の つぎの かずだよ。','九|きゅう|「はち」の つぎの かずだよ。','十|じゅう|ゆびが ぜんぶで 10ぽん。','百|ひゃく|10が 10こで 100だよ。','山|やま|たかく そびえる ところだよ。','川|かわ|みずが ながれる ところだよ。','田|た|おこめを そだてる ところだよ。','石|いし|かたくて ころころ ころがるよ。','森|もり|き が たくさん あるよ。','林|はやし|「き」が ふたつ。もりより ちいさいよ。','竹|たけ|パンダが すきな ほそながい きだよ。','花|はな|はるに きれいに さくよ。','草|くさ|にわに はえている みどりの はっぱだよ。','虫|むし|カブトムシや ちょうちょの なかまだよ。','犬|いぬ|「わんわん」と なくよ。','空|そら|おひさまや くもが うかぶよ。','雨|あめ|ざあざあ ふって くるよ。','火|ひ|あかく あつく もえるよ。','水|みず|のんだり ながれたりするよ。','木|き|えだと はっぱが あるよ。','土|つち|はたけに あるよ。','目|め|ものを みる ところだよ。','耳|みみ|おとを きく ところだよ。','口|くち|ごはんを たべる ところだよ。','手|て|ものを もつ ところだよ。','足|あし|あるく ときに つかうよ。','人|ひと|ひとが あるいている かたちだよ。','男|おとこ|「たんぼ」と「ちから」で できているよ。','女|おんな|「おとこ」の はんたいだよ。','子|こ|ちいさな こどもの ことだよ。','力|ちから|おもい ものを もちあげる ちからだよ。','上|うえ|あたまの ほうだよ。','下|した|あしの ほうだよ。','中|なか|まんなかを つらぬくよ。','右|みぎ|おはしを もたない ほうの てだよ。','左|ひだり|「みぎ」の はんたいだよ。','大きい|おおきい|「ちいさい」の はんたいだよ。','小さい|ちいさい|「おおきい」の はんたいだよ。','赤|あか|トマトの いろだよ。','青|あお|そらや うみの いろだよ。','白|しろ|ゆきの いろだよ。','車|くるま|みちを はしる のりものだよ。','貝|かい|うみに いる、から を もつ いきものだよ。','糸|いと|ぬいものに つかうよ。','玉|たま|まるい ものの ことだよ。','町|まち|いえや おみせが たくさん あるよ。','村|むら|まちより ちいさな ところだよ。','学校|がっこう|まいにち べんきょうに いく ところだよ。','先生|せんせい|がっこうで おしえて くれる ひとだよ。','天気|てんき|はれや あめの ことだよ。','文字|もじ|ひらがなや かんじの ことだよ。','出る|でる|そとへ いく ことだよ。','入る|はいる|なかへ いく ことだよ。','立つ|たつ|すわって いた ひとが おきあがるよ。','休む|やすむ|ひとが「き」に よりかかるよ。','見る|みる|「め」を つかうよ。','早い|はやい|「おそい」の はんたいだよ。','正しい|ただしい|まちがいの はんたいだよ。','生まれる|うまれる|あかちゃんが この よに でてくるよ。','円|えん|おかねの たんいだよ。','年|とし|1ねん、2ねん、と かぞえるよ。','音|おと|みみで きく ものだよ。','王|おう|くにを おさめる ひとだよ。'].map(s=>{const[k,r,h]=s.split('|');return{k,r,h};});
const OPPOSITES=[['おおきい','ちいさい'],['ながい','みじかい'],['あつい','つめたい'],['はやい','おそい'],['たかい','ひくい'],['おもい','かるい'],['ひろい','せまい'],['あかるい','くらい'],['ふとい','ほそい'],['あたらしい','ふるい'],['つよい','よわい'],['おおい','すくない'],['あける','しめる'],['はいる','でる'],['のぼる','おりる'],['すわる','たつ'],['わらう','なく'],['ひる','よる']];
const GROUPS=[['どうぶつ',['いぬ','ねこ','うさぎ','ぞう','さる','くま','ぶた']],['たべもの',['りんご','みかん','パン','おにぎり','たまご','すいか','いちご']],['のりもの',['くるま','ふね','ひこうき','でんしゃ','バス','じてんしゃ']],['いろ',['あか','あお','きいろ','みどり','しろ','くろ']],['からだ',['あたま','て','あし','め','みみ','くち']],['がっこうの もの',['えんぴつ','けしごむ','ノート','ランドセル','つくえ','はさみ']],['そらの もの',['たいよう','つき','ほし','くも','にじ','かみなり']]];
const COUNTERS=[['いぬ','ひき'],['ねこ','ひき'],['さかな','ひき'],['えんぴつ','ほん'],['かさ','ほん'],['くるま','だい'],['じてんしゃ','だい'],['ほん','さつ'],['ノート','さつ'],['かみ','まい'],['おさら','まい'],['りんご','こ'],['たまご','こ'],['ひと','にん']],COUNTER_NAMES=['ひき','ほん','だい','さつ','まい','こ','にん'];
const SOUNDS=[['いぬ','わんわん'],['ねこ','にゃーにゃー'],['うし','もーもー'],['ぶた','ぶーぶー'],['ひよこ','ぴよぴよ'],['からす','かーかー'],['すずめ','ちゅんちゅん'],['あひる','がーがー'],['ねずみ','ちゅーちゅー'],['ひつじ','めーめー']];
const NAMES=['ピカチュウ','イーブイ','ヒトカゲ','ゼニガメ','フシギダネ','プリン','コダック','ニャース','ポッチャマ','ミミッキュ'];
const PLACES=['こうえん','うみ','やま','かわ','もり','にわ','がっこう','いえ','まち'];
const ACTS=[['きのみ','たべました','たべた'],['りんご','たべました','たべた'],['おにぎり','たべました','たべた'],['ボール','なげました','なげた'],['ほん','よみました','よんだ'],['え','かきました','かいた'],['うた','うたいました','うたった'],['みず','のみました','のんだ'],['はな','つみました','つんだ'],['かさ','さしました','さした']];
const TIMES=['あさ','ひる','ゆうがた','よる'];
const REASONS=[['おなかが ぺこぺこなので、おにぎりを たべました。\nなぜ おにぎりを たべた？','おなかが すいていたから',['おなかが すいていたから','ねむかったから','さむかったから','たのしかったから']],['さむい ふゆなので、ゼニガメは あたたかい ふくを きました。\nなぜ ふくを きた？','さむいから',['さむいから','あついから','うれしいから','ねむいから']],['ヒトカゲは ころんで、ひざを うちました。\nヒトカゲは どうして ないた？','いたかったから',['いたかったから','おかしかったから','おなかが すいたから','ねむかったから']],['あしたは えんそくです。フシギダネは たのしみで、よく ねむれませんでした。\nなにが たのしみ？','えんそく',['えんそく','うんどうかい','おまつり','たんじょうび']],['プリンは あかい ふうせんと あおい ふうせんを もっています。\nあおい ふうせんの かずは いくつ？\n（あかい ふうせんは 2こ、あおい ふうせんは 3こ）','3こ',['3こ','2こ','5こ','1こ']],['コダックは あさ 7じに おきて、7じ30ぷんに あさごはんを たべました。\nあさごはんは なんじ なんぷん？','7じ30ぷん',['7じ30ぷん','7じ','8じ','6じ30ぷん']]];

const opts=(answer,wrongs,r)=>{const w=[...new Set(wrongs.filter(x=>x!==answer))];if(w.length<3)throw new Error(`Not enough distractors for ${answer}`);return shuffle([answer,...shuffle(w,r).slice(0,3)],r);};
const letterOptions=(answer,near,pool,r)=>opts(answer,[...near.filter(c=>!SMALL.has(c)),...shuffle(pool,r)],r);
const countOptions=n=>[n,n+1,n-1,n+2,n-2,n+3].filter(v=>v>=1).slice(0,4).map(v=>`${v}もじ`);
const mutate=(word,look,pool,r)=>{const chars=Array.from(word),out=new Set();chars.forEach((c,i)=>{if(look[c]){const m=[...chars];m[i]=look[c];out.add(m.join(''));}});for(let t=0;out.size<3&&t<30;t++){const i=Math.floor(r()*chars.length),m=[...chars];m[i]=pool[Math.floor(r()*pool.length)];if(m.join('')!==word&&!SMALL.has(chars[i]))out.add(m.join(''));}return[...out];};

function langMakers(cat,r){
 const pick=a=>a[Math.floor(r()*a.length)],chars=w=>Array.from(w);
 const staticMaker=()=>{const q=pick(langBank.filter(b=>b[0]===cat));return[q[0],q[1],q[2],shuffle(q[3],r),q[4]];};
 const hira=[
  ()=>{const[w,e]=pick(WORDS),c=chars(w);return['ひらがな',`${e}「${w}」の はじめの もじは？`,c[0],letterOptions(c[0],c,KANA,r),`「${c.join('・')}」と ゆっくり よんでみよう。`];},
  ()=>{const[w,e]=pick(WORDS),c=chars(w),a=c.at(-1);if(SMALL.has(a))return null;return['ひらがな',`${e}「${w}」の おわりの もじは？`,a,letterOptions(a,c,KANA,r),`「${c.join('・')}」の さいごを よんでみよう。`];},
  ()=>{const[w,e]=pick(WORDS),c=chars(w);if(c.length<3)return null;const i=1+Math.floor(r()*(c.length-2)),a=c[i];if(SMALL.has(a))return null;const shown=c.map((x,j)=>j===i?'＿':x).join('');return['ひらがな',`${e}「${shown}」の ＿に はいる もじは？`,a,letterOptions(a,c,KANA,r),`「${c.join('・')}」と えを みて かんがえよう。`];},
  ()=>{const[w,e]=pick(WORDS),n=chars(w).length;return['ひらがな',`${e}「${w}」は なんもじ？`,`${n}もじ`,countOptions(n),'ひとつずつ ゆびで かぞえてみよう。ちいさい「ゃゅょっ」も ひとつと かぞえるよ。'];},
  ()=>{const[w,e]=pick(WORDS);return['ひらがな',`${e} この ものの なまえは？`,w,opts(w,WORDS.map(x=>x[0]),r),`えを よく みて、なまえを おもいだそう。ひらがなで「${w[0]}」から はじまるよ。`];},
  ()=>{for(let t=0;t<40;t++){const[w]=pick(WORDS),c=chars(w),L=c.at(-1);if(L==='ん'||SMALL.has(L))continue;const next=WORDS.filter(x=>x[0]!==w&&chars(x[0])[0]===L);if(!next.length)continue;const a=pick(next)[0];return['ひらがな',`しりとり！「${w}」の つぎに つづく ことばは？`,a,opts(a,WORDS.filter(x=>chars(x[0])[0]!==L&&x[0]!==w).map(x=>x[0]),r),`「${w}」の さいごの もじは「${L}」。「${L}」から はじまる ことばを さがそう。`];}return null;},
  ()=>{const next=r()<.5,i=next?Math.floor(r()*(KANA.length-1)):1+Math.floor(r()*(KANA.length-1)),a=KANA[i+(next?1:-1)];return['ひらがな',`あいうえお ずの じゅんで「${KANA[i]}」の ${next?'つぎ':'まえ'}の もじは？`,a,letterOptions(a,KANA.slice(Math.max(0,i-3),i+4),KANA,r),'「あいうえお かきくけこ さしすせそ…」と うたって みよう。'];},
  ()=>{const dakuten=r()<.65,k=pick(Object.keys(dakuten?VOICED:SEMI)),a=(dakuten?VOICED:SEMI)[k],all=[...Object.values(VOICED),...Object.values(SEMI)];return['ひらがな',`「${k}」に ${dakuten?'てんてん「゛」':'まる「゜」'}を つけると？`,a,opts(a,all,r),`${dakuten?'「゛」':'「゜」'}を つけると、おとが かわるよ。`];},
  staticMaker];
 const kata=[
  ()=>{const[w,e]=pick(WORDS),a=toKata(w);return['カタカナ',`${e}「${w}」を カタカナにすると？`,a,opts(a,mutate(a,KATA_LOOK,KATA,r),r),'ひらがなを ひとつずつ カタカナに なおしてみよう。'];},
  ()=>{const[w]=pick(WORDS),k=toKata(w);return['カタカナ',`「${k}」を ひらがなに すると？`,w,opts(w,mutate(w,HIRA_LOOK,KANA,r),r),'カタカナを ひとつずつ ひらがなに なおしてみよう。'];},
  ()=>{const w=shuffle(WORDS,r).slice(0,4),a=toKata(w[0][0]);return['カタカナ',`カタカナで かいて あるのは どれ？`,a,shuffle([a,w[1][0],w[2][0],w[3][0]],r),'カタカナは かくかくした かたちが おおいよ。'];},
  ()=>{const[w,e]=pick(KATA_WORDS);return['カタカナ',`${e} この ものの なまえを カタカナで えらぼう。`,w,opts(w,KATA_WORDS.map(x=>x[0]),r),`「${w[0]}」から はじまる ことばだよ。`];},
  ()=>{const n=pick(POKE_NAMES),c=chars(n);return['カタカナ',`「${n}」の はじめの もじは？`,c[0],letterOptions(c[0],c,KATA,r),`「${c.join('・')}」と よんでみよう。`];},
  ()=>{const n=pick(POKE_NAMES),c=chars(n),a=c.at(-1);if(SMALL.has(a))return null;return['カタカナ',`「${n}」の おわりの もじは？`,a,letterOptions(a,c,KATA,r),`「${c.join('・')}」の さいごを よんでみよう。`];},
  ()=>{const n=pick(POKE_NAMES),k=chars(n).length;return['カタカナ',`「${n}」は なんもじ？`,`${k}もじ`,countOptions(k),'ひとつずつ ゆびで かぞえよう。「ー」や ちいさい「ッュ」も ひとつと かぞえるよ。'];},
  staticMaker];
 const kanji=[
  ()=>{const e=pick(KANJI);return['かんじ',`「${e.k}」は なんと よむ？`,e.r,opts(e.r,KANJI.map(x=>x.r),r),e.h];},
  ()=>{const e=pick(KANJI);return['かんじ',`「${e.r}」を かんじで かくと？`,e.k,opts(e.k,KANJI.map(x=>x.k),r),e.h];},
  ()=>{const e=pick(KANJI);return['かんじ',`「${e.k}」は なんと よむ？`,e.r,opts(e.r,KANJI.map(x=>x.r),r),e.h];},
  staticMaker];
 const koto=[
  ()=>{const[a,b]=pick(OPPOSITES),flip=r()<.5,q=flip?b:a,ans=flip?a:b;return['ことば',`「${q}」の はんたいは？`,ans,opts(ans,OPPOSITES.flat().filter(x=>x!==q),r),`「${q}」と ぎゃくの いみの ことばを さがそう。`];},
  ()=>{const[a,b]=pick(OPPOSITES),flip=r()<.5,q=flip?b:a,ans=flip?a:b;return['ことば',`「${q}」の はんたいは？`,ans,opts(ans,OPPOSITES.flat().filter(x=>x!==q),r),`「${q}」と ぎゃくの いみの ことばを さがそう。`];},
  ()=>{const[g1,h]=shuffle(GROUPS,r).slice(0,2),three=shuffle(g1[1],r).slice(0,3),odd=pick(h[1]);return['ことば','ちがう なかまの ことばは どれ？',odd,shuffle([...three,odd],r),`3つは「${g1[0]}」の なかま。ひとつだけ ちがうよ。`];},
  ()=>{const[w,c]=pick(COUNTERS);return['ことば',`「${w}」を かぞえる ときに つかう ことばは？`,c,opts(c,COUNTER_NAMES,r),'ひき・ほん・だい・さつ・まい・こ・にん。ものに あわせて えらぼう。'];},
  ()=>{const[w,s]=pick(SOUNDS);return['ことば',`「${w}」の なきごえ・おとは？`,s,opts(s,SOUNDS.map(x=>x[1]),r),`「${w}」が どんな こえで なくか おもいだそう。`];},
  staticMaker];
 const bun=[
  ()=>{const c=pick(NAMES),[th,po,pl]=pick(ACTS),p=pick(PLACES),k=Math.floor(r()*4);const text=`${c}は ${p}で ${th}を ${po}。`;
   if(k===0)return['ぶんを よもう',`${text}\nだれが ${th}を ${pl}？`,c,opts(c,NAMES,r),'ぶんの いちばん はじめを よもう。「は」の まえに なまえが あるよ。'];
   if(k===1)return['ぶんを よもう',`${text}\nどこで ${th}を ${pl}？`,p,opts(p,PLACES,r),'「で」の まえに ばしょが かいてあるよ。'];
   if(k===2)return['ぶんを よもう',`${text}\nなにを ${pl}？`,th,opts(th,ACTS.map(x=>x[0]),r),'「を」の まえに ものの なまえが あるよ。'];
   return['ぶんを よもう',`${text}\n${c}は ${th}を どうした？`,pl,opts(pl,ACTS.map(x=>x[2]),r),'「を」の あとの ことばを よもう。'];},
  ()=>{const c=pick(NAMES),[th,po,pl]=pick(ACTS),t=pick(TIMES),k=Math.floor(r()*3);const text=`${t}、${c}は ${th}を ${po}。`;
   if(k===0)return['ぶんを よもう',`${text}\nいつ ${th}を ${pl}？`,t,opts(t,TIMES,r),'ぶんの はじめに「いつ」が かいてあるよ。'];
   if(k===1)return['ぶんを よもう',`${text}\nだれが ${th}を ${pl}？`,c,opts(c,NAMES,r),'「は」の まえに なまえが あるよ。'];
   return['ぶんを よもう',`${text}\nなにを ${pl}？`,th,opts(th,ACTS.map(x=>x[0]),r),'「を」の まえに ものの なまえが あるよ。'];},
  ()=>{const[c1,c2,c3,c4]=shuffle(NAMES,r),[th,po,pl]=pick(ACTS),p=pick(PLACES);return['ぶんを よもう',`${c1}と ${c2}は ${p}で ${th}を ${po}。\nだれと だれが ${th}を ${pl}？`,`${c1}と ${c2}`,opts(`${c1}と ${c2}`,[`${c1}と ${c3}`,`${c4}と ${c2}`,`${c3}と ${c4}`],r),'「と」でつながっている ふたりの なまえを よもう。'];},
  ()=>{const[text,ans,o]=pick(REASONS);return['ぶんを よもう',text,ans,shuffle(o,r),'ぶんを ゆっくり よんで、こたえを さがそう。'];},
  staticMaker];
 return{'ひらがな':hira,'カタカナ':kata,'かんじ':kanji,'ことば':koto,'ぶんを よもう':bun}[cat];
}
const FOODS=[['きのみ','こ'],['あめ','こ'],['クッキー','こ'],['おにぎり','こ']];
const THINGS=[...FOODS,['モンスターボール','こ'],['どんぐり','こ'],['カード','まい'],['シール','まい'],['おりがみ','まい']];
const CONTAINERS=['さら','かご','ふくろ','はこ'];
const unit=u=>v=>`${v}${u}`;
const clockText=(h,m)=>`${h}じ${m?` ${m}ふん`:''}`,wrap12=h=>((h-1+12)%12)+1;

function mathMaker(kind,r,settings){
 const int=(a,b)=>a+Math.floor(r()*(b-a+1)),pick=a=>a[Math.floor(r()*a.length)],limit=settings.range===20?20:10;
 const total=()=>limit===20&&r()<.6?int(11,20):int(3,limit);
 const num=(o,v,fmt=String)=>({kind:o.kind,tag:o.tag,text:o.text,answer:fmt(v),options:numberOptions(v,r,fmt),hint:o.hint,explain:`${o.eq}。`+(o.say||''),eq:o.eq,value:v,variant:o.variant,...(o.extra||{})});
 const calc=()=>{
  const v=pick(['plain','plain','plain','blank','blank','three','seq','bigger','ten']);
  if(v==='plain'){const a=int(1,limit-1),b=int(1,limit-a),minus=r()>.5,t=a+b,ans=minus?a:t;
   return num({kind:'calc',variant:v,tag:minus?'ひきざん':'たしざん',text:minus?`${t} − ${b} ＝ ？`:`${a} ＋ ${b} ＝ ？`,hint:minus?`${t}こから ${b}こを とってみよう。`:`${a}こに ${b}こを たしてみよう。`,eq:minus?`${t} − ${b} ＝ ${a}`:`${a} ＋ ${b} ＝ ${t}`,say:`こたえは ${ans}だね。`,extra:{dots:minus?t:null}},ans);}
  if(v==='blank'){const t=total(),a=int(1,t-1),b=t-a,form=int(0,3);
   const f=[[`□ ＋ ${b} ＝ ${t}`,a,`${t}から ${b}を ひくと、□が わかるよ。`],[`${a} ＋ □ ＝ ${t}`,b,`${t}から ${a}を ひくと、□が わかるよ。`],[`${t} − □ ＝ ${a}`,b,`${t}から ${a}を ひくと、□が わかるよ。`],[`□ − ${b} ＝ ${a}`,t,`${a}に ${b}を たすと、□が わかるよ。`]][form];
   return num({kind:'calc',variant:v,tag:'□に はいる かず',text:`${f[0]}\n□に はいる かずは？`,hint:f[2],eq:form<2?`${a} ＋ ${b} ＝ ${t}`:`${t} − ${b} ＝ ${a}`,say:`□は ${f[1]}だね。`},f[1]);}
  if(v==='three'){const mixed=r()<.4,a=int(1,limit-2),b=int(1,limit-a-1),c=mixed?int(1,a+b-1):int(1,limit-a-b),ans=mixed?a+b-c:a+b+c;
   return num({kind:'calc',variant:v,tag:'3つの かず',text:`${a} ＋ ${b} ${mixed?'−':'＋'} ${c} ＝ ？`,hint:`まえから じゅんに けいさんしよう。\nまず ${a} ＋ ${b} ＝ ${a+b}。それから ${a+b} ${mixed?'−':'＋'} ${c}。`,eq:`${a} ＋ ${b} ＝ ${a+b}、${a+b} ${mixed?'−':'＋'} ${c} ＝ ${ans}`,say:`こたえは ${ans}だね。`},ans);}
  if(v==='seq'){const k=pick(limit===20?[1,2,5]:[1,2]),up=r()<.7,s=up?int(0,limit-4*k):int(4*k,limit),seq=Array.from({length:5},(_,i)=>s+(up?k:-k)*i),hole=int(1,4),ans=seq[hole];
   return num({kind:'calc',variant:v,tag:'かずの ならび',text:`□に はいる かずは？\n${seq.map((x,i)=>i===hole?'□':x).join('　→　')}`,hint:`となりの かずを くらべよう。${k}ずつ ${up?'ふえて':'へって'} いるよ。`,eq:`${seq[hole-1]} ${up?'＋':'−'} ${k} ＝ ${ans}`,say:`□は ${ans}だね。`},ans);}
  if(v==='bigger'){const big=r()<.5,set=new Set();while(set.size<4)set.add(int(0,limit));const nums=[...set],ans=big?Math.max(...nums):Math.min(...nums);
   return{kind:'calc',variant:v,tag:'かずの くらべっこ',text:`いちばん ${big?'おおきい':'ちいさい'} かずは どれ？`,answer:String(ans),options:shuffle(nums,r).map(String),hint:'かずを ひとつずつ くらべよう。0に ちかいほど ちいさいよ。',explain:`${nums.sort((x,y)=>x-y).join(' ＜ ')}。いちばん ${big?'おおきい':'ちいさい'}のは ${ans}だね。`,value:ans};}
  const a=int(1,9);return num({kind:'calc',variant:'ten',tag:'あわせて 10',text:`${a} と いくつで 10に なる？`,hint:`${a}から 10まで、ゆびで かぞえてみよう。`,eq:`${a} ＋ ${10-a} ＝ 10`,say:`${a}と ${10-a}で 10だね。`},10-a);};
 const multiply=()=>{
  const v=pick(['plain','plain','story','story','blank']),a=int(1,3),b=int(1,9),p=a*b;
  const hint=`${a}こずつが ${b}くみだよ。\n${Array.from({length:b},()=>a).join(' ＋ ')} を たしてみよう。`,eq=`${a} × ${b} ＝ ${p}`,extra={a,b};
  if(v==='story'){const[item,u]=pick(THINGS),box=pick(CONTAINERS);
   return num({kind:'multiply',variant:v,tag:`かけざん・${a}の だん`,text:`${box}が ${b}つ あります。\nどの ${box}にも ${item}が ${a}${u}ずつ はいっています。\nぜんぶで いくつ？`,hint,eq,say:`ぜんぶで ${p}${u}だね。`,extra},p,unit(u));}
  if(v==='blank'){const left=r()<.5;return num({kind:'multiply',variant:v,tag:`かけざん・${a}の だん`,text:left?`${a} × □ ＝ ${p}\n□に はいる かずは？`:`□ × ${b} ＝ ${p}\n□に はいる かずは？`,hint:left?`${a}を なんかい たすと ${p}に なるかな？`:`${b}かい たして ${p}に なる かずを さがそう。`,eq,say:`□は ${left?b:a}だね。`,extra:{...extra,hidePicture:true}},left?b:a);}
  return num({kind:'multiply',variant:v,tag:`かけざん・${a}の だん`,text:`${a} × ${b} ＝ ？`,hint,eq,say:`${a}こずつ ${b}くみで ${p}こ。`,extra},p);};
 const word=()=>{
  const c=pick(NAMES),c2=pick(NAMES.filter(x=>x!==c)),[it,u]=pick(THINGS),[food,fu]=pick(FOODS),v=int(0,9),fmt=unit(u),t=total(),a=int(1,t-1),b=t-a;
  const add=(text,hint,say,f=fmt,x=a,y=b,s=t)=>num({kind:'word',variant:`add${v}`,tag:'ぶんしょうだい',text,hint:hint||`${x}と ${y}を たすよ。\n${x} ＋ ${y} ＝ ？`,eq:`${x} ＋ ${y} ＝ ${s}`,say},s,f);
  const sub=(text,hint,say,f,tot,take,left)=>num({kind:'word',variant:`sub${v}`,tag:'ぶんしょうだい',text,hint:hint||`${tot}から ${take}を ひくよ。\n${tot} − ${take} ＝ ？`,eq:`${tot} − ${take} ＝ ${left}`,say},left,f);
  if(v===0)return add(`${c}は ${it}を ${a}${u} もっています。\n${c2}から ${b}${u} もらいました。\nぜんぶで いくつ？`,0,`ぜんぶで ${fmt(t)}だね。`);
  if(v===1)return add(`${c}が ${animal(a)} います。\nあとから ${animal(b)} きました。\nあわせて なんびき？`,0,`あわせて ${animal(t)}だね。`,animal);
  if(v===2)return add(`あかい ${it}が ${a}${u}、あおい ${it}が ${b}${u} あります。\nあわせて いくつ？`,0,`あわせて ${fmt(t)}だね。`);
  if(v===3)return add(`${c}は かごに ${it}を ${a}${u} いれました。\nさらに ${b}${u} いれました。\nかごの なかは ぜんぶで いくつ？`,0,`ぜんぶで ${fmt(t)}だね。`);
  if(v===4)return sub(`${food}が ${t}${fu} あります。\n${c}が ${b}${fu} たべました。\nのこりは いくつ？`,0,`のこりは ${t-b}${fu}だね。`,unit(fu),t,b,t-b);
  if(v===5)return sub(`${c}は ${it}を ${t}${u} もっていました。\n${c2}に ${b}${u} あげました。\nいま、${c}の ${it}は いくつ？`,0,`いまは ${fmt(a)}だね。`,fmt,t,b,a);
  if(v===6)return sub(`${it}が ${t}${u} あります。\nそのうち ${b}${u}は あかです。\nあか いがいは いくつ？`,0,`あか いがいは ${fmt(a)}だね。`,fmt,t,b,a);
  if(v===7){const big=int(2,limit),small=int(1,big-1);return sub(`${c}は ${it}を ${big}${u}、${c2}は ${small}${u} もっています。\n${c}は ${c2}より いくつ おおい？`,`おおきい ほうから ちいさい ほうを ひくよ。\n${big} − ${small} ＝ ？`,`${c}が ${fmt(big-small)} おおいね。`,fmt,big,small,big-small);}
  if(v===8){const goal=int(4,limit),have=int(1,goal-1);return sub(`${c}は ${it}を ${have}${u} もっています。\n${goal}${u} あつめたいです。\nあと いくつ ひつようですか？`,`${goal}に なるまで あと いくつ？\n${goal} − ${have} ＝ ？`,`あと ${fmt(goal-have)} ひつようだね。`,fmt,goal,have,goal-have);}
  const x=int(2,Math.max(2,limit-2)),y=int(1,Math.max(1,Math.min(limit-x,5))),z=int(1,x+y-1),s=x+y,ans=s-z;
  return num({kind:'word',variant:'mixed',tag:'ぶんしょうだい',text:`${c}は ${food}を ${x}${fu} もっていました。\n${y}${fu} もらって、${z}${fu} たべました。\nいま いくつ？`,hint:`まず ふえた ぶんを たして、つぎに たべた ぶんを ひくよ。\n${x} ＋ ${y} ＝ ${s}、${s} − ${z} ＝ ？`,eq:`${x} ＋ ${y} ＝ ${s}、${s} − ${z} ＝ ${ans}`,say:`いまは ${ans}${fu}だね。`},ans,unit(fu));};
 const clock=()=>{
  const five=settings.clock==='five',h=int(1,12),m=(five?[0,5,10,15,20,25,30,35,40,45,50,55]:[0,30])[int(0,five?11:1)],now=clockText(h,m),base={kind:'clock',tag:'とけい',h,m};
  const v=pick(['read','read','read','after1','before1',...(m===0||m===30?['after30']:[])]);
  const mk=(variant,text,answer,wrongs,hint,explain)=>({...base,variant,text,answer,options:shuffle([answer,...wrongs],r),hint,explain});
  if(v==='after1'){const h2=wrap12(h+1);return mk(v,'この とけいの 1じかんあとは なんじ？',clockText(h2,m),[clockText(wrap12(h-1),m),now,clockText(wrap12(h+2),m)],'みじかい はりが 1めもり すすむと 1じかんだよ。\nいまの じこくから かんがえよう。',`いまは ${now}。1じかん あとは ${clockText(h2,m)}だね。`);}
  if(v==='before1'){const h2=wrap12(h-1);return mk(v,'この とけいの 1じかんまえは なんじ？',clockText(h2,m),[clockText(wrap12(h+1),m),now,clockText(wrap12(h-2),m)],'みじかい はりが 1めもり もどると 1じかんまえだよ。\nいまの じこくから かんがえよう。',`いまは ${now}。1じかん まえは ${clockText(h2,m)}だね。`);}
  if(v==='after30'){const ans=m===0?clockText(h,30):clockText(wrap12(h+1),0),wrongs=m===0?[clockText(h,0),clockText(wrap12(h+1),0),clockText(wrap12(h+1),30)]:[clockText(h,30),clockText(wrap12(h+1),30),clockText(wrap12(h+2),0)];return mk(v,'この とけいの 30ぷんあとは なんじ なんぷん？',ans,wrongs,'30ぷんは ながい はりが はんぶん まわる じかんだよ。\nながい はりが 6の ところだと 30ふん。',`いまは ${now}。30ぷん あとは ${ans}だね。`);}
  return mk('read','いま、なんじ なんぷん？',now,[clockText(wrap12(h+1),m),m===0?clockText(h,30):clockText(h,0),clockText(wrap12(h-1),m)],'みじかい はりが「じ」。ながい はりが「ふん」だよ。\nながい はりは、12が 0ふん、6が 30ふん。1めもりは 1ぷんだよ。',`みじかい はりは ${h}じ${m?'を すぎた ところ':''}。ながい はりは ${m}ふん。${now}だね。`);};
 return{calc,multiply,word,clock}[kind];
}

export function makeQuestions(subject,count,seed,settings={}){
 const r=rng(seed),seen=new Set(),key=q=>`${q.text}|${q.h??''}:${q.m??''}|${[...q.options].sort()}`;
 if(subject==='lang'){
  const cats=['ひらがな','カタカナ','かんじ','ことば','ぶんを よもう'],plan=Object.fromEntries(cats.map(c=>[c,shuffle(langMakers(c,r),r)]));
  return Array.from({length:count},(_,i)=>{const c=cats[i%cats.length],makers=plan[c],round=Math.floor(i/cats.length);let q;
   for(let t=0;t<60&&!q;t++){const v=makers[(round+t)%makers.length]();if(v&&!seen.has(v[1]+'|'+[...v[3]].sort())){seen.add(v[1]+'|'+[...v[3]].sort());q={kind:'lang',tag:v[0],text:v[1],answer:v[2],options:v[3],hint:v[4],explain:`こたえは「${v[2]}」だね。`};}}
   return q||langMakers(c,r)[0]();});
 }
 const kinds=subject==='math'?(settings.multiply===false?['calc','word','clock']:['calc','multiply','word','clock']):[subject];
 const makers=Object.fromEntries(kinds.map(k=>[k,mathMaker(k,r,settings)])),order=[];
 while(order.length<count)order.push(...shuffle(kinds,r));
 return order.slice(0,count).map(kind=>{let q;for(let t=0;t<60;t++){q=makers[kind]();if(!seen.has(key(q)))break;}seen.add(key(q));return q;});
}
export function clockSvg(h,m){const minute=m*6,hour=(h%12)*30+m*.5;return`<svg class="clock" viewBox="0 0 240 240" role="img" aria-label="もんだいの とけい"><circle cx="120" cy="120" r="114" fill="#fff" stroke="#d7d9c8" stroke-width="5"/>${Array.from({length:60},(_,i)=>`<line x1="120" y1="${i%5===0?14:12}" x2="120" y2="${i%5===0?24:17}" transform="rotate(${i*6} 120 120)" stroke="${i%5===0?'#687665':'#c9cdbe'}" stroke-width="${i%5===0?3:1}"/>`).join('')}${Array.from({length:12},(_,i)=>{const n=i+1,a=n*Math.PI/6;return`<text x="${120+82*Math.sin(a)}" y="${127-82*Math.cos(a)}" text-anchor="middle" font-size="19" fill="#354337" font-weight="700">${n}</text>`;}).join('')}<line x1="120" y1="120" x2="120" y2="62" transform="rotate(${hour} 120 120)" stroke="#d78350" stroke-width="9" stroke-linecap="round"/><line x1="120" y1="120" x2="120" y2="38" transform="rotate(${minute} 120 120)" stroke="#4e8064" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="120" r="7" fill="#354337"/></svg>`;}
