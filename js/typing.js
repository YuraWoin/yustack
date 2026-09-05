/* ---- typing effect in hero terminal line ---- */
(function(){
  const words = ["whoami","cat about.txt","./deploy.sh --client=you"];
  const el = document.getElementById('typeline');
  let wi=0, ci=0, deleting=false;
  function tick(){
    const w = words[wi];
    if(!deleting){
      ci++;
      el.textContent = w.slice(0,ci);
      if(ci===w.length){ deleting=true; setTimeout(tick,1400); return; }
    } else {
      ci--;
      el.textContent = w.slice(0,ci);
      if(ci===0){ deleting=false; wi=(wi+1)%words.length; }
    }
    setTimeout(tick, deleting?40:80);
  }
  tick();
})();
