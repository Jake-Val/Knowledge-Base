async function fetchJSON(url){const r=await fetch(url); if(!r.ok) throw new Error(r.status); return r.json();}
function el(tag, cls, text){const e=document.createElement(tag); if(cls) e.className=cls; if(text) e.textContent=text; return e;}

function renderTree(node, parentUl){
  (node.children||[]).forEach(child=>{
    const li = document.createElement('li');
    if (child.type==='dir'){
      const wrapper = el('div','folder');
      const chev = el('span','chev','▾');
      const name = el('span','name',child.name);
      wrapper.appendChild(chev); wrapper.appendChild(name);
      li.appendChild(wrapper);
      const sub = document.createElement('ul'); li.appendChild(sub);
      wrapper.addEventListener('click',()=>{ li.classList.toggle('closed'); });
      renderTree(child, sub);
    } else {
      const link = el('div','file');
      link.appendChild(el('span','dot','•'));
      link.appendChild(el('span','name',child.name));
      link.addEventListener('click',()=>loadFile(child.path));
      li.appendChild(link);
    }
    parentUl.appendChild(li);
  });
}

async function load() {
  const tree = await fetchJSON('manifest.json');
  const wrap = document.getElementById('tree'); wrap.innerHTML='';
  const ul = document.createElement('ul'); wrap.appendChild(ul);
  renderTree(tree, ul);
}
async function loadFile(path){
  const v = document.getElementById('viewer'); v.innerHTML = `<p class="muted">Loading <code>${path}</code>…</p>`;
  try{
    const r = await fetch(path); const t = await r.text();
    v.innerHTML = `<h2>${path.split('/').pop()}</h2>
      <p><a class="raw" href="${path}" target="_blank" rel="noopener">Open raw file</a></p>
      <pre>${escapeHtml(t)}</pre>`;
  } catch(err){
    v.innerHTML = `<p style="color:#ff7a7a">Failed to load ${path}: ${err}</p>`;
  }
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));}
load();
