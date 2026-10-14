/* Le Syndicat des Gratouilles : scripts de la page d'accueil. */
/* Les partenaires changent d'ordre à chaque visite ; la ligne d'information reste en dernier. */
document.querySelectorAll('[data-shuffle]').forEach(function(ul){
  var items=[].slice.call(ul.children).filter(function(li){return !li.hasAttribute('data-fixed');});
  var fixed=[].slice.call(ul.querySelectorAll('[data-fixed]'));
  for(var i=items.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=items[i];items[i]=items[j];items[j]=x;}
  items.concat(fixed).forEach(function(li){ul.appendChild(li);});
});
/* Le nom apparaît dans l'en-tête une fois le grand titre sorti de l'écran. Sans JavaScript, il reste visible. */
(function(){
  var head=document.querySelector('.site-head'), h1=document.getElementById('h1');
  if(!head||!h1) return;
  head.classList.add('has-hero');
  var ticking=false;
  function update(){ ticking=false; head.classList.toggle('scrolled', h1.getBoundingClientRect().bottom < 70); }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking=true; setTimeout(update, 50); } }, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
/* Menu sur téléphone : ouverture, fermeture au clic sur un lien ou avec Échap. */
(function(){
  var head=document.querySelector('.site-head'), btn=document.querySelector('.nav-toggle');
  if(!head||!btn) return;
  function set(open){head.classList.toggle('open',open);btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');}
  btn.addEventListener('click',function(){set(!head.classList.contains('open'));});
  head.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
})();
/* Lavis du nom : sa palette suit la saison du jour. L'arc-en-ciel reste réservé au podcast.
   Pour prévisualiser une saison : ajouter #printemps, #ete, #automne ou #hiver à l'adresse. */
(function(){
  var P={
    printemps:['#F4CAD6','#F7DCE5','#E5D3F1','#F8EBC6','#F0D2E2','#EBDDF3'],
    ete:['#F5E2A4','#F8E9B8','#F1D497','#CFE4F2','#F9ECC2','#D9EAF4'],
    automne:['#C9DAF2','#DCCBEF','#F1CADF','#D3C7EC','#C2DAEC','#E9D4EE'],
    hiver:['#C6D9EC','#D4E0EE','#CFCAEA','#DDE6F1','#BFD0E6','#D7D3EE']
  };
  function saison(d){
    var m=d.getMonth()+1, j=d.getDate(), k=m*100+j;
    if(k>=321&&k<621) return 'printemps';
    if(k>=621&&k<922) return 'ete';
    if(k>=922&&k<1221) return 'automne';
    return 'hiver';
  }
  var h=(location.hash||'').slice(1), s=P[h]?h:saison(new Date()), pal=P[s];
  document.querySelectorAll('svg.lavis[data-saison] ellipse').forEach(function(e,i){ e.setAttribute('fill', pal[(i*7+3)%pal.length]); });
  document.documentElement.setAttribute('data-saison', s);
})();

/* Encart « En ce moment » : les actualités défilent à l'horizontale, la suivante dépasse au bord. Les points indiquent la position et permettent d'y aller. */
(function(){
  var track=document.querySelector('.now-track'), dots=document.querySelector('.now-dots');
  if(!track || !dots) return;
  var slides=track.querySelectorAll('.now-slide');
  if(slides.length<2) return;
  var btns=[];
  slides.forEach(function(sl, i){
    var b=document.createElement('button');
    b.type='button';
    b.setAttribute('aria-label', 'Actualité '+(i+1)+' sur '+slides.length+' : '+sl.querySelector('b').textContent);
    b.addEventListener('click', function(){ track.scrollTo({left: sl.offsetLeft-track.offsetLeft, behavior:'smooth'}); mark(i); });
    dots.appendChild(b); btns.push(b);
  });
  function mark(n){
    btns.forEach(function(b, i){ b.setAttribute('aria-current', i===n ? 'true' : 'false'); });
    track.classList.toggle('at-end', n===slides.length-1);
  }
  function current(){
    var x=track.scrollLeft, best=0, d=Infinity;
    slides.forEach(function(sl, i){ var e=Math.abs(sl.offsetLeft-track.offsetLeft-x); if(e<d){ d=e; best=i; } });
    if(x+track.clientWidth >= track.scrollWidth-2) best=slides.length-1;
    mark(best);
  }
  var t;
  track.addEventListener('scroll', function(){ clearTimeout(t); t=setTimeout(current, 60); }, {passive:true});
  dots.hidden=false; current();
})();

/* Un lien vers un bloc dépliable (espace presse) l'ouvre. */
(function(){
  function open(id){ var el=id && document.getElementById(id); if(el && el.tagName==='DETAILS') el.open=true; }
  document.addEventListener('click', function(e){ var a=e.target.closest && e.target.closest('a[href^="#"]'); if(a) open(a.getAttribute('href').slice(1)); });
  window.addEventListener('hashchange', function(){ open(location.hash.slice(1)); });
  open(location.hash.slice(1));
})();
