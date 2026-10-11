// Şöhret gündelik hayata yansır; ücretsiz para için tekrarlanamaz.
const overallFameBeforePublicity=overallFame;
overallFame=function(){return Math.max(0,Math.min(100,overallFameBeforePublicity()+(Number(S&&S.publicity)||0)))};
function changePublicity(amount){S.publicity=Math.max(-15,Math.min(15,(Number(S.publicity)||0)+amount))}
function annualFameEvent(){
 const fame=overallFame();if(S.age<18||fame<15||Math.random()>=.35||!annualLifeFlag('fame-event'))return;
 const options=[
 {title:'Röportaj daveti',text:'Yerel bir yayın seni başarı hikâyeni anlatmaya davet ediyor.',choices:[{t:'Röportaja katıl',p:1,run:()=>{changePublicity(2);apply({m:3});return 'Röportajın ilgi gördü. Tanınırlığın arttı.'}},{t:'Nazikçe reddet',run:()=> 'Bu kez özel hayatına zaman ayırdın.'}]},
 {title:'Bir hayranınla karşılaştın',text:'Birisi seni tanıyıp birlikte fotoğraf çektirmek istiyor.',choices:[{t:'Fotoğraf çektir',p:1,run:()=>{changePublicity(1);apply({m:2});return 'Hayranın çok mutlu oldu; fotoğrafı arkadaşlarıyla paylaştı.'}},{t:'Kibarca müsait olmadığını söyle',run:()=> 'Sınırlarını nazikçe anlattın.'}]},
 {title:'Yanlış anlaşılan söz',text:'Bir sözün bağlamından çıkarılıp sosyal medyada tartışılıyor.',choices:[{t:'Açıklama yap',p:1,run:()=>{changePublicity(Math.random()<.75?1:-2);apply({m:-1});return 'Düşünceni sakin bir açıklamayla paylaştın.'}},{t:'Tartışmaya gir',run:()=>{changePublicity(-4);apply({m:-3});return 'Tartışma büyüdü; tanınırlığın ve moralin zarar gördü.'}},{t:'Gündemin geçmesini bekle',run:()=>{changePublicity(-1);return 'Bir süre sonra herkes başka bir konuyu konuşmaya başladı.'}}]},
 {title:'Reklam yüzü teklifi',text:'Bir marka kısa bir reklam çekiminde yer almanı istiyor. Çekim için ücret ödeyecek.',choices:[{t:'Teklifi kabul et',p:1,run:()=>{const fee=Math.round((500+fame*80)*wm());S.p+=fee;changePublicity(1);return 'Reklam çekimini tamamladın. Ücret: '+TL(fee)}},{t:'Reddet',run:()=> 'Markanın teklifini reddettin.'}]}
 ];
 const e=R(options);queueLifeChoice(e.title,e.text,e.choices,()=>overallFame()>=10);
}
