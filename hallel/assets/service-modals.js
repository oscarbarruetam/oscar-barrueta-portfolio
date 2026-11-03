(function(){
"use strict";
const chapters=Array.from(document.querySelectorAll("section.service-chapter[id]"));
const modalById=new Map();
let triggerBeforeOpen=null;
const hasNativeDialog=typeof HTMLDialogElement!=="undefined"&&typeof HTMLDialogElement.prototype.showModal==="function";
if(chapters.length&&hasNativeDialog){
 for(const chapter of chapters){
  const id=chapter.id;
  const dlg=document.createElement("dialog");dlg.className="service-dialog";dlg.id="modal-"+id;
  const heading=chapter.querySelector("h2");
  if(heading){heading.id="dialog-title-"+id;dlg.setAttribute("aria-labelledby",heading.id)}
  const toolbar=document.createElement("div");toolbar.className="dialog-toolbar";
  const label=document.createElement("strong");label.setAttribute("data-en","SERVICE DETAILS");label.setAttribute("data-es","DETALLE DEL SERVICIO");
  label.textContent=document.documentElement.lang==="en"?"SERVICE DETAILS":"DETALLE DEL SERVICIO";
  const close=document.createElement("button");close.type="button";close.className="dialog-close";
  close.setAttribute("data-en","Close ×");close.setAttribute("data-es","Cerrar ×");
  close.textContent=document.documentElement.lang==="en"?"Close ×":"Cerrar ×";
  close.setAttribute("aria-label","Cerrar ventana de servicio");
  toolbar.append(label,close);dlg.append(toolbar,chapter);document.body.append(dlg);modalById.set(id,dlg);
  close.addEventListener("click",()=>dlg.close());
  dlg.addEventListener("close",()=>{
   document.documentElement.classList.remove("modal-open");
   if(location.hash==="#"+id){try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}}
   if(triggerBeforeOpen&&document.contains(triggerBeforeOpen)){triggerBeforeOpen.focus({preventScroll:true});triggerBeforeOpen=null}
  });
  dlg.addEventListener("click",e=>{
   if(e.target!==dlg)return;
   const r=dlg.getBoundingClientRect();
   if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dlg.close();
  });
 }
 document.documentElement.classList.add("modals-ready");
 function openService(id,trigger,changeUrl){
  const dlg=modalById.get(id);if(!dlg)return false;
  for(const other of modalById.values())if(other!==dlg&&other.open)other.close();
  triggerBeforeOpen=trigger||document.querySelector('.cap-jump[href="#'+id+'"]');
  if(changeUrl){try{history.replaceState(null,"","#"+id)}catch(e){}}
  if(!dlg.open)dlg.showModal();
  document.documentElement.classList.add("modal-open");
  dlg.querySelector(".dialog-close")?.focus({preventScroll:true});
  return true;
 }
 for(const link of document.querySelectorAll('#servicios .cap-jump[href^="#"]')){
  const id=link.getAttribute("href").slice(1);
  if(!modalById.has(id))continue;
  link.setAttribute("aria-haspopup","dialog");
  link.setAttribute("aria-controls","modal-"+id);
  link.addEventListener("click",e=>{e.preventDefault();openService(id,link,true)});
 }
 const openHash=()=>{
  let id="";
  try{id=decodeURIComponent(location.hash.slice(1))}catch(e){}
  if(modalById.has(id))openService(id,null,false);
  else for(const dlg of modalById.values())if(dlg.open)dlg.close();
 };
 window.addEventListener("hashchange",openHash);
 openHash();
}
const previews=Array.from(document.querySelectorAll("[data-preview-image]"));
if(previews.length&&hasNativeDialog){
 const lightbox=document.createElement("dialog");lightbox.className="example-dialog";
 lightbox.setAttribute("aria-label","Ejemplo de diseño ampliado");
 const tools=document.createElement("div");tools.className="dialog-toolbar";
 const title=document.createElement("strong");title.id="example-title";
 const close=document.createElement("button");close.type="button";close.className="dialog-close";
 close.textContent="Cerrar ×";close.setAttribute("data-es","Cerrar ×");close.setAttribute("data-en","Close ×");
 const image=document.createElement("img");image.alt="Ejemplo visual de diseño web ampliado";
 tools.append(title,close);lightbox.append(tools,image);document.body.append(lightbox);
 let lastTrigger=null;
 close.addEventListener("click",()=>lightbox.close());
 lightbox.addEventListener("close",()=>{document.documentElement.classList.remove("modal-open");image.removeAttribute("src");if(lastTrigger&&document.contains(lastTrigger))lastTrigger.focus({preventScroll:true})});
 lightbox.addEventListener("click",e=>{if(e.target!==lightbox)return;const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)lightbox.close()});
 for(const btn of previews){
  btn.addEventListener("click",()=>{
   const src=btn.getAttribute("data-preview-image");if(!src)return;
   lastTrigger=btn;image.src=src;image.alt=btn.getAttribute("data-preview-alt")||"Ejemplo ilustrativo de página web";
   title.textContent=btn.getAttribute("data-caption")||"Ejemplo de diseño web";
   lightbox.showModal();document.documentElement.classList.add("modal-open");
   close.focus({preventScroll:true});
  });
 }
}
})();