(function(){
  const imgEl=document.getElementById('captchaImg');
  const urlLabel=document.getElementById('urlLabel');
  const statusEl=document.getElementById('statusText');
  const solutionEl=document.getElementById('solutionText');
  const timerEl=document.getElementById('timerText');
  const reloadBtn=document.getElementById('reloadBtn');
  let countdown;

  function startCountdown(seconds){
    let s=seconds;
    timerEl.textContent = 'Time left: ' + s + 's';
    clearInterval(countdown);
    countdown = setInterval(()=>{
      s--;
      timerEl.textContent = 'Time left: ' + s + 's';
      if(s<=0){ clearInterval(countdown); timerEl.textContent='Time left: 0s'; }
    },1000);
  }

  async function recognizeWithTimeout(src, timeout=15000){
    let aborted=false;
    const workerPromise = Tesseract.recognize(src, 'eng', { tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }).then(r=>r.data.text);
    const timeoutPromise = new Promise(resolve=> setTimeout(()=>{ aborted=true; resolve(null); }, timeout));
    const text = await Promise.race([workerPromise, timeoutPromise]);
    if(aborted) return null;
    return text;
  }

  async function solveFromSrc(src){
    statusEl.textContent = 'Status: Solving...';
    solutionEl.textContent = '';
    startCountdown(15);
    try {
      const text = await recognizeWithTimeout(src, 15000);
      if(text==null){
        statusEl.textContent = 'Status: Timeout';
        solutionEl.textContent = 'Solved: Timeout';
      } else {
        const cleaned = text.replace(/\s+/g,'').trim();
        solutionEl.textContent = 'Solved: ' + (cleaned || text);
        statusEl.textContent = 'Status: Done';
      }
    } catch(e){
      statusEl.textContent = 'Status: Error';
    }
  }

  function generateMockCaptcha(){
    const w=320, h=100;
    const canvas=document.createElement('canvas');
    canvas.width=w; canvas.height=h;
    const ctx=canvas.getContext('2d');
    const g=ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#eef2ff'); g.addColorStop(1,'#e6ffd9');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let text=''; for(let i=0;i<5;i++) text+=chars.charAt(Math.floor(Math.random()*chars.length));
    ctx.font = 'bold 56px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(text, 12, 72);
    // noise lines
    for(let i=0;i<8;i++){
      ctx.strokeStyle='rgba(0,0,0,0.15)';
      ctx.beginPath(); ctx.moveTo(Math.random()*w, Math.random()*h); ctx.lineTo(Math.random()*w, Math.random()*h); ctx.stroke();
    }
    return canvas.toDataURL('image/png');
  }

  function loadAndSolve(url){
    imgEl.src = url;
    urlLabel.textContent = 'URL: ' + url;
    return new Promise((resolve,reject)=>{
      imgEl.onload = async ()=>{
        try{ await solveFromSrc(imgEl.src); } catch(e){ /* ignore */ }
        resolve(); };
      imgEl.onerror = ()=>{ reject(new Error('load-error')); };
    });
  }

  async function init(){
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if(url){
      try{ await loadAndSolve(url); } catch(e){
        // fallback to mock on error
        const mock=generateMockCaptcha(); imgEl.src=mock; urlLabel.textContent='URL: Mock captcha (generated)'; await new Promise(res=>{ imgEl.onload=res; }); await solveFromSrc(imgEl.src);
      }
    } else {
      const mock=generateMockCaptcha(); imgEl.src=mock; urlLabel.textContent='URL: Mock captcha (generated)'; imgEl.onload = async ()=>{ await solveFromSrc(imgEl.src); };
    }
  }

  reloadBtn.addEventListener('click', async ()=>{
    // Regenerate mock or retry with same URL if available
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if(url){
      try{ await loadAndSolve(url); } catch(e){
        const mock=generateMockCaptcha(); imgEl.src=mock; urlLabel.textContent='URL: Mock captcha (generated)'; await new Promise(r=>{ imgEl.onload=r; }); await solveFromSrc(imgEl.src);
      }
    } else {
      const mock=generateMockCaptcha(); imgEl.src=mock; urlLabel.textContent='URL: Mock captcha (generated)'; await new Promise(r=>{ imgEl.onload=r; }); await solveFromSrc(imgEl.src);
    }
  });

  window.addEventListener('load', init);
})();