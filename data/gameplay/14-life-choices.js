// Bekleyen kararlar yalnızca aynı hayat, yıl ve geçerli hedef için uygulanır.
function queueLifeChoice(title,text,choices,guard=()=>true){
 const life=S,age=S.age;let answered=false;
 queueResultNotice(title,text,choices.map(choice=>({t:choice.t,p:choice.p,f:()=>{
  if(answered||S!==life||S.dead||S.age!==age||!guard())return;answered=true;
  const message=choice.run();if(message){line(message,'good');render();pgDraw();modal('Olay sonucu',message,[{t:'Kapat',p:1}])}
 }})));
}
function annualLifeFlag(key){S.lifeFlags=S.lifeFlags||{};if(S.lifeFlags[key]===S.age)return false;S.lifeFlags[key]=S.age;return true}
