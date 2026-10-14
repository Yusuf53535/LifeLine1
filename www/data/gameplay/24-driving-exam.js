// Basit oyun soruları; görseller yerel SVG'dir, ağ bağlantısı gerektirmez.
const DRIVING_EXAM_QUESTIONS=[
 {id:'stop',name:'DUR',shape:'stop',question:'Bu tabelayı gördüğünde ne yapmalısın?',answers:['Tamamen durup yolu kontrol et','Hızlan','Korna çalıp devam et'],correct:0},
 {id:'yield',shape:'yield',question:'Bu tabela ne anlama geliyor?',answers:['Yol ver','Park edebilirsin','Hız sınırı yok'],correct:0},
 {id:'noentry',shape:'noentry',question:'Bu tabela ne anlama geliyor?',answers:['Taşıt giremez','Tek yönlü yol','Ücretsiz park'],correct:0},
 {id:'speed',shape:'speed',question:'Bu tabela neyi gösteriyor?',answers:['En yüksek hız 50','En az 50 araç geçmeli','50 metre sonra park alanı'],correct:0},
 {id:'oneway',shape:'oneway',question:'Bu tabela ne anlama geliyor?',answers:['Tek yönlü yol','Geri dön','Yol kapalı'],correct:0},
 {id:'redlight',shape:'redlight',question:'Trafik ışığı kırmızı yanıyorsa ne yapmalısın?',answers:['Dur','Yavaşlayıp geç','Hızlanarak geç'],correct:0}
];
function drivingSignSVG(shape){
 const art={stop:'<polygon points="42,12 98,12 128,42 128,98 98,128 42,128 12,98 12,42" fill="#dc3c49" stroke="white" stroke-width="5"/><text x="70" y="80" text-anchor="middle" fill="white" font-size="30" font-weight="800">DUR</text>',yield:'<path d="M10 18H130L70 123Z" fill="white" stroke="#db3b48" stroke-width="12" stroke-linejoin="round"/>',noentry:'<circle cx="70" cy="70" r="57" fill="#df3c49" stroke="white" stroke-width="4"/><rect x="28" y="60" width="84" height="20" rx="3" fill="white"/>',speed:'<circle cx="70" cy="70" r="56" fill="white" stroke="#dc3c49" stroke-width="12"/><text x="70" y="86" text-anchor="middle" fill="#242532" font-size="48" font-weight="800">50</text>',oneway:'<rect x="12" y="12" width="116" height="116" rx="8" fill="#3480d3" stroke="white" stroke-width="4"/><path d="M70 28L102 62H82V111H58V62H38Z" fill="white"/>',redlight:'<rect x="45" y="5" width="50" height="130" rx="16" fill="#242732" stroke="#9b9dac" stroke-width="3"/><circle cx="70" cy="30" r="15" fill="#ff4558"/><circle cx="70" cy="70" r="15" fill="#585136"/><circle cx="70" cy="110" r="15" fill="#324c40"/>'};
 return '<div class="driving-sign"><svg viewBox="0 0 140 140" role="img" aria-label="Sınav trafik işareti">'+art[shape]+'</svg></div>';
}
function openDrivingExam(){
 if(!S||S.dead)return;
 if(S.age<18)return modal('Ehliyet sınavı','Sınava girmek için 18 yaşında olmalısın.',[{t:'Kapat',p:1}]);
 if(S.drivingLicense)return modal('Ehliyet','Zaten ehliyetin var.',[{t:'Kapat',p:1}]);
 if(S.drivingExamAge===S.age)return modal('Ehliyet sınavı','Bu yıl sınava zaten girdin. Gelecek yıl sürücü kursundan tekrar deneyebilirsin.',[{t:'Kapat',p:1}]);
 const fee=15000;if(S.p<fee)return modal('Ehliyet sınavı','Sınav için '+TL(fee)+' gerekiyor.',[{t:'Kapat',p:1}]);
 const life=S,age=S.age,question=R(DRIVING_EXAM_QUESTIONS);let answered=false;
 S.p-=fee;S.drivingExamAge=age;
 const answers=question.answers.map((text,index)=>({text,index}));for(let i=answers.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[answers[i],answers[j]]=[answers[j],answers[i]]}
 modal('Ehliyet sınavı',question.question+' Sınav ücreti: '+TL(fee)+'.',answers.map(answer=>({t:answer.text,f:()=>{
  if(answered||S!==life||S.dead||S.age!==age)return;answered=true;
  const passed=answer.index===question.correct;apply({m:passed?10:-5});if(passed)S.drivingLicense=true;
  const message=passed?'Doğru cevap! Ehliyetini aldın. (+10 mutluluk)':'Yanlış cevap. Doğrusu: '+question.answers[question.correct]+'. Gelecek yıl tekrar deneyebilirsin. (-5 mutluluk)';
  line(message,passed?'good':'bad');render();pgDraw();queueResultNotice(passed?'Ehliyetini aldın':'Sınavı geçemedin',message,[{t:'Kapat',p:1}]);
 }})));
 $('sheet').querySelector('p').insertAdjacentHTML('afterend',drivingSignSVG(question.shape));
}
ACTS.push({ic:'🚦',t:'Sürücü kursu',d:'Trafik işaretlerini bil, ehliyetini al',items:[{t:'Ehliyet sınavına gir',a:18,fx:{},special:'drivingExam'}]});
const doActBeforeDrivingExam=doAct;
doAct=function(item){if(item.special==='drivingExam')return openDrivingExam();return doActBeforeDrivingExam(item)};
