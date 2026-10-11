// Şöhret kaynakları: sosyal kitle ve işletmenin erişimi; para bakiyesi etkili değildir.
const FAME_BALANCE={socialMilestones:[[0,0],[1000,5],[10000,15],[100000,40],[1000000,75],[10000000,100]],businessCap:85,secondaryContribution:.2};
socialFame=function(){
 const accounts=S&&S.socialMedia?Object.values(S.socialMedia):[];
 const followers=accounts.reduce((sum,a)=>sum+Math.max(0,Number(a.followers)||0),0);
 const points=FAME_BALANCE.socialMilestones;
 for(let i=1;i<points.length;i++){
   const [end,rating]=points[i],[start,previous]=points[i-1];
   if(followers<=end){const progress=(Math.log10(1+followers)-Math.log10(1+start))/(Math.log10(1+end)-Math.log10(1+start));return Math.max(0,Math.min(100,Math.round(previous+(rating-previous)*progress)))}
 }
 return 100;
};
function businessFame(){
 const b=S&&S.biz;if(!b)return 0;
 const branches=Math.max(1,Number(b.br)||1),employees=Math.max(0,Number(b.emp)||0),years=Math.max(0,Number(b.yrs)||0);
 const reputation=Math.max(0,Math.min(100,b.rep==null?50:Number(b.rep)||0));
 const history=(b.hist||[]).slice(-3),revenue=history.length?history.reduce((sum,x)=>sum+Math.max(0,Number(x.rev)||0),0)/history.length:0;
 const profitable=history.filter(x=>(Number(x.net)||0)>0).length/Math.max(1,history.length);
 const country=S.home||'Türkiye',wageScale=Math.max(.1,(CD[country]||CD['Türkiye']).w);
 const reach=1+Math.log2(branches)*12+Math.log10(1+employees)*14+Math.log10(1+revenue/(500000*wageScale))*16+Math.min(10,years)*.6*profitable;
 return Math.min(FAME_BALANCE.businessCap,Math.max(0,Math.round(reach*(.35+.65*reputation/100))));
}
function overallFame(){
 const social=socialFame(),business=businessFame();
 return Math.min(100,Math.round(Math.max(social,business)+Math.min(social,business)*FAME_BALANCE.secondaryContribution));
}
