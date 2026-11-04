(function(){
var SU=(document.currentScript&&document.currentScript.src)||location.href;var reduce=false;try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var hd=document.getElementById('hdr'),tp=document.getElementById('top');
function sc(){var y=window.scrollY;if(hd)hd.classList.toggle('solid',y>10);if(tp)tp.classList.toggle('on',y>600);}
window.addEventListener('scroll',sc,{passive:true});sc();
if(tp)tp.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});});
var bg=document.getElementById('burger');
if(bg)bg.addEventListener('click',function(){var o=hd.classList.toggle('open');bg.setAttribute('aria-expanded',o?'true':'false');});
[].forEach.call(document.querySelectorAll('nav.main a'),function(a){a.addEventListener('click',function(){hd.classList.remove('open');});});
/* reveal */
var io=null;
try{io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1});}catch(e){}
[].forEach.call(document.querySelectorAll('.rv,.fw'),function(el){if(io)io.observe(el);else el.classList.add('in');});
/* carousels */
[].forEach.call(document.querySelectorAll('[data-car]'),function(c){
  var t=c.querySelector('.track');if(!t)return;
  var n=c.querySelector('[data-next]'),p=c.querySelector('[data-prev]');
  function step(){var f=t.firstElementChild;return f?f.getBoundingClientRect().width+28:300;}
  if(n)n.addEventListener('click',function(){t.scrollBy({left:step(),behavior:'smooth'});});
  if(p)p.addEventListener('click',function(){t.scrollBy({left:-step(),behavior:'smooth'});});
});
/* forms */
[].forEach.call(document.querySelectorAll('form[data-cm-form]'),function(f){
  f.addEventListener('submit',function(e){e.preventDefault();
    var b=f.querySelector('button[type=submit]'),n=f.querySelector('[data-cm-note]'),old=b.textContent;
    if(f.action.indexOf('YOUR_FORM_ID')>-1){if(n)n.textContent='This form is not connected yet. Please use the Book a call button.';return;}
    b.disabled=true;b.textContent='Sending...';
    fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){
      if(r.ok){f.reset();if(n)n.textContent='Thank you. We will respond within two business days.';}else{if(n)n.textContent='Something went wrong. Please try again or book a call.';}
    }).catch(function(){if(n)n.textContent='Something went wrong. Please try again or book a call.';}).finally(function(){b.disabled=false;b.textContent=old;});
  });
});
/* deep links open posts */
function go(){var h=location.hash.slice(1);if(!h)return;var el=document.getElementById(h);if(!el)return;if(el.tagName==='DETAILS')el.open=true;setTimeout(function(){el.scrollIntoView();},60);}
window.addEventListener('hashchange',go);window.addEventListener('load',go);
/* cursor dot + hero glass */
var fine=false;try{fine=matchMedia('(hover:hover) and (pointer:fine)').matches;}catch(e){}
var heroes=[].slice.call(document.querySelectorAll('[data-hero]')).map(function(el){return {el:el,cvb:el.querySelector('.cvb'),cvg:el.querySelector('.cvg'),roots:[],live:false,x:0,y:0,hist:[]};});
var dot=document.getElementById('cdot');
var tx=-200,ty=-200,dx=-200,dy=-200,seen=false;
if(fine&&dot&&!reduce){
  document.documentElement.classList.add('has-dot');
  window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!seen){seen=true;dx=tx;dy=ty;dot.classList.add('on');heroes.forEach(function(h){var r=h.el.getBoundingClientRect();h.x=tx-r.left;h.y=ty-r.top;});}},{passive:true});
  document.documentElement.addEventListener('pointerleave',function(){dot.classList.remove('on');});
  document.documentElement.addEventListener('pointerenter',function(){if(seen)dot.classList.add('on');});
  [].forEach.call(document.querySelectorAll('a,button,summary,input,select,textarea'),function(a){a.addEventListener('pointerenter',function(){dot.classList.add('big');});a.addEventListener('pointerleave',function(){dot.classList.remove('big');});});
  var TR=[[6,200],[12,160],[20,120],[30,80]];
  var mask=function(h){
    var m='radial-gradient(circle 230px at '+h.x+'px '+h.y+'px,#000 0,#000 50%,transparent 100%)';
    var n=h.hist.length;
    for(var i=0;i<TR.length;i++){var k=n-1-TR[i][0];if(k<0)continue;var p=h.hist[k];m+=',radial-gradient(circle '+TR[i][1]+'px at '+p[0]+'px '+p[1]+'px,rgba(0,0,0,'+(0.75-i*0.15).toFixed(2)+') 0,transparent 100%)';}
    return m;
  };
  var tick=function(){
    dx+=(tx-dx)*0.2;dy+=(ty-dy)*0.2;dot.style.transform='translate('+dx+'px,'+dy+'px)';
    heroes.forEach(function(h){
      var r=h.el.getBoundingClientRect();
      h.x+=((tx-r.left)-h.x)*0.12;h.y+=((ty-r.top)-h.y)*0.12;
      h.hist.push([h.x,h.y]);if(h.hist.length>40)h.hist.shift();
      if(r.bottom<0||r.top>innerHeight||!h.live)return;
      var m=mask(h);h.cvg.style.webkitMaskImage=m;h.cvg.style.maskImage=m;
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
if(heroes.length&&navigator.gpu&&navigator.gpu.requestAdapter){
  var loadMod=function(){return import(new URL('../hero-shader.js',SU).href);};
  navigator.gpu.requestAdapter().then(function(a){
    if(!a)throw new Error('none');
    var hio=new IntersectionObserver(function(es){es.forEach(function(e){
      var h=heroes.filter(function(x){return x.el===e.target;})[0];if(!h)return;
      if(e.isIntersecting&&!h.live){
        h.live=true;
        var to=new Promise(function(_,rej){setTimeout(function(){rej(new Error('timeout'));},30000);});
        Promise.race([loadMod(),to]).then(function(m){
          if(!h.live)return;
          var b=document.createElement('div'),g=document.createElement('div');b.style.cssText=g.style.cssText='width:100%;height:100%';
          h.cvb.appendChild(b);h.cvg.appendChild(g);
          h.roots=[m.mount(b,false,reduce),m.mount(g,true,reduce)];
          setTimeout(function(){h.el.classList.add('live');},600);
        }).catch(function(){h.live=false;});
      }else if(!e.isIntersecting&&h.live){
        h.live=false;h.el.classList.remove('live');var rs=h.roots;h.roots=[];
        setTimeout(function(){rs.forEach(function(r){try{r.unmount();}catch(x){}});h.cvb.innerHTML='';h.cvg.innerHTML='';},1100);
      }
    });},{rootMargin:'100px'});
    heroes.forEach(function(h){hio.observe(h.el);});
  }).catch(function(){});
}
})();
