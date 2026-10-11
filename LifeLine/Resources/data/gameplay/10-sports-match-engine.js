// Kulüp gücü + küçük yıllık form + sınırlı oyuncu katkısı; rastgele sürprizler korunur.
function clubStrength(sport,team){return CLUB_STRENGTHS[sport]&&CLUB_STRENGTHS[sport][team]||70}
function sportsMatchStrength(sport,team,player){
 let hash=0;for(const c of team+":"+S.age)hash=(hash*31+c.charCodeAt(0))>>>0;
 return clubStrength(sport,team)+(hash%7-3)+(player&&player.team===team?Math.max(-3,Math.min(3,((Number(player.performance)||50)-50)*.06)):0);
}
function sportsPoisson(mean,random){let n=0,p=1;const limit=Math.exp(-mean);do{n++;p*=Math.max(.000001,Math.min(.999999,random()))}while(p>limit&&n<12);return Math.min(8,n-1)}
function sportsFootballScore(a,b,random=Math.random,player){
 const difference=sportsMatchStrength('football',a,player)-sportsMatchStrength('football',b,player);
 const home=player&&player.home;
 const ga=sportsPoisson(Math.max(.22,Math.min(3.8,1.25*Math.exp(difference/30)*(home===a?1.1:1))),random);
 const gb=sportsPoisson(Math.max(.22,Math.min(3.8,1.25*Math.exp(-difference/30)*(home===b?1.1:1))),random);
 return {ga,gb};
}
function sportsTeamScore(sport,a,b,random=Math.random,player){
 const difference=sportsMatchStrength(sport,a,player)-sportsMatchStrength(sport,b,player);
 if(sport==='basketball'){
   const pace=80+Math.round(random()*18),margin=Math.round(difference*.7+(random()+random()-1)*28);
   let ga=Math.max(45,pace+Math.round(margin/2)),gb=Math.max(45,pace-Math.round(margin/2));
   if(ga===gb){if(random()<1/(1+Math.exp(-difference/10)))ga++;else gb++}return {ga,gb};
 }
 let ga=0,gb=0;const chance=Math.max(.12,Math.min(.88,1/(1+Math.exp(-difference/14))));
 while(ga<3&&gb<3){if(random()<chance)ga++;else gb++}return {ga,gb};
}
