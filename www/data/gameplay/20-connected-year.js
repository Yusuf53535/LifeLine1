// Yıllık yeni sistemler tek kez çalışır; reddedilen / eski kararlar uygulanmaz.
const nextYearBeforeConnectedSystems=nextYear;
nextYear=function(){
 if(!S||S.dead)return nextYearBeforeConnectedSystems();
 const life=S,age=S.age;
 ensureLeagueWorld();applyNextLeagueSeason();
 const c=athleteState();if(c&&c.career.expiredContract){line(c.career.team+' ile biten sözleşmen yenilenmedi.','bad');S.job=null}
 const activeJob=S.job;
 S.publicity=(Number(S.publicity)||0)*.8;
 const result=nextYearBeforeConnectedSystems();
 if(S!==life||S.dead||S.age<=age)return result;
 if(S.job&&S.job.coach){const coach=S.job.coach;coach.years++;coach.table=leagueSeasonTable(coach.sport,coach.league,null,{team:coach.team,performance:S.perf});const ranked=rankFootballTable({table:coach.table});line(coach.team+' antrenörlüğünde sezonu '+(ranked.findIndex(t=>t.team===coach.team)+1)+'. bitirdin.','gold')}
 if(S.age>=18)processLeagueMovement(activeJob);
 annualFameEvent();annualRelationshipInvitation();render();pgDraw();return result;
};
