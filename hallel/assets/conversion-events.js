/* HALLEL measurement-ready events. No analytics provider is installed here.
   A connected GTM container can listen for the "hallel_*" dataLayer events.
   Appointment completion must be measured by the booking provider separately. */
(function(){
  "use strict";
  function emit(eventName, details){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push(Object.assign({event:"hallel_"+eventName,page_path:location.pathname},details||{}));
  }
  document.addEventListener("click",function(event){
    var link=event.target&&event.target.closest?event.target.closest("a[href]"):null;
    if(!link)return;
    var target;
    try{target=new URL(link.href,location.href)}catch(e){return}
    var host=target.hostname.toLowerCase(),path=target.pathname.toLowerCase();
    var originPage=location.pathname;
    if(host==="calendar.app.google"){
      emit("booking_provider_open",{source_page:originPage,service:new URLSearchParams(location.search).get("servicio")||""});
    }else if(host==="wa.me"||host==="api.whatsapp.com"){
      emit("contact_whatsapp",{source_page:originPage});
    }else if(host==="ig.me"||host==="instagram.com"||host.endsWith(".instagram.com")){
      emit("contact_instagram",{source_page:originPage});
    }else if(path.indexOf("/agendar/")!==-1){
      emit("booking_start",{source_page:originPage});
    }else if(path.indexOf("/servicios/")!==-1){
      emit("service_select",{destination:path,source_page:originPage});
    }else if(path.indexOf("/resultados/")!==-1){
      emit("case_view",{destination:path,case_id:target.hash||""});
    }
  },{passive:true});
  if(/\/agendar\/?$/.test(location.pathname)){
    emit("booking_page_view",{service:new URLSearchParams(location.search).get("servicio")||""});
  }
})();
