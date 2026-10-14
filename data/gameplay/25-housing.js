// Mezuniyet sonrası barınma: kiracı olunan ev, kiraya verilen mülklerden ayrıdır.
const RENTAL_HOMES=[{id:'room',n:'Paylaşımlı evde oda',monthly:3000,ic:'🛏️'},{id:'studio',n:'Stüdyo daire',monthly:5500,ic:'🏢'},{id:'apartment',n:'İki odalı daire',monthly:8500,ic:'🏠'}];
function availableOwnedHome(){return syncPropertyUnits().find(unit=>!unit.rented)}
function updateHousingStatus(){
 if(!S||!S.housingRequired)return;
 const owned=availableOwnedHome();
 if(owned){if(S.housingLease){S.p+=S.housingLease.deposit||0;S.housingLease=null}S.street=false;return}
 const loc=LOC(),lease=S.housingLease;
 S.street=!(lease&&lease.country===loc.ctry&&lease.city===loc.city);
}
function rentalMonthlyPrice(home){const loc=LOC(),scale=(CD[loc.ctry]||CD['Türkiye']).cf||1;const city=loc.ctry==='Türkiye'?Math.max(.8,Math.min(1.5,(RENT[loc.city]||18000)/18000)):1;return Math.round(home.monthly*scale*city)}
function openRentalHomes(){
 if(!S||S.dead)return;const life=S;
 pgOpen(()=>{if(S!==life)return{title:'KİRALIK EVLER',rows:[]};updateHousingStatus();const loc=LOC(),lease=S.housingLease,owned=availableOwnedHome();const status=owned?'Kendi evinde kalıyorsun.':lease&&!S.street?lease.name+' · '+lease.city+' · Aylık '+TL(lease.monthly):S.housingRequired?'Kalacak evin yok; sokaktasın.':'Yeni bir konut seçebilirsin.';
 const rows=RENTAL_HOMES.map(home=>{const monthly=rentalMonthlyPrice(home);return{ic:home.ic,t:home.n,d:'Aylık '+TL(monthly)+' · Depozito '+TL(monthly),f:()=>{
  if(S!==life||S.dead)return;if(S.age<18)return modal('Ev kirala','18 yaşında olmalısın.',[{t:'Kapat',p:1}]);
  modal('Ev kirala',home.n+' · '+loc.city+'. Aylık '+TL(monthly)+'. Bir aylık depozito şimdi alınır; kira yıllık giderlere eklenir.',[{t:'Kirala',p:1,f:()=>{
   if(S!==life||S.dead||LOC().city!==loc.city||LOC().ctry!==loc.ctry)return;
   const refund=S.housingLease?S.housingLease.deposit||0:0;
   if(S.p+refund<monthly)return modal('Ev kirala','Depozito için yeterli paran yok.',[{t:'Kapat',p:1}]);
   if(availableOwnedHome())return modal('Ev kirala','Kendi boş evinde kalabilirsin.',[{t:'Kapat',p:1}]);
   S.p+=refund-monthly;S.housingLease={id:home.id,name:home.n,monthly,deposit:monthly,city:loc.city,country:loc.ctry};S.housingRequired=true;S.street=false;
   line(home.n+' kiraladın. Aylık kira: '+TL(monthly)+'.','good');render();pgDraw();queueResultNotice('Evine yerleştin',home.n+' artık yeni evin. Depozito: '+TL(monthly)+'. Yıllık kira: '+TL(monthly*12)+'.',[{t:'Kapat',p:1}]);
  }},{t:'Vazgeç'}]);
 }}});
 if(lease)rows.push({ic:'🚪',t:'Kiralık evden çık',d:'Depoziton iade edilir; başka evin yoksa sokakta kalırsın.',f:()=>modal('Evden çık','Kiralamayı sonlandırmak istiyor musun?',[{t:'Evden çık',f:()=>{if(S!==life||S.housingLease!==lease)return;S.p+=lease.deposit||0;S.housingLease=null;updateHousingStatus();line('Kiralık evden çıktın.');render();pgDraw()}},{t:'Vazgeç',p:1}])});
 rows.push({ic:'🗝️',t:'Mülklerim',d:'Kendi evlerini yönet',f:openMyAssets});
 return{title:'KİRALIK EVLER',intro:'<div class="sports-stats"><b>Barınma · '+esc(loc.city)+'</b><p>'+esc(status)+'</p></div>',rows};
 });
}
const yearlyCostBeforeHousing=yearlyCost;
yearlyCost=function(nn){updateHousingStatus();const cost=yearlyCostBeforeHousing(nn);if(!S||!S.housingRequired||S.uni||S.age<18||S.street)return cost;const lease=S.housingLease;if(lease&&!availableOwnedHome()){cost.p=cost.p.filter(([name])=>name!=='barınma');cost.p.push(['ev kirası',lease.monthly*12]);cost.t=cost.p.reduce((sum,p)=>sum+p[1],0);cost.d=cost.p.map(p=>p[0]+' '+TL(p[1])).join(', ')}return cost};
const renderBeforeHousing=render;
render=function(){updateHousingStatus();return renderBeforeHousing()};
const nextYearBeforeHousing=nextYear;
nextYear=function(){
 if(!S||S.dead)return nextYearBeforeHousing();const life=S,age=S.age,wasUniversity=!!S.uni;updateHousingStatus();
 if(S.housingLease&&!availableOwnedHome()&&!S.uni){const income=S.job?salaryBreakdown(S.job.s).net:0;if(S.p+income<S.housingLease.monthly*12){S.p+=S.housingLease.deposit||0;S.housingLease=null;updateHousingStatus();queueResultNotice('Kiranı karşılayamıyorsun','Kira sözleşmen sona erdi, depoziton iade edildi. Yeni bir ev seçmelisin.',[{t:'Ev seç',p:1,f:openRentalHomes},{t:'Kapat'}])}}
 const result=nextYearBeforeHousing();if(S!==life||S.dead||S.age<=age)return result;
 if(wasUniversity&&!S.uni){S.housingRequired=true;updateHousingStatus();if(S.street)queueResultNotice('Kalacak bir ev seç','Üniversite hayatın bitti. Kalabileceğin kendi evin yok. Kiralık ev seçebilir veya ev satın alabilirsin; ev seçene kadar sokakta kalacaksın.',[{t:'Ev seç',p:1,f:openRentalHomes},{t:'Ev satın al',f:openAssets},{t:'Sonra'}])}
 else if(S.housingRequired&&S.street&&!S.uni){apply({h:-4,m:-5});line('Sokakta zor bir yıl geçirdin. (-4 sağlık, -5 mutluluk)','bad');queueResultNotice('Kalacak evin yok','Sokakta kaldığın için sağlığın ve mutluluğun azaldı. Bir ev seçmelisin.',[{t:'Ev seç',p:1,f:openRentalHomes},{t:'Kapat'}])}
 render();pgDraw();return result;
};
$('next').onclick=nextYear;
const pgOpenBeforeHousing=pgOpen;
pgOpen=function(builder){return pgOpenBeforeHousing(()=>{const page=builder();if(S&&['VARLIKLAR','MÜLKLERİM','ASSETS','MY PROPERTIES'].includes(page.title)){updateHousingStatus();page.rows.unshift({ic:'🏠',t:'Barınma / Kiralık evler',d:S.housingRequired?(S.street?'Sokakta kalıyorsun':availableOwnedHome()?'Kendi evinde kalıyorsun':S.housingLease.name+' · '+TL(S.housingLease.monthly)+'/ay'):'Kalacağın evi seç',f:openRentalHomes})}return page})};
