// Paylaşım sonrası en fazla yılda bir ek olay; aktif sonuç pop-up'ını kesmez.
function maybeSocialHumor(){
 if(!S||S.dead||S.age<13||S.socialHumorYear===S.age||!socialHumorAccounts().length||Math.random()>=.3)return;
 const event=R(SOCIAL_HUMOR_EVENTS),life=S,age=S.age;S.socialHumorYear=age;
 queueResultNotice(event.t,event.d,event.c.map(choice=>({t:choice.t,f:()=>{
   if(S!==life||S.dead||S.age!==age||!socialHumorAccounts().length)return;
   apply(choice.fx);choice.run();line(choice.m,'good');render();pgDraw();modal('Olay sonucu',choice.m,[{t:'Kapat',p:1}]);
 }})));
}
const publishSocialPostBeforeSurprises=publishSocialPost;
publishSocialPost=function(id,typeId){
 const life=S,account=S&&S.socialMedia&&S.socialMedia[id],posts=account&&account.posts;
 const result=publishSocialPostBeforeSurprises(id,typeId);
 if(S===life&&account&&account.posts>posts)maybeSocialHumor();return result;
};
