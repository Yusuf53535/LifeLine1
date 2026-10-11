// Sakatlık, kadro rolü, sözleşme ve spor sonrası antrenörlük.
function athleteState(){const c=sportsContractContext();if(!c)return null;
 const f=c.career;f.contractUntil=f.contractUntil??S.age+3;f.availability=f.availability??1;return c;
}
function prepareAthleteSeason(){
 const c=athleteState();if(!c||c.career.preparedAge===S.age)return;
 const f=c.career;f.preparedAge=S.age;
 if(f.injury&&f.injury.untilAge<=S.age){f.injury=null;queueResultNotice('Sakatlığı atlattın','Yeniden tam antrenmanlara katılabiliyorsun.',[{t:'Kapat',p:1}])}
 if(S.age>32)S.perf=cl(S.perf-2);
 if(!f.injury&&Math.random()<.06+Math.max(0,80-S.h)/500){
  const months=rnd(2,8);f.injury={name:R(['Ayak bileği burkulması','Kas zorlanması','Diz zorlanması']),months,untilAge:S.age+1};apply({h:-3});
  queueResultNotice('Sporcu sakatlığı',f.injury.name+' yaşadın. Yaklaşık '+months+' ay sahalardan uzak kalacaksın; bu sezon daha az maç oynayacaksın.',[{t:'Kapat',p:1}]);
 }
 f.playingStatus=S.perf<45||S.perf<clubStrength(c.job.football?'football':f.sport,f.team)*.65?'Yedek':'İlk kadro';
 f.availability=(f.playingStatus==='Yedek'?.5:1)*(f.injury?Math.max(.2,1-f.injury.months/12):1);
 if(f.playingStatus==='Yedek')queueResultNotice('Yedek kadrodasın','Performansın nedeniyle bu sezon daha az süre alacaksın. Antrenman yaparak ilk kadro şansını artırabilirsin.',[{t:'Kapat',p:1}]);
}
function retireAthlete(){
 const c=athleteState();if(!c||S.dead)return;const sport=c.job.football?'football':c.career.sport;
 S.retiredSports=S.retiredSports||{};S.retiredSports[sport]={team:c.career.team,position:c.career.position,performance:S.perf,age:S.age};
 line(c.career.team+' takımındaki oyunculuk kariyerini bitirdin.','gold');S.job=null;PG=[];render();drawOcc();pgDraw();
 queueResultNotice('Sporculuktan emekli oldun','İstersen aynı branşta antrenör olarak çalışmaya devam edebilirsin.',[{t:'Antrenörlüğe geç',p:1,f:()=>startSportsCoaching(sport)},{t:'Kapat'}]);
}
function startSportsCoaching(sport){
 if(!S||S.dead||!S.retiredSports||!S.retiredSports[sport]||!canStartCareer())return;
 if(S.biz)return modal('Önce işletmeni bırak','Antrenörlüğe başlamadan önce işletmeni satmalı veya kapatmalısın.',[{t:'Kapat',p:1}]);
 if(S.age<18||S.uni||S.jail>0)return modal('Antrenörlük','Öğrenci veya hapisteyken antrenörlüğe başlayamazsın.',[{t:'Kapat',p:1}]);
 const leagues=sport==='football'?FOOTBALL_LEAGUES:TEAM_SPORT_LEAGUES,country=LOC().ctry;
 const ids=Object.keys(leagues).filter(id=>leagues[id].country===country&&(sport==='football'||leagues[id].sport===sport));if(!ids.length)return;
 const old=S.retiredSports[sport],id=ids.find(id=>leagues[id].teams.includes(old.team))||ids[0],team=leagues[id].teams.includes(old.team)?old.team:R(leagues[id].teams);
 S.job={n:(sport==='football'?'Futbol':sport==='basketball'?'Basketbol':'Voleybol')+' antrenörü · '+team,s:Math.round((240000+old.performance*3500)*wm()),coach:{sport,league:id,country,team,table:[],years:0}};S.perf=cl(old.performance*.7);line(team+' için antrenör olarak çalışmaya başladın.','gold');render();drawOcc();coachJobPage();
}
function coachJobPage(){const life=S,job=S.job;PG=[];pgOpen(()=>{const j=S.job,c=j&&j.coach;if(!c||S!==life||S.job!==job)return{title:'ANTRENÖRLÜK',rows:[]};return{title:'ANTRENÖRLÜK',jobDetails:true,intro:'<div class="sports-stats"><b>'+esc(c.team)+'</b><p>Antrenörlük yılı: '+c.years+' · Performans: '+S.perf+'%</p></div>',rows:[{ic:'📋',t:'Takım antrenmanı',d:'Yılda 1 · Performans +6',f:()=>{if(S!==life||S.job!==job||S.dead)return;if(S.worked)return modal('Antrenman','Bu yıl zaten çalıştın.',[{t:'Kapat',p:1}]);S.worked=true;S.perf=cl(S.perf+6);line('Takımının hazırlığını geliştirdin.','good');render();pgDraw()}},{ic:'🏆',t:'Lig tablosu',d:'Takımının son sezon sonuçları',f:()=>pgOpen(()=>({title:'LİG TABLOSU',intro:c.table.length?europeanTableHtml(c.table,c.team):'<div class="sports-stats"><p>İlk sezon sonunda tablo görünecek.</p></div>',rows:[]}))},{ic:'🚪',t:'İstifa et',d:'Antrenörlükten ayrıl',f:()=>{if(S!==life||S.job!==job||S.dead)return;S.job=null;PG=[];render();drawOcc();pgDraw()}}]}})}
function finishAthleteSeason(){
 const c=athleteState();if(!c)return;const f=c.career,sport=c.job.football?'football':f.sport;
 const maxAge=sport==='football'?42:sport==='basketball'?45:43;
 if(S.age>=maxAge){retireAthlete();return}
 if(S.age>=35&&f.retirementNoticeAge!==S.age){f.retirementNoticeAge=S.age;queueLifeChoice('Kariyerinin sonraki adımı','Oyunculuğa devam etmek veya emekli olup antrenörlüğe geçmek ister misin?',[{t:'Oynamaya devam et',p:1,run:()=> 'Oyunculuğa bir sezon daha devam etmeye karar verdin.'},{t:'Emekli ol',run:()=>{retireAthlete();return null}}],()=>S.job===c.job)}
 if(S.age>=f.contractUntil&&f.contractNoticeAge!==S.age){
  f.contractNoticeAge=S.age;f.expiredContract=true;
  queueLifeChoice('Sözleşmen sona erdi',f.team+' ile sözleşmen bitti. '+(S.perf>=40?'Kulüp iki yıllık yenileme öneriyor.':'Kulüp performansın nedeniyle sözleşmeni yenilemiyor.'),S.perf>=40?[{t:'İki yıl uzat',p:1,run:()=>{f.contractUntil=S.age+2;f.expiredContract=false;return 'Sözleşmeni aynı maaşla iki yıl uzattın.'}},{t:'Takımdan ayrıl',run:()=>{S.job=null;PG=[];drawOcc();return 'Sözleşmeni yenilemeyip takımdan ayrıldın.'}}]:[{t:'Takımdan ayrıl',p:1,run:()=>{S.job=null;PG=[];drawOcc();return 'Sözleşmen sona erdi; yeni bir işe veya takıma başvurabilirsin.'}}],()=>S.job===c.job);
 }
}
const simulateFootballBeforeAthleteLife=simulateFootballSeason;
simulateFootballSeason=function(){prepareAthleteSeason();const result=simulateFootballBeforeAthleteLife();finishAthleteSeason();return result};
const simulateTeamSportBeforeAthleteLife=simulateTeamSportSeason;
simulateTeamSportSeason=function(){prepareAthleteSeason();const result=simulateTeamSportBeforeAthleteLife();finishAthleteSeason();return result};
const acceptSportsOfferBeforeAthleteLife=acceptSportsOffer;
acceptSportsOffer=function(life,job,offer){const valid=sportsOfferValid(life,job,offer),result=acceptSportsOfferBeforeAthleteLife(life,job,offer);if(valid&&S===life&&S.job===job){const c=athleteState();c.career.contractUntil=S.age+3;c.career.expiredContract=false;render();pgDraw()}return result};
const jobWorkBeforeCoaching=jobWork;
jobWork=function(){if(S.job&&S.job.coach)return coachJobPage();return jobWorkBeforeCoaching()};
const pgOpenBeforeAthleteLife=pgOpen;
pgOpen=function(builder){return pgOpenBeforeAthleteLife(()=>{const page=builder(),c=athleteState();
 if(c&&(page.title==='FUTBOL KARİYERİ'||page.title==='SPOR KARİYERİ'&&page.jobDetails)){
 const f=c.career,life=S,job=c.job;page.extraJobIntro='<div class="sports-stats"><b>Oyuncu durumu</b><p>'+esc(f.playingStatus||'İlk kadro')+' · Sözleşme: '+Math.max(0,f.contractUntil-S.age)+' yıl</p>'+(f.injury?'<p>'+esc(f.injury.name)+' · Rehabilitasyon sürüyor</p>':'')+'</div>';
 const training=page.rows.find(r=>r.t==='Antrenman yap');if(training&&f.injury&&f.injury.untilAge>S.age){training.disabled=true;training.d='Sakatlık nedeniyle dinlenmelisin.'}
 if(f.injury)page.rows.push({ic:'🩺',t:'Rehabilitasyon',d:'Yılda 1 · '+TL(Math.round(10000*wm())),f:()=>{if(S!==life||S.job!==job||S.dead)return;const fee=Math.round(10000*wm());if(f.rehabAge===S.age||S.p<fee)return modal('Rehabilitasyon','Bu yıl zaten rehabilitasyon aldın veya bakiyen yetersiz.',[{t:'Kapat',p:1}]);f.rehabAge=S.age;S.p-=fee;f.injury.months=Math.max(0,f.injury.months-2);f.availability=Math.min(1,f.availability+.15);apply({h:3});line('Rehabilitasyon programını tamamladın.','good');render();pgDraw()}});
 page.rows.push({ic:'🧢',t:'Sporculuktan emekli ol',d:'Antrenörlük kariyerine geçebilirsin',f:()=>{const life=S,job=c.job;modal('Oyunculuğu bırak','Sporculuktan emekli olmak istiyor musun?',[{t:'Emekli ol',f:()=>{if(S===life&&S.job===job)retireAthlete()}},{t:'Vazgeç',p:1}])}});
 }
 if(page.title==='SPOR KARİYERİ'&&!page.jobDetails&&!S.job&&S.retiredSports)Object.keys(S.retiredSports).forEach(sport=>page.rows.push({ic:'🧢',t:({football:'Futbol',basketball:'Basketbol',volleyball:'Voleybol'})[sport]+' antrenörlüğü',d:'Oyunculuk deneyimini takımına aktar',f:()=>startSportsCoaching(sport)}));
 return page;
})};
