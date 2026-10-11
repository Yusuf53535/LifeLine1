// Biten sezon korunur; yükselme/düşme yeni sezon başlarken uygulanır.
const BASE_GAME_ROSTERS={football:Object.fromEntries(Object.entries(FOOTBALL_LEAGUES).map(([id,l])=>[id,l.teams.slice()])),basketball:Object.fromEntries(Object.entries(TEAM_SPORT_LEAGUES).filter(([id,l])=>l.sport==='basketball').map(([id,l])=>[id,l.teams.slice()])),volleyball:Object.fromEntries(Object.entries(TEAM_SPORT_LEAGUES).filter(([id,l])=>l.sport==='volleyball').map(([id,l])=>[id,l.teams.slice()]))};
let leagueRosterLife=null;
function ensureLeagueWorld(){
 if(!S)return;
 if(!S.leagueWorld)S.leagueWorld={rosters:JSON.parse(JSON.stringify(BASE_GAME_ROSTERS)),pending:null,processedAge:null};
 if(leagueRosterLife!==S){leagueRosterLife=S;Object.entries(BASE_GAME_ROSTERS).forEach(([sport,ids])=>Object.keys(ids).forEach(id=>{const leagues=sport==='football'?FOOTBALL_LEAGUES:TEAM_SPORT_LEAGUES;leagues[id].teams=(S.leagueWorld.rosters[sport]&&S.leagueWorld.rosters[sport][id]||ids[id]).slice()}))}
}
function applyNextLeagueSeason(){
 ensureLeagueWorld();const world=S.leagueWorld;if(!world.pending)return;
 world.rosters=world.pending;world.pending=null;leagueRosterLife=null;ensureLeagueWorld();
 const c=sportsContractContext();if(c){const sport=c.job.football?'football':c.career.sport;const id=Object.keys(world.rosters[sport]).find(id=>world.rosters[sport][id].includes(c.career.team));if(id){c.career.league=id;c.career.nextLeague=null;c.career.completed=true}}
 if(S.job&&S.job.coach){const c=S.job.coach,id=Object.keys(world.rosters[c.sport]).find(id=>world.rosters[c.sport][id].includes(c.team));if(id)c.league=id}
}
function leagueSeasonTable(sport,id,activeJob,coachPlayer){
 const leagues=sport==='football'?FOOTBALL_LEAGUES:TEAM_SPORT_LEAGUES,l=leagues[id];
 const valid=table=>Array.isArray(table)&&table.length===l.teams.length&&new Set(table.map(t=>t.team)).size===table.length&&table.every(t=>l.teams.includes(t.team));
 const active=activeJob&&(sport==='football'?activeJob.football:activeJob.teamSport);
 if(active&&active.league===id&&active.completed&&valid(active.table)&&active.table.some(t=>t.o>0))return JSON.parse(JSON.stringify(active.table));
 if(activeJob&&activeJob.coach&&activeJob.coach.sport===sport&&activeJob.coach.league===id&&valid(activeJob.coach.table)&&activeJob.coach.table.length)return JSON.parse(JSON.stringify(activeJob.coach.table));
 if(sport==='football'&&S.footballLeagueTables&&S.footballLeagueTables.age===S.age&&valid(S.footballLeagueTables.tables[id]))return JSON.parse(JSON.stringify(S.footballLeagueTables.tables[id]));
 const table=l.teams.map(team=>({team,o:0,g:0,b:0,m:0,a:0,y:0,p:0})),random=europeanRandom(sport+':'+id+':'+S.age);
 for(let i=0;i<table.length;i++)for(let j=i+1;j<table.length;j++)for(let leg=0;leg<2;leg++){
 const a=table[i],b=table[j],s=sport==='football'?sportsFootballScore(a.team,b.team,random,{...coachPlayer,home:leg?b.team:a.team}):sportsTeamScore(sport,a.team,b.team,random,coachPlayer);
 a.o++;b.o++;a.a+=s.ga;a.y+=s.gb;b.a+=s.gb;b.y+=s.ga;
 if(sport==='football'){if(s.ga>s.gb){a.g++;a.p+=3;b.m++}else if(s.gb>s.ga){b.g++;b.p+=3;a.m++}else{a.b++;b.b++;a.p++;b.p++}}
 else{const winner=s.ga>s.gb?a:b,loser=s.ga>s.gb?b:a;winner.g++;loser.m++;if(sport==='basketball'){winner.p+=2;loser.p++}else{winner.p+=Math.min(s.ga,s.gb)===2?2:3;loser.p+=Math.min(s.ga,s.gb)===2?1:0}}
 }
 return table;
}
function processLeagueMovement(activeJob){
 ensureLeagueWorld();const world=S.leagueWorld;if(world.processedAge===S.age)return;world.processedAge=S.age;
 const pending=JSON.parse(JSON.stringify(world.rosters)),moves=[],tables={};
 ['football','basketball','volleyball'].forEach(sport=>{
  const leagues=sport==='football'?FOOTBALL_LEAGUES:TEAM_SPORT_LEAGUES,ids=Object.keys(world.rosters[sport]);tables[sport]={};
  ids.forEach(id=>{tables[sport][id]=rankFootballTable({table:leagueSeasonTable(sport,id,activeJob)})});
  const countries=[...new Set(ids.map(id=>leagues[id].country))];
  countries.forEach(country=>{
   const local=ids.filter(id=>leagues[id].country===country),tiers=[...new Set(local.map(id=>leagues[id].tier))].sort((a,b)=>a-b);
   for(let i=0;i<tiers.length-1;i++){
    const upper=local.filter(id=>leagues[id].tier===tiers[i]),lower=local.filter(id=>leagues[id].tier===tiers[i+1]);if(upper.length!==1)continue;
    const relegated=tables[sport][upper[0]].slice(-2).reverse();
    lower.forEach((id,index)=>{const count=lower.length===1?2:1;
      for(let n=0;n<count;n++){const up=tables[sport][id][n],down=relegated[lower.length===1?n:index];if(!up||!down)continue;
       moves.push({sport,team:up.team,from:id,to:upper[0],up:true},{sport,team:down.team,from:upper[0],to:id,up:false});
      }
    });
   }
  });
 });
 moves.forEach(m=>{pending[m.sport][m.from]=pending[m.sport][m.from].filter(t=>t!==m.team)});moves.forEach(m=>pending[m.sport][m.to].push(m.team));
 world.pending=pending;world.lastMoves=moves;
 // Küçük, sınırlı yıllık güç değişimleri: başarı otomatik bir güç patlaması yaratmaz.
 S.clubDevelopment=S.clubDevelopment||{};
 Object.entries(tables).forEach(([sport,leagues])=>Object.values(leagues).forEach(table=>{
  const expected=table.slice().sort((a,b)=>clubStrength(sport,b.team)-clubStrength(sport,a.team));
  table.forEach((row,index)=>{const key=sport+':'+row.team,difference=expected.findIndex(t=>t.team===row.team)-index;
   S.clubDevelopment[key]=Math.max(-8,Math.min(8,(S.clubDevelopment[key]||0)+Math.max(-.6,Math.min(.6,difference*.08))));
  });
 }));
 const f=activeJob&&(activeJob.football||activeJob.teamSport),coach=activeJob&&activeJob.coach;
 const sport=activeJob&&activeJob.football?'football':f?f.sport:coach?coach.sport:null,team=f?f.team:coach?coach.team:null;
 const own=moves.find(m=>m.sport===sport&&m.team===team);
 if(own){if(f)f.nextLeague=own.to;const leagues=own.sport==='football'?FOOTBALL_LEAGUES:TEAM_SPORT_LEAGUES;
 line(own.team+(own.up?' üst lige yükseldi: ':' alt lige düştü: ')+leagues[own.to].name,'gold');queueResultNotice(own.up?'Takımın üst lige yükseldi!':'Takımın küme düştü',own.team+' gelecek sezon '+leagues[own.to].name+' liginde oynayacak.',[{t:'Kapat',p:1}]);}
}
const clubStrengthBeforeDevelopment=clubStrength;
clubStrength=function(sport,team){return Math.max(25,Math.min(98,clubStrengthBeforeDevelopment(sport,team)+(S&&S.clubDevelopment&&S.clubDevelopment[sport+':'+team]||0)))};
const browsableFootballBeforeWorld=browsableFootballTable;
browsableFootballTable=function(id){ensureLeagueWorld();return browsableFootballBeforeWorld(id)};
const renderBeforeLeagueWorld=render;
render=function(){ensureLeagueWorld();return renderBeforeLeagueWorld()};
