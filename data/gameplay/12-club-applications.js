// Aynı branşta seçilen kulübe başvuru: yılda 3, aynı takıma yılda 1 kez.
function clubApplicationContext(){const c=sportsContractContext();return c&&(c.job.football||c.career.sport==='basketball')?c:null}
function clubApplications(){
 if(!S.clubApplications||S.clubApplications.age!==S.age)S.clubApplications={age:S.age,attempts:{},teams:{}};
 return S.clubApplications;
}
function clubApplicationChance(c,team){
 const sport=c.job.football?'football':'basketball',strength=clubStrength(sport,team);
 const current=Math.max(0,Math.min(100,Number(S.perf)||0));
 const rating=Number.isFinite(c.career.seasonRating)?current*.75+c.career.seasonRating*.25:current;
 // Güçlü takımın beklentisi daha yüksek; yüksek performans garanti vermez.
 const threshold=strength*.9;
 return Math.max(.04,Math.min(.9,1/(1+Math.exp(-(rating-threshold)/11))));
}
function openClubApplications(){
 const c=clubApplicationContext();if(!c)return;
 const sport=c.job.football?'football':'basketball';
 pgOpen(()=>({title:'TAKIMA BAŞVUR',intro:'<div class="sports-stats"><b>İstediğin takımı seç</b><p>Ülke ve lig seçerek bir kulübe başvur. Başvuru için o ülkede bulunmalısın. Yılda 3 başvuru; aynı takıma 1 kez.</p></div>',rows:[...new Set(Object.values(c.leagues).filter(l=>sport==='football'||l.sport===sport).map(l=>l.country))].map(country=>({ic:'🌍',t:country,d:country===LOC().ctry?'Bulunduğun ülke':'Başvurmadan önce bu ülkeye seyahat et',f:()=>openClubApplicationLeagues(country,sport)}))}));
}
function openClubApplicationLeagues(country,sport){
 pgOpen(()=>{const c=clubApplicationContext();if(!c)return{title:'TAKIMA BAŞVUR',rows:[]};return{title:country.toLocaleUpperCase('tr-TR')+' · TAKIMLAR',rows:Object.keys(c.leagues).filter(id=>c.leagues[id].country===country&&(sport==='football'||c.leagues[id].sport===sport)).sort((a,b)=>c.leagues[a].tier-c.leagues[b].tier).map(id=>({ic:'🏆',t:c.leagues[id].name,d:c.leagues[id].teams.length+' takım',f:()=>openClubApplicationTeams(id)}))}});
}
function openClubApplicationTeams(league){
 pgOpen(()=>{const c=clubApplicationContext(),l=c&&c.leagues[league];if(!l)return{title:'TAKIMA BAŞVUR',rows:[]};
 const sport=c.job.football?'football':'basketball',year=clubApplications(),used=year.attempts[sport]||0;
 return{title:'KULÜP SEÇ',intro:'<div class="sports-stats"><b>'+esc(l.country+' · '+l.name)+'</b><p>Performans: '+Math.round(Number(S.perf)||0)+'% · Kalan başvuru: '+Math.max(0,3-used)+'/3</p></div>',rows:l.teams.map(team=>{const same=team===c.career.team&&league===c.career.league,key=sport+':'+league+':'+team,tried=year.teams[key];return{ic:'🛡️',t:team,d:same?'Mevcut takımın':tried?'Bu yıl başvurdun':'Kulüp gücü: '+clubStrength(sport,team)+'/100 · Kabul şansı: %'+Math.round(clubApplicationChance(c,team)*100),disabled:same||!!tried||used>=3,f:()=>confirmClubApplication(league,team)}})};
 });
}
function confirmClubApplication(league,team){
 const c=clubApplicationContext(),l=c&&c.leagues[league];if(!l||!l.teams.includes(team))return;
 const life=S,job=c.job;
 modal('Takıma başvur',team+' seni performansın ve kulübün beklentisine göre değerlendirecek. Başvuru ücretsizdir. Mevcut takımından hemen ayrılmazsın.',[{t:'Başvur',p:1,f:()=>{if(S===life&&S.job===job)submitClubApplication(league,team)}},{t:'Vazgeç'}]);
}
function submitClubApplication(league,team){
 const c=clubApplicationContext(),l=c&&c.leagues[league];if(!c||!l||!l.teams.includes(team)||S.dead)return;
 const sport=c.job.football?'football':'basketball';
 if(S.age<18||S.uni||S.jail>0||c.job.football&&S.f||!c.job.football&&l.sport!=='basketball')return;
 if(LOC().ctry!==l.country)return modal('Önce seyahat et',l.country+' ülkesinde bulunmadan bu takıma başvuramazsın.',[{t:'Kapat',p:1}]);
 if(c.career.team===team&&c.career.league===league)return;
 const year=clubApplications(),key=sport+':'+league+':'+team;
 if((year.attempts[sport]||0)>=3||year.teams[key])return modal('Başvuru sınırı','Yılda 3 başvuru yapabilirsin; aynı takıma yalnızca bir kez.',[{t:'Kapat',p:1}]);
 year.attempts[sport]=(year.attempts[sport]||0)+1;year.teams[key]=true;
 if(Math.random()>=clubApplicationChance(c,team)){
   line(team+' başvurunu reddetti. Mevcut takımında devam ediyorsun.','bad');render();pgDraw();
   return modal('Başvuru reddedildi',team+' bu kez performansını kadrosu için yeterli bulmadı. Antrenmanla performansını geliştirip gelecek yıl tekrar deneyebilirsin.',[{t:'Kapat',p:1}]);
 }
 const current=c.leagues[c.career.league],rating=Math.max(0,Math.min(100,Number(S.perf)||0));
 const factor=Math.max(.75,Math.min(1.3,.9+rating*.002+(l.tier<current.tier?.12:l.tier>current.tier?-.12:0)));
 const salary=Math.max(1,Math.round(c.job.s*factor));
 const offer=c.career.applicationOffer={team,league,salary,originalSalary:salary,rating,age:S.age,season:c.career.season,closed:false,negotiated:false,application:true};
 line(team+' başvurunu kabul etti! Yıllık teklif: '+TL(salary),'good');render();pgDraw();
 modal('Başvuru kabul edildi',team+' seni kadrosunda istiyor. Yıllık maaş: '+TL(salary)+'. Sözleşmeyi kabul edersen yeni takımına geçersin.',sportsOfferButtons(S,c.job,offer));
}
function openClubApplicationOffer(){
 const c=clubApplicationContext(),offer=c&&c.career.applicationOffer;if(!offer||!sportsOfferValid(S,c.job,offer))return;
 modal('Başvuru teklifi',offer.team+' · '+TL(offer.salary)+'/yıl',sportsOfferButtons(S,c.job,offer));
}
const acceptSportsOfferBeforeApplications=acceptSportsOffer;
acceptSportsOffer=function(life,job,offer){
 const valid=sportsOfferValid(life,job,offer),result=acceptSportsOfferBeforeApplications(life,job,offer);
 if(valid&&S===life&&S.job===job){const c=sportsContractContext();c.career.offer=null;c.career.applicationOffer=null;render();pgDraw()}
 return result;
};
const pgOpenBeforeClubApplications=pgOpen;
pgOpen=function(builder){return pgOpenBeforeClubApplications(()=>{const page=builder(),c=clubApplicationContext();
 if(c&&(page.title==='FUTBOL KARİYERİ'||page.title==='SPOR KARİYERİ'&&page.jobDetails)){
   page.rows.push({ic:'🛡️',t:'Takıma başvur',d:'İstediğin kulübe başvur · Performansına göre değerlendiril',f:openClubApplications});
   const offer=c.career.applicationOffer;if(offer&&sportsOfferValid(S,c.job,offer))page.rows.unshift({ic:'📩',t:'Başvuru teklifi',d:offer.team+' · '+TL(offer.salary)+'/yıl',f:openClubApplicationOffer});
 }
 return page;
})};
