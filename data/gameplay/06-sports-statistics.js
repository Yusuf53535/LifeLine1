// Oyuncu istatistikleri performans, pozisyon ve oynanan lig sezonundan üretilir.
// Kariyer toplamları karakterde tutulur: transfer veya istifa bunları silmez.
function sportsStatisticsStore(sport){
  S.sportsStatistics=S.sportsStatistics||{};
  return S.sportsStatistics[sport]||(S.sportsStatistics[sport]={seasons:0,matches:0,totals:{},ratingTotal:0,last:null});
}
function recordSportsSeason(showNotice=true){
  const context=sportsContractContext();if(!context)return;
  const {job,career}=context,sport=job.football?"football":career.sport;
  const team=career.table.find(t=>t.team===career.team);
  if(!career.completed||!team||!team.o)return;
  const store=sportsStatisticsStore(sport);
  if(career.statisticsAge===S.age&&career.statisticsSeason===career.season)return;
  // Eski kayıttaki son oynanmış sezon da yalnızca bir kez içeri alınır.
  career.statisticsAge=S.age;career.statisticsSeason=career.season;
  const performance=Math.max(0,Math.min(100,Number(S.perf)||0)),quality=.25+performance/100*.75;
  const matches=Math.min(team.o,Math.max(1,Math.round(team.o*(.55+quality*.4))));
  const count=(rate)=>Math.max(0,Math.round(matches*rate*quality*(.75+Math.random()*.5)));
  const values={},position=career.position||"";
  if(sport==="football"){
    if(position==="Kaleci"){
      values.saves=count(4);values.cleanSheets=Math.min(matches,team.o-team.m,count(.45));
    }else{
      const attack=/Forvet|kanat|Ofansif/i.test(position),defence=/Stoper|bek/i.test(position);
      values.goals=Math.min(team.a,count(attack?.7:defence?.08:.22));
      values.assists=Math.min(Math.max(0,team.a-values.goals),count(attack?.28:defence?.10:.25));
    }
  }else if(sport==="basketball"){
    values.points=count(position==="Şutör gard"?.85*30:20);
    values.assists=count(position==="Oyun kurucu"?9:4);
    values.rebounds=count(/Pivot|Uzun forvet/.test(position)?11:5);
  }else{
    const libero=position==="Libero",setter=position==="Pasör";
    values.points=libero?0:count(setter?3:15);
    values.blocks=libero?0:count(position==="Orta oyuncu"?4:1.5);
    values.digs=count(libero?18:5);
    if(setter)values.assists=count(30);
  }
  const ranked=career.table.slice().sort((a,b)=>b.p-a.p||b.g-a.g||(b.a-b.y)-(a.a-a.y));
  const place=ranked.findIndex(t=>t.team===career.team)+1;
  const rating=Number.isFinite(career.seasonRating)?career.seasonRating:Math.round(performance*.8+(1-(place-1)/Math.max(1,ranked.length-1))*20);
  const season={age:S.age,season:career.season,team:career.team,league:career.league,position,matches,rating,place,values};
  store.seasons++;store.matches+=matches;store.ratingTotal+=rating;
  Object.entries(values).forEach(([key,value])=>store.totals[key]=(store.totals[key]||0)+value);
  store.last=season;
  if(showNotice){
    const labels=sportsStatisticLabels;
    queueResultNotice("Sezon sonu istatistiklerin",season.team+" · Sezon "+season.season+" · Lig sırası: "+place+"\n"+matches+" maç · Performans: "+rating+"/100\n"+Object.entries(values).map(([key,value])=>labels[key]+": "+value).join(" · "),[{t:"Kapat",p:1}],sportsSeasonSummaryHtml(season,sport));
  }
}
const sportsStatisticLabels={goals:"Gol",assists:"Asist",saves:"Kurtarış",cleanSheets:"Gol yemeden maç",points:"Sayı",rebounds:"Ribaund",blocks:"Blok",digs:"Top karşılama"};
function sportsStatisticsCard(title,subtitle,metrics){
  return '<section class="sports-stats"><div class="sports-stats-heading"><b>'+esc(title)+'</b><small>'+esc(subtitle)+'</small></div><div class="sports-stats-grid sports-stats-totals">'+metrics.map(([label,value])=>'<div><strong>'+esc(String(value))+'</strong><small>'+esc(label)+'</small></div>').join('')+'</div></section>';
}
function sportsStatisticsHtml(){
  const c=sportsContractContext();if(!c)return '';
  recordSportsSeason(false);
  const store=sportsStatisticsStore(c.job.football?"football":c.career.sport),last=store.last;
  const totals=[["Sezon",store.seasons],["Maç",store.matches],["Ort. performans",store.seasons?Math.round(store.ratingTotal/store.seasons)+"/100":"—"],...Object.entries(store.totals).map(([key,value])=>[sportsStatisticLabels[key],value])];
  return sportsStatisticsCard("Genel istatistiklerin","Bu branştaki tüm kariyerin",totals)+(last?'<section class="sports-stats"><b>Son sezon istatistiklerin</b>'+sportsSeasonSummaryHtml(last,c.job.football?"football":c.career.sport)+'</section>':'<section class="sports-stats"><b>Sezon istatistiklerin</b><p>İlk sezonunu tamamladığında burada görünecek.</p></section>');
}
const simulateFootballBeforeStatistics=simulateFootballSeason;
simulateFootballSeason=function(){const result=simulateFootballBeforeStatistics();recordSportsSeason();return result};
const simulateTeamSportBeforeStatistics=simulateTeamSportSeason;
simulateTeamSportSeason=function(){const result=simulateTeamSportBeforeStatistics();recordSportsSeason();return result};
const pgOpenBeforeSportsStatistics=pgOpen;
pgOpen=function(builder){return pgOpenBeforeSportsStatistics(()=>{
  const page=builder();
  if(sportsContractContext()&&(page.title==="FUTBOL KARİYERİ"||page.title==="SPOR KARİYERİ"&&page.jobDetails)){page.sportsStatisticsIntro=sportsStatisticsHtml();page.intro=(page.intro||"")+page.sportsStatisticsIntro;}
  return page;
})};

