(function(){
  "use strict";
  if(document.querySelector(".hallel-back-to-top"))return;

  var button=document.createElement("button");
  button.type="button";
  button.className="hallel-back-to-top";
  button.setAttribute("aria-label","Volver arriba");
  button.setAttribute("title","Volver arriba");
  button.setAttribute("aria-hidden","true");
  button.tabIndex=-1;
  button.innerHTML='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6"/><path d="M12 9v11"/></svg>';
  document.body.appendChild(button);

  var active=false,scheduled=false;
  function translate(){
    var label=document.documentElement.lang==="en"?"Back to top":"Volver arriba";
    button.setAttribute("aria-label",label);
    button.setAttribute("title",label);
  }
  function update(){
    scheduled=false;
    var shown=(window.scrollY||document.documentElement.scrollTop||0)>360;
    if(shown===active)return;
    active=shown;
    button.classList.toggle("is-visible",shown);
    button.setAttribute("aria-hidden",shown?"false":"true");
    button.tabIndex=shown?0:-1;
  }
  function onScroll(){
    if(scheduled)return;
    scheduled=true;
    window.requestAnimationFrame(update);
  }
  button.addEventListener("click",function(){
    var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:0,behavior:reduced?"auto":"smooth"});
  });
  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("pageshow",onScroll);
  if(window.MutationObserver){
    new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  }
  translate();update();
})();
