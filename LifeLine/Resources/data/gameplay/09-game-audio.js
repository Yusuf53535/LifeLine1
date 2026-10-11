// Özgün, kısa arayüz sesleri Web Audio ile üretilir; ses dosyası indirilmez.
const GAME_AUDIO_KEY="lifeline_audio_enabled";
const GAME_AUDIO={enabled:true,context:null,master:null,lastClick:-1,voices:0};
try{GAME_AUDIO.enabled=localStorage.getItem(GAME_AUDIO_KEY)!=="0"}catch(e){}
function setGameAudioEnabled(enabled){
  GAME_AUDIO.enabled=!!enabled;
  if(GAME_AUDIO.master&&GAME_AUDIO.context)GAME_AUDIO.master.gain.setValueAtTime(enabled?.22:0,GAME_AUDIO.context.currentTime);
  try{localStorage.setItem(GAME_AUDIO_KEY,enabled?"1":"0")}catch(e){}
}
function unlockGameAudio(){
  if(!GAME_AUDIO.enabled)return null;
  try{
    if(!GAME_AUDIO.context){
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;
      const context=new Audio();GAME_AUDIO.context=context;GAME_AUDIO.master=context.createGain();
      GAME_AUDIO.master.gain.value=.22;GAME_AUDIO.master.connect(context.destination);
    }
    if(GAME_AUDIO.context.state==="suspended")return GAME_AUDIO.context.resume();
  }catch(e){return null}
  return null;
}
function playGameSound(kind="click"){
  const context=GAME_AUDIO.context;if(!GAME_AUDIO.enabled||!context||context.state!=="running"||GAME_AUDIO.voices>=12)return;
  const time=context.currentTime;
  if(kind==="click"&&time-GAME_AUDIO.lastClick<.045)return;
  if(kind==="click")GAME_AUDIO.lastClick=time;
  const note=(frequency,delay,duration,type="sine",level=.16,endFrequency)=>{
    let oscillator,gain;
    try{
      oscillator=context.createOscillator();gain=context.createGain();
      oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,time+delay);
      if(endFrequency)oscillator.frequency.exponentialRampToValueAtTime(endFrequency,time+delay+duration);
      gain.gain.setValueAtTime(.0001,time+delay);gain.gain.exponentialRampToValueAtTime(level,time+delay+.006);gain.gain.exponentialRampToValueAtTime(.0001,time+delay+duration);
      oscillator.connect(gain);gain.connect(GAME_AUDIO.master);GAME_AUDIO.voices++;
      oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();GAME_AUDIO.voices=Math.max(0,GAME_AUDIO.voices-1)};
      oscillator.start(time+delay);oscillator.stop(time+delay+duration+.015);
    }catch(e){if(oscillator)oscillator.disconnect();if(gain)gain.disconnect()}
  };
  if(kind==="year"){note(523,0,.12);note(659,.065,.14);note(784,.13,.20)}
  else if(kind==="popup"){note(740,0,.09,"sine",.10);note(988,.055,.14,"sine",.08)}
  else if(kind==="close")note(440,0,.055,"sine",.10,260);
  else note(820,0,.052,"sine",.16,430);
}
// İlk gerçek kullanıcı dokunuşunda açılır; eski kayıt yüklenirken otomatik çalmaz.
document.addEventListener("click",event=>{
  if(!event.isTrusted)return;
  const button=event.target.closest&&event.target.closest("button");
  if(!button||button.disabled||button.getAttribute("aria-disabled")==="true"||button.dataset.k==="sound")return;
  const kind=button.id==="next"&&S&&!S.dead?"year":button.classList.contains("x")?"close":"click";
  const resume=unlockGameAudio();
  if(resume&&typeof resume.then==="function")resume.then(()=>playGameSound(kind)).catch(()=>{});
  else playGameSound(kind);
},true);
const modalBeforeGameAudio=modal;
modal=function(title,text,buttons){const result=modalBeforeGameAudio(title,text,buttons);playGameSound("popup");return result};
document.addEventListener("visibilitychange",()=>{
  if(document.hidden&&GAME_AUDIO.context&&GAME_AUDIO.context.state==="running"){
    try{const suspended=GAME_AUDIO.context.suspend();if(suspended&&suspended.catch)suspended.catch(()=>{})}catch(e){}
  }
});
