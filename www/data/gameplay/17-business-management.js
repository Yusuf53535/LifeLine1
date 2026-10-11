// İşletmeye özel kararlar ve kalıcı ama küçük kalite/rekabet etkileri.
function businessManagementState(b){
 return b.management||(b.management={quality:0,competition:1,reviews:[],actions:{}});
}
function businessManagementAction(b,key,cost,action){
 if(!S.biz||S.biz!==b||S.dead)return;
 const state=businessManagementState(b);
 if(state.actions[key]===S.age)return modal('Bu yıl yaptın','Bu kararı yılda bir kez uygulayabilirsin.',[{t:'Kapat',p:1}]);
 if(S.p<cost)return modal('Yetersiz bakiye','Bu karar için '+TL(cost)+' gerekiyor.',[{t:'Kapat',p:1}]);
 state.actions[key]=S.age;S.p-=cost;const text=action(state);line(text,'good');render();pgDraw();modal('İşletme kararı',text+(cost?' Maliyet: '+TL(cost):''),[{t:'Kapat',p:1}]);
}
function openBusinessManagement(){
 const life=S,b=S.biz;if(!b)return;
 pgOpen(()=>{if(S!==life||S.biz!==b)return{title:'İŞLETME YÖNETİMİ',rows:[]};const state=businessManagementState(b);return{title:'İŞLETME YÖNETİMİ',intro:'<div class="sports-stats"><b>'+esc(b.n)+'</b><p>Ürün/hizmet kalitesi: '+state.quality+'/5 · Rekabet: '+state.competition+'/3</p></div>',rows:[
 {ic:'💡',t:'Ürün / hizmet geliştir',d:'Kaliteyi artır · '+TL(Math.round(b.inv*.015)),disabled:state.quality>=5,f:()=>businessManagementAction(b,'product',Math.round(b.inv*.015),s=>{s.quality=Math.min(5,s.quality+1);b.rep=cl((b.rep||50)+2);return 'Ürün ve hizmet kaliten gelişti; gelecek yıllarda müşterilerin ilgisi artacak.'})},
 {ic:'⭐',t:'Müşteri yorumları',d:state.reviews.length+' yorum · Geri bildirimleri incele',f:()=>openBusinessReviews(b)},
 {ic:'👥',t:'Çalışan eğitimi ve toplantısı',d:'Moral +6 · '+TL(Math.round(b.inv*.008)),disabled:!(b.emp>0),f:()=>businessManagementAction(b,'staff',Math.round(b.inv*.008),()=>{b.mor=cl((b.mor||60)+6);b.rep=cl((b.rep||50)+1);return 'Ekibin yeni beceriler öğrendi; çalışan morali yükseldi.'})},
 {ic:'🏪',t:'Rakip analizi',d:'Rekabete hazırlan · '+TL(Math.round(b.inv*.005)),f:()=>businessManagementAction(b,'rival',Math.round(b.inv*.005),s=>{s.competition=Math.max(0,s.competition-1);b.rep=cl((b.rep||50)+2);return 'Rakiplerin tekliflerini inceleyip işletmeni farklılaştırdın. Rekabetin satışlara etkisi azaldı.'})}
 ]}});
}
function openBusinessReviews(b){
 pgOpen(()=>S.biz!==b?{title:'MÜŞTERİ YORUMLARI',rows:[]}:{title:'MÜŞTERİ YORUMLARI',intro:'<div class="sports-stats"><b>Müşterilerin ne düşünüyor?</b><p>'+businessManagementState(b).reviews.map(r=>esc(r.stars+' / 5 · '+r.text)).join('</p><p>')+'</p></div>',rows:[{ic:'💬',t:'Geri bildirimlere yanıt ver',d:'Yılda bir kez · İtibar +3',f:()=>businessManagementAction(b,'reviews',0,()=>{b.rep=cl((b.rep||50)+3);return 'Müşterilerin görüşlerini dinleyip çözüm önerilerini paylaştın.'})}]});
}
function annualBusinessDecision(b){
 const state=businessManagementState(b),stars=Math.max(1,Math.min(5,Math.round((b.rep||50)/25+1+(Math.random()-.5))));
 state.reviews.push({age:S.age,stars,text:stars>=4?'Hizmetten memnun kaldık, tekrar geleceğiz.':stars>=3?'Genel olarak iyi, bazı şeyler geliştirilebilir.':'Hizmet ve iletişim konusunda iyileştirme bekliyoruz.'});if(state.reviews.length>8)state.reviews.shift();
 if(Math.random()>=.35||!annualLifeFlag('business-decision'))return;
 const fee=Math.round(b.inv*.006);
 queueLifeChoice('İşletmende yeni bir rakip',b.n+' ile benzer bir işletme müşterilerine tanıtım yapıyor. Nasıl karşılık vereceksin?',[
 {t:'Kalite ve hizmeti öne çıkar',p:1,run:()=>{b.rep=cl((b.rep||50)+3);state.competition=Math.min(3,state.competition+.25);return 'Kaliteni anlatarak sadık müşterilerinle bağını güçlendirdin.'}},
 {t:'Küçük bir kampanya yap',run:()=>{if(S.p<fee)return 'Kampanya bütçen yok; mevcut hizmetine odaklandın.';S.p-=fee;state.competition=Math.max(0,state.competition-.5);return 'Kampanyan ilgi gördü. Maliyet: '+TL(fee)}},
 {t:'Mevcut plana devam et',run:()=>{state.competition=Math.min(3,state.competition+.5);return 'Rakibin bir miktar müşteri kazandı; rekabet baskısı arttı.'}}
 ],()=>S.biz===b);
}
const bizYearBeforeManagement=bizYear;
bizYear=function(b){b.ins=false;const state=businessManagementState(b);if(state.appliedAge!==S.age){state.appliedAge=S.age;b.mod=b.mod||{rev:0,exp:0};b.mod.rev=(b.mod.rev||0)+state.quality*.015-state.competition*.025}
 const result=bizYearBeforeManagement(b);if(S.biz===b&&!S.dead)annualBusinessDecision(b);return result};
const pgOpenBeforeBusinessManagement=pgOpen;
pgOpen=function(builder){return pgOpenBeforeBusinessManagement(()=>{const page=builder();if(S.biz&&page.title===S.biz.n)page.rows.unshift({ic:'🧑‍💼',t:'İşletme yönetimi',d:'Ürünler, müşteri yorumları, çalışanlar ve rakipler',f:openBusinessManagement});if(S.biz&&[S.biz.n,'İŞLETME YÖNETİMİ','MÜŞTERİ YORUMLARI'].includes(page.title))page.rows.forEach(row=>row.cardClass=(row.cardClass||'')+' business-compact-row');return page})};
