// Askeri kariyer mevcut hizmet/performance terfi sistemiyle aynı kaydı kullanır.
function militaryRankPage(){
 const life=S,job=S.job;
 pgOpen(()=>{
  if(S!==life||S.job!==job||!job.mil)return{title:'RÜTBELER',rows:[]};
  const c=ensureCareerProgress(),ladder=careerLadder(job);
  return{title:'RÜTBELER',intro:'<p>Hizmet süresi ve performans şartlarını tamamlayınca yıl sonunda rütben otomatik yükselir.</p>',rows:ladder.map((name,index)=>({ic:index<c.level?'✓':index===c.level?'🎖️':'🔒',t:name,d:index<c.level?'Tamamlandı':index===c.level?'Mevcut rütben':index===c.level+1?'Sıradaki rütbe':'İlerleyen hizmet yıllarında',disabled:true}))};
 });
}
const pgOpenBeforeMilitaryCareer=pgOpen;
pgOpen=function(builder){return pgOpenBeforeMilitaryCareer(()=>{
 const page=builder();
 if(!S||!S.job||!['İŞİM','MY JOB'].includes(page.title))return page;
 const c=ensureCareerProgress(),job=S.job;if(!c||!job.mil)return page;
 const life=S,ladder=careerLadder(job),need=careerPromotionRequirements(),top=c.level>=ladder.length-1;
 const progress=top?100:Math.round(Math.min(1,c.rankYears/need.years)*100);
 page.extraJobIntro=(page.extraJobIntro||'')+'<div class="sports-stats"><b>🎖️ '+esc(job.n)+'</b><p>'+c.years+' yıl toplam hizmet · Mevcut rütbede '+c.rankYears+' yıl</p><p>'+(top?'En yüksek rütbeye ulaştın.':'Sonraki: '+esc(ladder[c.level+1])+' · '+need.years+' yıl · Performans %'+need.performance+'+')+'</p><div class="pf"><i style="width:'+progress+'%"></i></div></div>';
 const work=page.rows.find(r=>r.t==='Çok çalış');
 if(work){work.t='Askerî eğitim';work.d='Yılda 1 · +8 performans · -2 mutluluk, -1 sağlık';work.disabled=!!S.worked;work.f=()=>{
  if(S!==life||S.job!==job||S.dead)return;
  if(S.worked)return modal('Askerî eğitim','Bu yıl eğitimini zaten tamamladın.',[{t:'Kapat',p:1}]);
  S.worked=true;S.perf=cl(S.perf+8);apply({m:-2,h:-1});line('Askerî eğitimini tamamladın. (+8 performans)','good');render();pgDraw();queueResultNotice('Askerî eğitim','Eğitim tamamlandı. Performansın %'+S.perf+' oldu.',[{t:'Kapat',p:1}]);
 }}
 page.rows=page.rows.filter(r=>!['Fazla mesai yap','Zam iste'].includes(r.t));
 page.rows.unshift({ic:'🎖️',t:'Rütbe basamakları',d:job.n+' · '+(c.level+1)+'/'+ladder.length,f:militaryRankPage});
 return page;
})};
