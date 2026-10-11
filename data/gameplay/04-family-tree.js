// Dikey soy ağacı: aile kolları, kuşaklar ve mevcut karakter.
function familyTreeSurname(people,fallback){const person=people.find(p=>p&&p.n);return person?person.n.split(" ").slice(1).join(" ")||fallback:fallback}
function familyTreeCard(person,tag,highlight){
  const age=Number.isFinite(person.age)?person.age:Number.isFinite(person.pa)?person.pa:null;
  const face=pface({f:person.f,pa:age===null?30:age,dead:false});
  return '<article class="family-person '+(highlight?'family-person-self ':'')+(person.dead?'family-person-dead':'')+'"><span class="family-person-face">'+face+'</span><span class="family-person-info"><b>'+esc(person.n)+'</b><small><span aria-hidden="true">♡</span> '+esc(tag||person.role||"Aile üyesi")+'</small>'+(person.job?'<small><span aria-hidden="true">▣</span> '+esc(person.job)+'</small>':'')+(age!==null?'<small><span aria-hidden="true">▦</span> '+age+' yaşında'+(person.dead?' · Vefat etti':'')+'</small>':person.dead?'<small>Vefat etti</small>':'')+'</span></article>';
}
function familyTreeConnector(split){return '<div class="family-connector '+(split?'family-connector-fork':'')+'" aria-hidden="true"><i></i><span></span></div>'}
treeHtml=function(){
  const ancestors=S.anc||[],current={me:{n:S.name,f:S.f,age:S.age,dead:S.dead,job:S.job?S.job.n:""},spouse:S.partner?{n:S.partner.n,f:pfOf(S.partner),married:S.married,age:typeof relationshipAge==="function"?relationshipAge(S.partner):null}:null,sibs:(S.people||[]).filter(p=>/kardeş/.test(p.role)).map(nodeOf),kids:(S.people||[]).filter(p=>p.role==="Oğul"||p.role==="Kız").map(nodeOf)};
  const generations=[...ancestors,current],parents=ancestors.length?ancestors[0].parents||[]:(S.people||[]).filter(p=>p.role==="Anne"||p.role==="Baba").map(nodeOf),grandparents=ancestors.length?ancestors[0].gp||[]:gpNodes();
  let html='<div class="family-tree-vertical">';
  if(grandparents.length){
    const sides=[grandparents.slice(0,2),grandparents.slice(2)];
    html+='<div class="family-grandparents">'+sides.map((side,index)=>'<section class="family-side"><h3>'+esc(familyTreeSurname(side,index?'Anne tarafı':'Baba tarafı'))+' ailesi</h3>'+side.map(p=>familyTreeCard(p)).join('')+'</section>').join('')+'</div>';
    html+=familyTreeConnector(true);
  }
  if(parents.length){
    const ordered=parents.slice().sort((a,b)=>(a.role==='Baba'?-1:a.role==='Anne'?1:0)-(b.role==='Baba'?-1:b.role==='Anne'?1:0));
    html+='<div class="family-tree-pair">'+ordered.map(p=>familyTreeCard(p)).join('')+'</div>'+familyTreeConnector(true);
  }
  generations.forEach((generation,index)=>{
    const isCurrent=index===generations.length-1;
    if(generation.sibs&&generation.sibs.length)html+='<section class="family-siblings"><h3>Kardeşler</h3><div class="family-tree-pair">'+generation.sibs.map(p=>familyTreeCard(p)).join('')+'</div></section>';
    html+='<div class="family-tree-center">'+familyTreeCard({...generation.me,dead:isCurrent?generation.me.dead:true},isCurrent?'Sen':'Önceki karakterin',isCurrent)+'</div>';
    if(generation.spouse)html+=familyTreeConnector(false)+'<div class="family-tree-center">'+familyTreeCard(generation.spouse,generation.spouse.married?'Eşin':'Sevgilin')+'</div>';
    const next=generations[index+1],children=(generation.kids||[]).filter(p=>!next||p.n!==next.me.n);
    if(children.length)html+=familyTreeConnector(false)+'<section class="family-children"><h3>Çocuklar</h3><div class="family-tree-pair">'+children.map(p=>familyTreeCard(p)).join('')+'</div></section>';
    if(next)html+=familyTreeConnector(false);
  });
  return html+'</div>';
};
