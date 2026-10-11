// Yeni arkadaşlar yalnızca oyuncunun kabulüyle ilişkilere eklenir.
const addPersonBeforeFriendApproval=addPerson;
function proposeFriend(person){
  if(!S||S.dead||!person)return;const life=S,age=S.age;let answered=false;
  if(S.people.filter(p=>!p.dead&&/arkadaş/i.test(p.role)).length>=6)return;
  queueResultNotice("Arkadaşlık teklifi",person.n+" ("+person.pa+" yaşında) seninle arkadaş olmak istiyor. Kabul ediyor musun?",[
    {t:"Arkadaş ol",p:1,f:()=>{
      if(answered||S!==life||S.dead||S.age!==age)return;answered=true;
      if(S.people.some(p=>p.id===person.id)||S.people.filter(p=>!p.dead&&/arkadaş/i.test(p.role)).length>=6)return;
      person.friend=true;S.people.push(person);line(person.n+" ile arkadaş oldun.","good");render();pgDraw();
    }},
    {t:"Reddet",f:()=>{if(answered||S!==life||S.dead)return;answered=true;line(person.n+" arkadaşlık teklifini reddettin.");render()}}
  ]);
}
addPerson=function(role){
  if(!/arkadaş/i.test(role))return addPersonBeforeFriendApproval(role);
  if(!S||S.dead)return;const gender=Math.random()<.5;
  proposeFriend(Pn(role,FN(gender)+" "+SN(),gender?1:0,Math.max(0,S.age+rnd(-2,2)),rnd(40,60)));
};
