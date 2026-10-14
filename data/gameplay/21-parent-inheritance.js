// Oyun içi miras dengesi: ebeveyn başına aile durumuna göre birikim.
const INHERITANCE_BALANCE={ranges:[[5000,40000],[100000,450000],[600000,1800000]],spouseShare:.25};
function prepareParentEstates(){
 if(!S)return;
 const level=Math.max(0,Math.min(2,Number(S.fam)||0)),range=INHERITANCE_BALANCE.ranges[level];
 const scale=Number(CD[S.home]&&CD[S.home].w)||1;
 (S.people||[]).filter(p=>p.role==='Anne'||p.role==='Baba').forEach(p=>{
  if(p.dead){if(!p.inheritanceSettled)p.inheritanceSettled=true;return}
  if(!Number.isFinite(p.inheritanceEstate))p.inheritanceEstate=Math.round((range[0]+Math.random()*(range[1]-range[0]))*scale);
 });
}
function settleParentInheritance(parent){
 if(!S||S.dead||!parent||!parent.dead||parent.inheritanceSettled||!['Anne','Baba'].includes(parent.role))return;
 parent.inheritanceSettled=true;
 const estate=Math.max(0,Math.round(Number(parent.inheritanceEstate)||0));
 const spouse=(S.people||[]).find(p=>!p.dead&&p.role===(parent.role==='Anne'?'Baba':'Anne'));
 const spouseAmount=spouse?Math.floor(estate*INHERITANCE_BALANCE.spouseShare):0;
 if(spouse)spouse.inheritanceEstate=(Number(spouse.inheritanceEstate)||0)+spouseAmount;
 const siblings=(S.people||[]).filter(p=>!p.dead&&['Erkek kardeş','Kız kardeş'].includes(p.role));
 const amount=Math.floor((estate-spouseAmount)/(siblings.length+1));
 S.p+=amount;
 if(!Array.isArray(S.inheritanceHistory))S.inheritanceHistory=[];
 S.inheritanceHistory.push({parentId:parent.id,name:parent.n,role:parent.role,age:S.age,estate,amount,siblings:siblings.length,spouseAmount});
 const details=parent.n+' ('+parent.role+') sana '+TL(amount)+' miras bıraktı.'+(siblings.length?' Çocuklara kalan miras '+(siblings.length+1)+' kardeş arasında eşit paylaşıldı.':'')+(spouse?' Hayattaki ebeveynine de mirastan pay ayrıldı.':'')+' Payın banka bakiyene eklendi.';
 line(details,amount>0?'gold':undefined);
 queueResultNotice('Ailenden miras kaldı',details,[{t:'Kapat',p:1}]);
}
const nextYearBeforeParentInheritance=nextYear;
nextYear=function(){
 if(!S||S.dead)return nextYearBeforeParentInheritance();
 const life=S,age=S.age;
 prepareParentEstates();
 const parents=(S.people||[]).filter(p=>!p.dead&&['Anne','Baba'].includes(p.role));
 const result=nextYearBeforeParentInheritance();
 if(S===life&&!S.dead&&S.age>age){parents.filter(p=>p.dead).forEach(settleParentInheritance);render()}
 return result;
};
// Oyuncunun öldürdüğü ebeveyn üzerinden miras kazancı oluşmaz.
const killedBeforeParentInheritance=killed;
killed=function(person){if(person&&['Anne','Baba'].includes(person.role))person.inheritanceSettled=true;return killedBeforeParentInheritance(person)};
$('next').onclick=nextYear;
