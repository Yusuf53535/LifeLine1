// Oyun formatı: 32 takım, 8 grup, ilk iki son 16'ya; çift maçlı elemeler ve tek final.
// Avrupa'nın mevcut resmî formatını taklit etmez. Lig ilk 2: ŞL, 3-4: Avrupa Ligi.
const EUROPEAN_CUPS={champions:{name:"Şampiyonlar Ligi",icon:"🏆"},europa:{name:"Avrupa Ligi",icon:"🥇"}};
const EUROPEAN_COUNTRIES=["Türkiye","İngiltere","Almanya","Fransa","İtalya","İspanya","Hollanda"];
function europeanTopLeague(country){return Object.keys(FOOTBALL_LEAGUES).filter(id=>FOOTBALL_LEAGUES[id].country===country).sort((a,b)=>FOOTBALL_LEAGUES[a].tier-FOOTBALL_LEAGUES[b].tier)[0]}
function europeanQualification(f){
  if(!EUROPEAN_COUNTRIES.includes(f.country)||europeanTopLeague(f.country)!==f.league)return null;
  const table=rankFootballTable({table:browsableFootballTable(f.league)});
  if(!table.some(t=>t.o>0))return null;
  const place=table.findIndex(t=>t.team===f.team)+1;
  const cup=place>=1&&place<=2?"champions":place<=4&&place>=3?"europa":null;
  return cup?{cup,team:f.team,season:f.season+1,age:S.age+1,place}:null;
}
function europeanRandom(seedText){
  let seed=2166136261;for(const ch of seedText)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
  return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
}
function europeanParticipants(cup,playerTeam){
  const teams=[];
  EUROPEAN_COUNTRIES.forEach(country=>{
    const id=europeanTopLeague(country),rank=rankFootballTable({table:browsableFootballTable(id)});
    rank.slice(cup==="champions"?0:2,cup==="champions"?2:4).forEach(t=>teams.push(t.team));
  });
  const extra=["Lisbon","Porto","Brussels","Bruges","Glasgow","Edinburgh","Athens","Piraeus","Basel","Zurich","Vienna","Salzburg","Copenhagen","Stockholm","Oslo","Prague","Zagreb","Belgrade"];
  extra.forEach(city=>teams.push(city+(cup==="champions"?" Stars FC":" United FC")));
  const unique=[...new Set(teams)].filter(t=>t!==playerTeam);return [playerTeam,...unique].slice(0,32);
}
function simulateEuropeanCup(f,qualification){
  const random=europeanRandom(S.age+":"+qualification.cup+":"+f.team),teams=europeanParticipants(qualification.cup,f.team);
  for(let i=teams.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[teams[i],teams[j]]=[teams[j],teams[i]]}
  const performance=Math.max(0,Math.min(100,Number(S.perf)||0));
  const match=(a,b)=>({a,b,...sportsFootballScore(a,b,random,{team:f.team,performance,home:a})});
  const result={cup:qualification.cup,team:f.team,season:f.season,age:S.age,groups:[],rounds:[],champion:null,outcome:"Grup aşamasında elendi"};
  const qualified=[];
  for(let g=0;g<8;g++){
    const table=teams.slice(g*4,g*4+4).map(team=>({team,o:0,g:0,b:0,m:0,a:0,y:0,p:0})),matches=[];
    for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(let leg=0;leg<2;leg++){
      const a=table[leg?j:i],b=table[leg?i:j],game=match(a.team,b.team);matches.push(game);
      a.o++;b.o++;a.a+=game.ga;a.y+=game.gb;b.a+=game.gb;b.y+=game.ga;
      if(game.ga>game.gb){a.g++;a.p+=3;b.m++}else if(game.gb>game.ga){b.g++;b.p+=3;a.m++}else{a.b++;b.b++;a.p++;b.p++}
    }
    const ranked=rankFootballTable({table});result.groups.push({name:String.fromCharCode(65+g),table:ranked,matches});qualified.push(ranked[0].team,ranked[1].team);
  }
  // Grup birincileri farklı grubun ikincileriyle eşleşir.
  let bracket=[];for(let g=0;g<8;g++){bracket.push(qualified[g*2],qualified[((g+1)%8)*2+1])}
  ["Son 16","Çeyrek final","Yarı final","Final"].forEach(name=>{
    const ties=[],winners=[];
    for(let i=0;i<bracket.length;i+=2){
      const a=bracket[i],b=bracket[i+1],legs=[match(a,b)];if(name!=="Final")legs.push(match(b,a));
      const ga=legs[0].ga+(legs[1]?legs[1].gb:0),gb=legs[0].gb+(legs[1]?legs[1].ga:0);
      const penalties=ga===gb,winner=ga>gb?a:gb>ga?b:random()<.5?a:b;
      ties.push({a,b,ga,gb,legs,penalties,winner});winners.push(winner);
      if(a===f.team||b===f.team)result.outcome=winner===f.team?(name==="Final"?"Şampiyon":name+" turunu geçti"):name+" turunda elendi";
    }
    result.rounds.push({name,ties});bracket=winners;
  });
  result.champion=bracket[0];return result;
}
function announceEuropeanCup(result){
  const cfg=EUROPEAN_CUPS[result.cup],group=result.groups.find(g=>g.table.some(t=>t.team===result.team)),place=group.table.findIndex(t=>t.team===result.team)+1;
  queueResultNotice(cfg.name+" · Grup sonucu",result.team+" "+group.name+" grubunu "+place+". bitirdi. "+(place<=2?"Son 16 turuna yükseldin!":"Bu sezon Avrupa maceran sona erdi."),[{t:"Kapat",p:1}]);
  result.rounds.forEach(round=>{const tie=round.ties.find(t=>t.a===result.team||t.b===result.team);if(!tie)return;
    queueResultNotice(cfg.name+" · "+round.name,tie.a+" "+tie.ga+" – "+tie.gb+" "+tie.b+(tie.penalties?"\nPenaltılarda kazanan: "+tie.winner:"")+"\n"+(tie.winner===result.team?(round.name==="Final"?"Kupayı kazandın!":"Bir sonraki tura yükseldin!"):"Elendin. Avrupa şampiyonu: "+result.champion),[{t:"Kapat",p:1}]);
  });
  line(cfg.name+": "+result.outcome+". Şampiyon: "+result.champion,result.champion===result.team?"gold":"good");
}
function processEuropeanSeason(f){
  if(!f.completed||f.europeProcessedSeason===f.season)return;
  f.europeProcessedSeason=f.season;
  const qualification=f.europeQualification;
  if(qualification&&qualification.team===f.team&&qualification.season===f.season&&qualification.age===S.age){
    f.europeResult=simulateEuropeanCup(f,qualification);announceEuropeanCup(f.europeResult);
  }
  f.europeQualification=europeanQualification(f);
  if(f.europeQualification){
    const cfg=EUROPEAN_CUPS[f.europeQualification.cup];
    line(f.team+" gelecek sezon "+cfg.name+" katılım hakkı kazandı!","gold");
    queueResultNotice("Avrupa kupalarına katıldın",f.team+" ligi "+f.europeQualification.place+". bitirdi. Gelecek sezon "+cfg.name+" gruplarında oynayacaksın!",[{t:"Kapat",p:1}]);
  }
}
function europeanCupIntro(result){return '<div class="sports-stats"><b>'+esc(result.team)+'</b><p>'+esc(EUROPEAN_CUPS[result.cup].name)+' · Sezon '+result.season+'</p><p>'+esc(result.outcome)+' · Şampiyon: '+esc(result.champion)+'</p></div>'}
function openEuropeanCups(){
  pgOpen(()=>{
    const f=S.job&&S.job.football;if(!f)return {title:"AVRUPA KUPALARI",rows:[]};
    const q=f.europeQualification,r=f.europeResult,rows=[];let intro='<div class="sports-stats"><b>Avrupa kupaları</b><p>Üst ligde ilk 2 Şampiyonlar Ligi, 3. ve 4. Avrupa Ligi hakkı kazanır. Katılım gelecek sezon başlar.</p></div>';
    if(q&&q.team===f.team)intro+='<div class="sports-stats"><b>'+esc(EUROPEAN_CUPS[q.cup].name)+'</b><p>Sezon '+q.season+' · '+esc(q.team)+' katılmaya hak kazandı. Grup ve elemeler sezon sonunda burada görünecek.</p></div>';
    if(r&&r.team===f.team){intro+=europeanCupIntro(r);rows.push({ic:"📊",t:"Gruplar",d:"8 grup · İlk 2 takım son 16’ya çıkar",f:()=>openEuropeanGroups(r)},{ic:"🏆",t:"Eleme turları",d:"Son 16, çeyrek final, yarı final ve final",f:()=>openEuropeanKnockouts(r)})}
    return {title:"AVRUPA KUPALARI",intro,rows};
  });
}
function openEuropeanGroups(result){
  pgOpen(()=>({title:"AVRUPA · GRUPLAR",intro:europeanCupIntro(result),rows:result.groups.map(group=>({ic:group.table.some(t=>t.team===result.team)?"⭐":"📊",t:group.name+" Grubu",d:group.table.map(t=>t.team).join(" · "),f:()=>openEuropeanGroup(result,group)}))}));
}
function europeanTableHtml(table,team){return '<div class="football-league-scroll"><table class="football-league-table"><thead><tr>'+['#','Takım','O','G','B','M','AV','P'].map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+table.map((t,i)=>'<tr'+(t.team===team?' class="football-league-own"':'')+'><td>'+(i+1)+'</td><td>'+esc(t.team)+'</td>'+[t.o,t.g,t.b,t.m,t.a-t.y,t.p].map(n=>'<td>'+n+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'}
function europeanMatchHtml(game,team){return '<div class="europe-match'+(game.a===team||game.b===team?' europe-match-own':'')+'"><span>'+esc(game.a)+'</span><strong>'+game.ga+' – '+game.gb+'</strong><span>'+esc(game.b)+'</span></div>'}
function openEuropeanGroup(result,group){
  pgOpen(()=>({title:group.name+" GRUBU",intro:europeanCupIntro(result)+europeanTableHtml(group.table,result.team)+'<div class="sports-stats"><b>Grup maçları</b>'+group.matches.map(m=>europeanMatchHtml(m,result.team)).join('')+'</div>',rows:[]}));
}
function openEuropeanKnockouts(result){
  pgOpen(()=>({title:"AVRUPA · ELEMELER",intro:europeanCupIntro(result),rows:result.rounds.map(round=>({ic:"🏆",t:round.name,d:round.ties.length+" eşleşme",f:()=>openEuropeanRound(result,round)}))}));
}
function openEuropeanRound(result,round){
  pgOpen(()=>({title:round.name.toLocaleUpperCase("tr-TR"),intro:europeanCupIntro(result)+round.ties.map(tie=>'<section class="sports-stats">'+tie.legs.map(m=>europeanMatchHtml(m,result.team)).join('')+'<p>Toplam: '+tie.ga+' – '+tie.gb+' · '+(tie.penalties?'Penaltılarda kazanan: ':'Kazanan: ')+esc(tie.winner)+'</p></section>').join(''),rows:[]}));
}
const simulateFootballBeforeEurope=simulateFootballSeason;
simulateFootballSeason=function(){const result=simulateFootballBeforeEurope();const f=S.job&&S.job.football;if(f)processEuropeanSeason(f);return result};
const acceptSportsOfferBeforeEurope=acceptSportsOffer;
acceptSportsOffer=function(life,job,offer){
  const valid=sportsOfferValid(life,job,offer),result=acceptSportsOfferBeforeEurope(life,job,offer);
  if(valid&&S===life&&S.job===job&&job.football){job.football.europeQualification=europeanQualification(job.football);render();pgDraw()}
  return result;
};
const pgOpenBeforeEurope=pgOpen;
pgOpen=function(builder){return pgOpenBeforeEurope(()=>{const page=builder(),f=S.job&&S.job.football;
  if(f&&page.title==="FUTBOL KARİYERİ"){
    if(!f.europeProcessedSeason&&f.completed&&f.table.some(t=>t.o)){
      f.europeQualification=europeanQualification(f);f.europeProcessedSeason=f.season;
    }
    const q=f.europeQualification,r=f.europeResult;
    page.rows.splice(Math.max(0,page.rows.findIndex(row=>row.t==="Diğer ligler")+1),0,{ic:"🏆",t:"Avrupa kupaları",d:q&&q.team===f.team?EUROPEAN_CUPS[q.cup].name+" · Gelecek sezon katılım":r&&r.team===f.team?EUROPEAN_CUPS[r.cup].name+" · "+r.outcome:"Şampiyonlar Ligi ve Avrupa Ligi · Katılım şartları",f:openEuropeanCups});
  }
  return page;
})};
