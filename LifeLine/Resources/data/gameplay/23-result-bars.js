// Sonuç pop-up'ındaki gerçek değişimler; seçim ekranlarına bar eklenmez.
const RESULT_BAR_FIELDS=[['m','Mutluluk','😊','#e4a650'],['h','Sağlık','❤️','#f56f99'],['z','Zekâ','🧠','#60c78a'],['g','Görünüm','✨','#ffd464']];
function resultStatSnapshot(life){
 if(!life)return null;
 const snapshot=Object.fromEntries(RESULT_BAR_FIELDS.map(([key])=>[key,Number(life[key])||0]));
 snapshot.bonds=(life.people||[]).filter(p=>!p.dead).map(p=>({id:p.id,person:p,before:Number(p.b)||0}));
 if(life.partner)snapshot.bonds.push({partner:true,person:life.partner,before:Number(life.partner.b)||0});
 return snapshot;
}
function resultStatChanges(before,life){
 if(!before||!life)return[];
 const rows=RESULT_BAR_FIELDS.map(([key,label,icon,color])=>({key,label,icon,color,before:before[key],after:Number(life[key])||0,delta:(Number(life[key])||0)-before[key]})).filter(row=>row.delta);
 for(const bond of before.bonds||[]){const person=bond.partner?life.partner:(life.people||[]).find(p=>p===bond.person||(bond.id!==undefined&&p.id===bond.id));if(!person||person.dead||bond.partner&&person!==bond.person)continue;const after=Number(person.b)||0,delta=after-bond.before;if(delta)rows.push({key:'bond',label:'İlişki · '+person.n,icon:'❤️',color:'#e4a650',before:bond.before,after,delta})}
 return rows;
}
let resultApplyBefore=null,resultApplyLife=null;
function currentResultChanges(){if(resultAction&&resultAction.life===S)return resultStatChanges(resultAction.before,S);return resultApplyLife===S?resultStatChanges(resultApplyBefore,S):[]}
const applyBeforeResultBars=apply;
apply=function(effects){if(!resultApplyBefore||resultApplyLife!==S){resultApplyBefore=resultStatSnapshot(S);resultApplyLife=S;queueMicrotask(()=>{resultApplyBefore=null;resultApplyLife=null})}return applyBeforeResultBars(effects)};
function resultBarsHTML(changes){return '<section class="result-bars" aria-label="Özellik değişimleri">'+changes.map(r=>'<div class="result-bar'+(r.delta<0?' loss':'')+'"><div class="result-bar-head"><span>'+r.icon+' '+esc(r.label)+'</span><strong>'+(r.delta>0?'+':'')+r.delta+' · %'+r.after+'</strong></div><div class="result-bar-track"><span class="result-bar-fill" style="width:'+cl(r.after)+'%;background:'+r.color+'"></span><span class="result-bar-change" style="left:'+cl(Math.min(r.before,r.after))+'%;width:'+Math.abs(cl(r.after)-cl(r.before))+'%"></span></div></div>').join('')+'</section>'}
function drawResultBars(changes){if(!changes||!changes.length)return;const sheet=$('sheet'),existing=sheet.querySelector('.result-bars');if(existing)existing.remove();const box=document.createElement('div');box.innerHTML=resultBarsHTML(changes);sheet.insertBefore(box,sheet.querySelector('button'))}
function resultPopupHasOnlyCloseButton(){const buttons=Array.from($('sheet').querySelectorAll('button'));return $('modal').classList.contains('on')&&buttons.length===1&&/^(Kapat|Tamam|Close|OK)$/i.test(buttons[0].textContent.trim())}
// Sayısal etkiler barlarda gösterilir.
function naturalResultText(text){return String(text||'').replace(/\s*\(([^()]*)\)/g,(whole,content)=>{
 const parts=content.split(/[,;]\s*/);
 return parts.every(part=>/^[+−-]?\d[\d.]*\s*(?:%\s*)?(?:mutluluk|sağlık|zekâ|zeka|görünüm|bağ|ilişki|stres|performans|şöhret|itibar)(?:\s|$)/i.test(part.trim())||/^(?:bağ|ilişki) (?:azaldı|arttı)$/i.test(part.trim()))?'':whole;
}).trim()}
function naturalResultTitle(title){
 const names={'İşlem sonucu':'Hayatından bir an','İlişki sonucu':'Aranızda geçenler','Tanışma sonucu':'Yeni bir tanışma','Olay sonucu':'Hayatından bir an'};
 return names[title]||String(title).replace(/ sonucu$/,'');
}
const modalBeforeResultBars=modal;
modal=function(title,text,buttons){const changes=currentResultChanges(),result=modalBeforeResultBars(naturalResultTitle(title),naturalResultText(text),buttons);if(changes.length&&buttons.length===1&&!buttons[0].f)drawResultBars(changes);return result};

// Tanışma, aktiviteler ve kişi eylemleri sonucu doğrudan kuyruğa alınır.
function runResultBarAction(callback,title){
 const life=S,before=resultStatSnapshot(S),count=resultNotices.length,version=resultModalVersion;
 const messages=[],previousLine=line;
 line=function(text,color){messages.push(String(text));return previousLine(text,color)};
 let result;try{result=callback()}finally{line=previousLine}
 if(S!==life||!S||S.dead)return result;
 const changes=resultStatChanges(before,S);if(!changes.length)return result;
 const pending=resultNotices.slice(count).find(n=>n.life===life);
 if(pending)pending.statChanges=changes;
 else if(version!==resultModalVersion){if(resultPopupHasOnlyCloseButton())drawResultBars(changes)}
 else queueResultNotice(title||'Hayatından bir an',messages.length?messages.join('\n'):'Günün nasıl geçtiğine bir göz at.',undefined,undefined,changes);
 return result;
}
const meetBeforeResultBars=meet;
meet=function(){return runResultBarAction(meetBeforeResultBars,'Yeni bir tanışma')};
const doActBeforeResultBars=doAct;
doAct=function(item){return runResultBarAction(()=>doActBeforeResultBars(item),item.t)};
