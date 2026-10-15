// Yaşa uygun arkadaş olayları; seçimlerdeki etkiler bağ, mutluluk ve isteğe bağlı zekâdır.
const FRIENDSHIP_EVENTS=[
 {id:'playground',a:[5,11],title:'Parkta yeni bir oyun',text:'{n} parkta birlikte yeni bir oyun kurmak istiyor.',yes:'Oyuna katıl',good:'Birlikte oyunun kurallarını uydurdunuz, çok eğlendiniz.',bond:6,m:4},
 {id:'drawing',a:[5,11],title:'Birlikte resim yapalım',text:'{n} kocaman bir resim çizip birlikte boyamayı öneriyor.',yes:'Boyalarını getir',good:'Rengârenk bir resim yaptınız; ikiniz de kendi köşenize imza attınız.',bond:5,m:3,z:1},
 {id:'toy',a:[5,11],title:'En sevdiği oyuncağı kayboldu',text:'{n} oyuncağını bulamıyor ve üzülmüş. Aramasına yardım eder misin?',yes:'Birlikte ara',good:'Oyuncağı bir bankın altında buldunuz. Arkadaşın sana sevinçle sarıldı.',bond:7,m:3},
 {id:'school-project',a:[6,11],title:'Sınıf için bir maket',text:'{n} okul projesindeki maketi seninle yapmak istiyor.',yes:'Birlikte hazırla',good:'Kartonları kesip güzel bir maket yaptınız; öğretmeniniz emeğinizi beğendi.',bond:5,m:3,z:2},
 {id:'study',a:[12,17],title:'Birlikte sınava hazırlık',text:'{n} anlamadığı konuları birlikte tekrar etmek istiyor.',yes:'Beraber çalış',good:'Birbirinize sorular sorarak çalıştınız. Zor konular artık daha anlaşılır.',bond:5,m:2,z:2},
 {id:'school-club',a:[12,17],title:'Kulüpte boş bir yer var',text:'{n} okuldaki etkinlik kulübüne senin de katılmanı istiyor.',yes:'Birlikte katıl',good:'Kulüpte yeni fikirler ürettiniz ve birlikte güzel bir gün geçirdiniz.',bond:5,m:4,z:1},
 {id:'online-game',a:[12,17],title:'Takımda bir kişi eksik',text:'{n} akşam çevrim içi oyunda takımına katılmanı istiyor.',yes:'Bir süre oyna',good:'Zorlu bölümü birlikte geçtiniz. Sonra oyunu kapatıp biraz sohbet ettiniz.',bond:5,m:4},
 {id:'exam-support',a:[12,17],title:'Sınavı kötü geçmiş',text:'{n} sınav sonucuna üzülmüş ve seninle konuşmak istiyor.',yes:'Dinle ve destek ol',good:'Bir notun her şeyi belirlemediğini konuştunuz. Arkadaşın kendini daha iyi hissetti.',bond:7,m:2},
 {id:'board-game',a:[5,100],title:'Oyun masası hazır',text:'{n} birlikte bir kutu oyunu oynamayı öneriyor.',yes:'Masaya otur',good:'Oyunda bol bol güldünüz. Kimin kazandığından çok birlikte olmanın tadını çıkardınız.',bond:5,m:4},
 {id:'misunderstanding',a:[5,100],title:'Aranızda bir yanlış anlaşılma',text:'{n} söylediğin bir söze kırılmış. Ne demek istediğini soruyor.',yes:'Sakin sakin açıkla',good:'Birbirinizi dinleyince yanlış anlaşılma çözüldü. Aranızdaki gerginlik geçti.',bond:6,m:2,no:'Konuşmayı ertele',bad:'Konuşmayı sonraya bıraktınız; arkadaşın hâlâ biraz kırgın.',loss:3},
 {id:'birthday-surprise',a:[5,100],title:'Küçük bir doğum günü sürprizi',text:'{n} doğum gününe kimsenin önem vermediğini düşünüyor.',yes:'Ona bir kart hazırla',good:'Hazırladığın içten kart arkadaşını çok mutlu etti. Uzun uzun sohbet ettiniz.',bond:7,m:4},
 {id:'new-hobby',a:[5,100],title:'Yeni bir hobi',text:'{n} kâğıttan şekiller yapmayı öğreniyor ve sana da göstermek istiyor.',yes:'Birlikte dene',good:'İlk denemeler biraz yamuk oldu ama birlikte öğrenmek çok keyifliydi.',bond:4,m:3,z:1},
 {id:'walk',a:[18,100],title:'Uzun zamandır konuşmadınız',text:'{n} birlikte yürüyüş yapıp son zamanlarda olanları konuşmak istiyor.',yes:'Yürüyüşe çık',good:'Yürürken uzun uzun sohbet ettiniz. Birbirinizi ne kadar özlediğinizi fark ettiniz.',bond:6,m:4},
 {id:'moving',a:[18,100],title:'Taşınırken yardıma ihtiyacı var',text:'{n} yeni evine taşınırken kutuları düzenlemek için yardım istiyor.',yes:'Yardıma git',good:'Kutuları birlikte yerleştirdiniz. Yoruldunuz ama sonunda oturup güzelce sohbet ettiniz.',bond:8,m:3},
 {id:'career-talk',a:[18,100],title:'Bir yol ayrımında',text:'{n} iş hayatıyla ilgili bir karar vermekte zorlanıyor ve fikrini merak ediyor.',yes:'Birlikte düşün',good:'Seçenekleri birlikte konuştunuz. Kararı kendisi verdi ama desteğin ona iyi geldi.',bond:6,m:2},
 {id:'old-memories',a:[18,100],title:'Eski bir fotoğraf',text:'{n} birlikte çekildiğiniz eski bir fotoğraf bulmuş ve anıları hatırlamak istiyor.',yes:'Anıları paylaş',good:'Unuttuğunuz ayrıntıları hatırlayıp güldünüz. Dostluğunuzun değerini bir kez daha hissettiniz.',bond:5,m:4}
];
function friendshipAgeCompatible(p){const age=relationshipAge(p);return S.age>=5&&(S.age<18?age>=5&&age<18&&Math.abs(age-S.age)<=3:age>=18)}
function friendshipEventOptions(p){return friendshipAgeCompatible(p)?FRIENDSHIP_EVENTS.filter(e=>S.age>=e.a[0]&&S.age<=e.a[1]&&relationshipAge(p)>=e.a[0]&&relationshipAge(p)<=e.a[1]):[]}
function pickFriendshipEvent(p){
 const options=friendshipEventOptions(p),recent=S.recentFriendEvents||[];
 if(!options.length)return null;
 const fresh=options.filter(e=>!recent.includes(e.id)),event=R(fresh.length?fresh:options);
 S.recentFriendEvents=[...recent,event.id].slice(-4);return event;
}
// Yakınlar da etkileşim başlatır; otomatik arkadaş eklenmez.
function annualRelationshipInvitation(){
 if(Math.random()>=.45||!annualLifeFlag('relationship-invitation'))return;
 const friends=(S.people||[]).filter(p=>!p.dead&&(/arkadaş/i.test(p.role)||p.friend)&&friendshipEventOptions(p).length>0),family=(S.people||[]).filter(p=>!p.dead&&relationshipFamily(p));
 const candidates=[];
 if(friends.length)candidates.push('friend');if(S.partner&&S.age>=14&&relationshipAge(S.partner)>=14)candidates.push('partner');if(S.age>=3&&family.length&&(!Number.isFinite(S.lastFamilyInvitationAge)||S.age-S.lastFamilyInvitationAge>=4)&&Math.random()<.2)candidates.push('family');if(!candidates.length)return;
 const type=R(candidates);
 if(type==='friend'){
  const p=R(friends),event=pickFriendshipEvent(p);if(!event)return;
  queueLifeChoice(event.title,event.text.replace('{n}',p.n),[
   {t:event.yes,p:1,run:()=>{p.b=cl(p.b+event.bond);apply({m:event.m,z:event.z||0});return event.good}},
   {t:event.no||'Bu kez katılma',run:()=>{if(event.loss)p.b=cl(p.b-event.loss);return event.bad||'Bu kez katılamayacağını söyledin. Bir başka gün görüşmek üzere sözleştiniz.'}}
  ],()=>S.people.includes(p)&&!p.dead&&friendshipAgeCompatible(p));
 }else if(type==='partner'){
  const p=S.partner;queueLifeChoice('İlişkiniz hakkında konuşma',p.n+' son zamanlarda yeterince birlikte vakit geçirmediğinizi düşünüyor.',[{t:'Dinle ve birlikte zaman ayır',p:1,run:()=>{p.b=cl(p.b+5);apply({m:3});return 'Birbirinizi daha iyi anladınız.'}},{t:'Savunmaya geç',run:()=>{p.b=cl(p.b-8);apply({m:-3});return 'Konuşma tartışmaya dönüştü.'}},{t:'Sonra konuşalım de',run:()=>{p.b=cl(p.b-3);return 'Konuyu erteledin; partnerin buna biraz kırıldı.'}}],()=>S.partner===p);
 }else{
  S.lastFamilyInvitationAge=S.age;
  const p=R(family),money=S.age>=18&&relationshipAge(p)>=18&&Math.random()<.35;
  if(money){const amount=Math.round(Math.min(1500,500*wm()));queueLifeChoice('Ailenden yardım isteği',p.n+' beklenmedik bir masraf için '+TL(amount)+' destek istiyor.',[{t:'Maddi destek ver',p:1,run:()=>{if(S.p<amount)return 'Bu masrafı karşılayacak paran yok; bütçeni dürüstçe anlattın.';S.p-=amount;p.b=cl(p.b+8);apply({m:2});return p.n+' kişisine '+TL(amount)+' destek oldun.'}},{t:'Başka şekilde yardımcı ol',run:()=>{p.b=cl(p.b+3);return 'Masrafı azaltmanın yollarını birlikte araştırdınız.'}},{t:'Kibarca reddet',run:()=>{p.b=cl(p.b-2);return 'Bu kez maddi destek veremedin.'}}],()=>S.people.includes(p)&&!p.dead)}
  else queueLifeChoice('Aile buluşması',p.n+' ailece birlikte yemek yiyip sohbet etmeyi öneriyor.',[{t:'Katıl',p:1,run:()=>{p.b=cl(p.b+5);apply({m:4});return 'Ailenle keyifli bir buluşma yaptın.'}},{t:'Bu kez katılma',run:()=> 'Bir sonraki buluşmada görüşmek üzere haber verdin.'}],()=>S.people.includes(p)&&!p.dead);
 }
}
