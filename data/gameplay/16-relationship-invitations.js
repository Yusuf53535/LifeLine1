// Yakınlar da etkileşim başlatır; otomatik arkadaş eklenmez.
function annualRelationshipInvitation(){
 if(Math.random()>=.45||!annualLifeFlag('relationship-invitation'))return;
 const friends=(S.people||[]).filter(p=>!p.dead&&(/arkadaş/i.test(p.role)||p.friend)),family=(S.people||[]).filter(p=>!p.dead&&relationshipFamily(p));
 const candidates=[];
 if(friends.length)candidates.push('friend');if(S.partner)candidates.push('partner');if(family.length)candidates.push('family');if(!candidates.length)return;
 const type=R(candidates);
 if(type==='friend'){
  const p=R(friends);queueLifeChoice('Arkadaşından davet',p.n+' birlikte yürüyüş yapıp sohbet etmek istiyor.',[{t:'Daveti kabul et',p:1,run:()=>{p.b=cl(p.b+6);apply({m:4});return p.n+' ile güzel vakit geçirdin.'}},{t:'Başka bir zamana bırak',run:()=>{p.b=cl(p.b-1);return 'Başka bir gün görüşmek üzere sözleştiniz.'}}],()=>S.people.includes(p)&&!p.dead);
 }else if(type==='partner'){
  const p=S.partner;queueLifeChoice('İlişkiniz hakkında konuşma',p.n+' son zamanlarda yeterince birlikte vakit geçirmediğinizi düşünüyor.',[{t:'Dinle ve birlikte zaman ayır',p:1,run:()=>{p.b=cl(p.b+5);apply({m:3});return 'Birbirinizi daha iyi anladınız.'}},{t:'Savunmaya geç',run:()=>{p.b=cl(p.b-8);apply({m:-3});return 'Konuşma tartışmaya dönüştü.'}},{t:'Sonra konuşalım de',run:()=>{p.b=cl(p.b-3);return 'Konuyu erteledin; partnerin buna biraz kırıldı.'}}],()=>S.partner===p);
 }else{
  const p=R(family),money=S.age>=18&&relationshipAge(p)>=18&&Math.random()<.35;
  if(money){const amount=Math.round(Math.min(1500,500*wm()));queueLifeChoice('Ailenden yardım isteği',p.n+' beklenmedik bir masraf için '+TL(amount)+' destek istiyor.',[{t:'Maddi destek ver',p:1,run:()=>{if(S.p<amount)return 'Bu masrafı karşılayacak paran yok; bütçeni dürüstçe anlattın.';S.p-=amount;p.b=cl(p.b+8);apply({m:2});return p.n+' kişisine '+TL(amount)+' destek oldun.'}},{t:'Başka şekilde yardımcı ol',run:()=>{p.b=cl(p.b+3);return 'Masrafı azaltmanın yollarını birlikte araştırdınız.'}},{t:'Kibarca reddet',run:()=>{p.b=cl(p.b-2);return 'Bu kez maddi destek veremedin.'}}],()=>S.people.includes(p)&&!p.dead)}
  else queueLifeChoice('Aile buluşması',p.n+' ailece birlikte yemek yiyip sohbet etmeyi öneriyor.',[{t:'Katıl',p:1,run:()=>{p.b=cl(p.b+5);apply({m:4});return 'Ailenle keyifli bir buluşma yaptın.'}},{t:'Bu kez katılma',run:()=> 'Bir sonraki buluşmada görüşmek üzere haber verdin.'}],()=>S.people.includes(p)&&!p.dead);
 }
}