// Kuyruğa sezonun HTML özeti alınır; başka teklif açıldığında veriler değişmez.
function sportsSeasonSummaryHtml(season,sport){
  const league=(sport==="football"?FOOTBALL_LEAGUES:TEAM_SPORT_LEAGUES)[season.league];
  const icon=sport==="football"?"⚽":sport==="basketball"?"🏀":"🏐";
  const rating=Math.max(0,Math.min(100,Number(season.rating)||0));
  const metrics=[["Maç",season.matches],...Object.entries(season.values).map(([key,value])=>[sportsStatisticLabels[key]||key,value])];
  return '<div class="season-summary"><div class="season-summary-team"><span class="season-summary-icon" aria-hidden="true">'+icon+'</span><div><strong>'+esc(season.team)+'</strong><small>'+esc(league?league.country+" · "+league.name:"")+'</small></div></div><div class="season-summary-tags"><span>Sezon '+esc(String(season.season))+'</span><span>Lig sırası: '+esc(String(season.place))+'</span>'+(season.position?'<span>'+esc(season.position)+'</span>':'')+'</div><div class="season-summary-rating"><div class="season-summary-rating-label"><span>Sezon performansı</span><strong>'+rating+'<small>/100</small></strong></div><div class="season-summary-track" role="progressbar" aria-label="Sezon performansı" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+rating+'"><i style="width:'+rating+'%"></i></div></div><div class="season-summary-grid'+(sport==="football"?" season-summary-combined":"")+'">'+metrics.map(([label,value])=>'<div class="season-summary-stat"><strong>'+esc(String(value))+'</strong><small>'+esc(label)+'</small></div>').join('')+'</div></div>';
}
