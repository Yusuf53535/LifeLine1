// Ülke/lig sayfaları. Aynı yılın tabloları kayıt içinde korunur.
function footballLeagueCache(){
  if(!S.footballLeagueTables||S.footballLeagueTables.age!==S.age)S.footballLeagueTables={age:S.age,tables:{}};
  return S.footballLeagueTables.tables;
}
function saveCurrentFootballLeague(){
  const f=S&&S.job&&S.job.football;
  if(f&&f.completed&&f.table.some(t=>t.o>0))footballLeagueCache()[f.league]=JSON.parse(JSON.stringify(f.table));
}
function browsableFootballTable(id){
  if(!FOOTBALL_LEAGUES[id])return [];
  saveCurrentFootballLeague();
  const cache=footballLeagueCache();if(cache[id])return cache[id];
  const table=freshFootballTable(id),f=S.job&&S.job.football;
  if(!f||!f.completed)return table;
  // Her ligde aynı yıl aynı sonuç; sayfayı yeniden açmak tabloyu değiştirmez.
  let seed=2166136261;
  for(const ch of id+":"+S.age)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  for(let i=0;i<table.length;i++)for(let j=i+1;j<table.length;j++)for(let leg=0;leg<2;leg++){
    const a=table[i],b=table[j],score=sportsFootballScore(a.team,b.team,random,{home:leg?b.team:a.team}),ga=score.ga,gb=score.gb;a.o++;b.o++;a.a+=ga;a.y+=gb;b.a+=gb;b.y+=ga;
    if(ga>gb){a.g++;a.p+=3;b.m++}else if(gb>ga){b.g++;b.p+=3;a.m++}else{a.b++;b.b++;a.p++;b.p++}
  }
  cache[id]=table;return table;
}
function openOtherFootballLeagues(){
  pgOpen(()=>({title:"DİĞER LİGLER",intro:'<div class="sports-stats"><b>Futbol ligleri</b><p>Ülke seçerek liglere ve puan tablolarına göz at.</p></div>',rows:[...new Set(Object.values(FOOTBALL_LEAGUES).map(l=>l.country))].map(country=>({ic:"🌍",t:country,d:"Ligler ve puan durumu",f:()=>openFootballCountryLeagues(country)}))}));
}
function openFootballCountryLeagues(country){
  pgOpen(()=>({title:country.toLocaleUpperCase("tr-TR")+" · LİGLER",rows:Object.keys(FOOTBALL_LEAGUES).filter(id=>FOOTBALL_LEAGUES[id].country===country).sort((a,b)=>FOOTBALL_LEAGUES[a].tier-FOOTBALL_LEAGUES[b].tier).map(id=>({ic:"🏆",t:FOOTBALL_LEAGUES[id].name,d:FOOTBALL_LEAGUES[id].teams.length+" takım",f:()=>openBrowsedFootballLeague(id)}))}));
}
function footballBrowsedTableHtml(id){
  const l=FOOTBALL_LEAGUES[id],table=rankFootballTable({table:browsableFootballTable(id)}),f=S.job&&S.job.football;
  const completed=table.some(t=>t.o>0);
  const header='<div class="sports-stats"><b>'+esc(l.country+" · "+l.name)+'</b><p>'+S.age+' yaş · '+(completed?'Sezon tamamlandı':'Sezon başlangıcı')+'</p></div>';
  return header+'<div class="football-league-scroll"><table class="football-league-table"><thead><tr>'+['#','Takım','O','G','B','M','AV','P'].map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+table.map((t,i)=>'<tr'+(f&&f.league===id&&f.team===t.team?' class="football-league-own"':'')+'><td>'+(i+1)+'</td><td>'+esc(t.team)+'</td>'+[t.o,t.g,t.b,t.m,t.a-t.y,t.p].map(n=>'<td>'+n+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function openBrowsedFootballLeague(id){
  if(!FOOTBALL_LEAGUES[id])return;
  pgOpen(()=>({title:"LİG TABLOSU",intro:footballBrowsedTableHtml(id),rows:[]}));
}
const simulateFootballBeforeLeagueBrowser=simulateFootballSeason;
simulateFootballSeason=function(){const result=simulateFootballBeforeLeagueBrowser();saveCurrentFootballLeague();return result};
const pgOpenBeforeLeagueBrowser=pgOpen;
pgOpen=function(builder){return pgOpenBeforeLeagueBrowser(()=>{const page=builder();
  if(S.job&&S.job.football&&page.title==="FUTBOL KARİYERİ"){
    const index=page.rows.findIndex(r=>r.t==="Lig tablosu");
    page.rows.splice(index<0?0:index+1,0,{ic:"🌍",t:"Diğer ligler",d:"Ülke seç, liglere ve puan tablolarına bak",f:openOtherFootballLeagues});
  }
  return page;
})};
