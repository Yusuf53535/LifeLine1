// Sezon sonu teklifler ve tek seferlik maaş pazarlığı. Bekleyen teklif kayıtla saklanır.
function sportsContractContext(){
  const job=S&&S.job,career=job&&(job.football||job.teamSport);
  if(!career)return null;
  return {job,career,leagues:job.football?FOOTBALL_LEAGUES:TEAM_SPORT_LEAGUES};
}
function sportsOfferValid(life,job,offer){
  const c=sportsContractContext();
  return S===life&&!S.dead&&c&&c.job===job&&(c.career.offer===offer||c.career.applicationOffer===offer)&&offer.age===S.age&&offer.season===c.career.season&&!offer.closed;
}
function createSeasonSportsOffer(){
  const c=sportsContractContext();if(!c||!c.career.completed)return;
  const {job,career,leagues}=c;
  if(career.offerSeason===career.season)return;
  career.offerSeason=career.season;career.offer=null;
  const ranked=career.table.slice().sort((a,b)=>b.p-a.p||b.g-a.g||(b.a-b.y)-(a.a-a.y));
  const place=ranked.findIndex(t=>t.team===career.team);
  const performance=Math.max(0,Math.min(100,Number(S.perf)||0));
  const rating=Math.round(performance*.8+(ranked.length>1&&place>=0?(1-place/(ranked.length-1))*100:50)*.2);
  career.seasonRating=rating;
  if(Math.random()>=.12+rating*.008)return;
  const current=leagues[career.league];if(!current)return;
  const upperTier=current.tier-1;
  const hasUpper=Object.values(leagues).some(l=>l.country===career.country&&l.tier===upperTier&&(!job.teamSport||l.sport===career.sport));
  const requiredRating=upperTier===0?80:70;
  const tier=hasUpper&&rating>=requiredRating&&Math.random()<(rating-50)/100?upperTier:current.tier;
  const ids=Object.keys(leagues).filter(id=>{const l=leagues[id];return l.country===career.country&&l.tier===tier&&(!job.teamSport||l.sport===career.sport)});
  const candidates=ids.flatMap(id=>leagues[id].teams.filter(team=>team!==career.team).map(team=>({team,league:id})));
  if(!candidates.length)return;
  const target=R(candidates);
  // Sınırlı artış; zayıf sezonlarda daha düşük ücretli teklifler de gelir.
  const salary=Math.max(1,Math.round(job.s*(.85+rating*.003+(tier<current.tier?.15:0))));
  const offer=career.offer={...target,salary,originalSalary:salary,rating,season:career.season,age:S.age,negotiated:false,closed:false};
  const life=S;
  line(target.team+" sezon performansın için transfer teklifinde bulundu. Yıllık ücret: "+TL(salary),"gold");
  queueResultNotice("Sezon sonu takım teklifi",target.team+" · "+leagues[target.league].name+"\nSezon performansı: "+rating+"/100 · Yıllık maaş: "+TL(salary),sportsOfferButtons(life,job,offer));
}
function sportsOfferButtons(life,job,offer){
  return [
    {t:"Teklifi kabul et",p:1,f:()=>acceptSportsOffer(life,job,offer)},
    ...(!offer.negotiated?[{t:"Maaşı yükseltmek iste",f:()=>negotiateSportsOffer(life,job,offer)}]:[]),
    {t:"Reddet",f:()=>{if(!sportsOfferValid(life,job,offer))return;offer.closed=true;line(offer.team+" teklifini reddettin.");render();pgDraw()}}
  ];
}
function openSportsOffer(){
  const c=sportsContractContext(),offer=c&&c.career.offer;
  if(!offer||!sportsOfferValid(S,c.job,offer))return;
  modal("Takım teklifi",offer.team+" · "+c.leagues[offer.league].name+"\nYıllık maaş: "+TL(offer.salary)+" · Sezon performansı: "+offer.rating+"/100",sportsOfferButtons(S,c.job,offer));
}
function negotiateSportsOffer(life,job,offer){
  if(!sportsOfferValid(life,job,offer)||offer.negotiated)return;
  modal("Maaş pazarlığı","Yıllık "+TL(offer.salary)+" teklif ediliyor. Ne kadar artış isteyeceksin? Daha yüksek taleplerin reddedilme ihtimali artar.",
    [10,20,30].map(percent=>({t:"%"+percent+" artış · "+TL(Math.round(offer.salary*(1+percent/100))),f:()=>resolveSportsNegotiation(life,job,offer,percent)})).concat([{t:"Vazgeç",f:()=>offer.application?openClubApplicationOffer():openSportsOffer()}]));
}
function resolveSportsNegotiation(life,job,offer,percent){
  if(!sportsOfferValid(life,job,offer)||offer.negotiated||![10,20,30].includes(percent))return;
  offer.negotiated=true;
  const accepted=Math.random()<Math.max(.08,Math.min(.85,.4+offer.rating*.006-percent*.018));
  if(accepted)offer.salary=Math.round(offer.salary*(1+percent/100));
  offer.negotiationAccepted=accepted;
  const text=accepted?offer.team+" talebini kabul etti! Yeni yıllık teklif: "+TL(offer.salary):offer.team+" artış talebini reddetti. İlk teklif olan yıllık "+TL(offer.salary)+" hâlâ geçerli.";
  line(text,accepted?"good":"bad");render();pgDraw();
  modal(accepted?"Pazarlık kabul edildi":"Pazarlık reddedildi",text,sportsOfferButtons(life,job,offer));
}
function acceptSportsOffer(life,job,offer){
  if(!sportsOfferValid(life,job,offer))return;
  const c=sportsContractContext(),career=c.career;
  offer.closed=true;career.team=offer.team;career.league=offer.league;career.country=c.leagues[offer.league].country;
  job.s=offer.salary;job.n=(job.football?"Profesyonel futbolcu":TEAM_SPORTS[career.sport].name)+" · "+offer.team;
  // Yeni takımın biten sezonu oynanmış gibi gösterilmez; gelecek yıl temiz tablo açılır.
  career.table=c.leagues[career.league].teams.map(team=>({team,o:0,g:0,b:0,m:0,a:0,y:0,p:0}));
  line(offer.team+" ile yıllık "+TL(offer.salary)+" maaşla sözleşme imzaladın!","good");
  render();drawOcc();pgDraw();modal("Sözleşme imzalandı",job.n+" olarak gelecek sezon yeni takımında oynayacaksın. Yıllık maaş: "+TL(job.s),[{t:"Kapat",p:1}]);
}
const simulateFootballBeforeOffers=simulateFootballSeason;
simulateFootballSeason=function(){const result=simulateFootballBeforeOffers();createSeasonSportsOffer();return result};
const simulateTeamSportBeforeOffers=simulateTeamSportSeason;
simulateTeamSportSeason=function(){const result=simulateTeamSportBeforeOffers();createSeasonSportsOffer();return result};
const pgOpenBeforeSportsOffers=pgOpen;
pgOpen=function(builder){return pgOpenBeforeSportsOffers(()=>{
  const page=builder(),c=sportsContractContext();
  if(c&&(page.title==="FUTBOL KARİYERİ"||page.title==="SPOR KARİYERİ"&&page.jobDetails)){
    const offer=c.career.offer;
    if(offer&&sportsOfferValid(S,c.job,offer))page.rows.unshift({ic:"📩",t:"Sezon sonu teklifi",d:offer.team+" · "+TL(offer.salary)+"/yıl",f:openSportsOffer});
  }
  return page;
})};
