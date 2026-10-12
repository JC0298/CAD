'use strict';
const $ = s => document.querySelector(s);
const KEY = 'inventor-ai-cad-studio-requests-v1';
const pages = document.querySelectorAll('.page');
const MAX_FILE_BYTES = 500 * 1024 * 1024;
function readJobs() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function saveJobs(jobs) { localStorage.setItem(KEY, JSON.stringify(jobs)); }
function showToast(message) { const t = $('#toast'); t.textContent = message; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3400); }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function downloadJson(obj, filename) { const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
function activate(page) { document.querySelectorAll('.nav').forEach(x => x.classList.toggle('active', x.dataset.page === page)); pages.forEach(x => x.classList.toggle('active', x.id === page)); if(page==='jobs') renderJobs(); }
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>activate(b.dataset.page)));
$('#apiStatus').textContent = 'GitHub Pages · Local planning mode';
$('.dot').style.background = '#ffc66d';
function addJob(job) { const jobs=readJobs(); jobs.unshift(job); try { saveJobs(jobs.slice(0,100)); } catch { showToast('Browser storage is unavailable; downloading request instead.'); downloadJson(job,job.id+'.json'); return; } activate('jobs'); showToast('Request saved locally. Export its JSON to run it on a CAD backend.'); }
$('#generateBtn').addEventListener('click',()=>{
 const prompt=$('#prompt').value.trim(); if(!prompt) return showToast('Describe the model you want first.');
 const id='cad-'+Date.now();
 addJob({id,kind:'model request',status:'plan only',title:prompt.slice(0,90),created_at:new Date().toISOString(),specification:{prompt,units:$('#units').value,model_type:$('#modelType').value,material:$('#material').value,drawing_standard:$('#standard').value,outputs:{step:$('#step').checked,inventor:$('#inventor').checked,drawing_pdf:$('#drawing').checked}},note:'No CAD file generated. Connect Inventor Automation to process this request.'});
});
const fileInput=$('#cadFile');
fileInput.addEventListener('change',()=>{if(fileInput.files[0]) $('.drop b').textContent=fileInput.files[0].name;});
$('#analyzeBtn').addEventListener('click',()=>{
 const f=fileInput.files[0]; if(!f) return showToast('Select a STEP, IPT, or IAM file first.');
 if(!/\.(stp|step|ipt|iam)$/i.test(f.name)) return showToast('Unsupported extension. Choose STEP, STP, IPT, or IAM.');
 if(f.size>MAX_FILE_BYTES) return showToast('File exceeds the 500 MB limit for this demo.');
 const id='drawing-'+Date.now();
 addJob({id,kind:'drawing request',status:'plan only',title:f.name,created_at:new Date().toISOString(),source_file:{name:f.name,size_bytes:f.size,last_modified:new Date(f.lastModified).toISOString()},specification:{sheet:$('#sheet').value,dimension_style:$('#dimStyle').value,tolerance_default:$('#tol').value,output:$('#drawingOutput').value,hole_notes:$('#holeNotes').checked,center_marks:$('#centerMarks').checked,gdt_suggestions:$('#gdt').checked},note:'The CAD file stays on your computer. This static page only records file metadata; no geometry has been inspected or drawing generated.'});
});
function renderJobs(){
 const root=$('#jobsTable'); const jobs=readJobs(); root.replaceChildren();
 if(!jobs.length){root.innerHTML='<p class="muted" style="padding:22px 0">No requests saved yet.</p>';return;}
 jobs.forEach(job=>{
   const line=document.createElement('div');line.className='job';
   const name=document.createElement('div');name.className='name';name.textContent=job.title;const small=document.createElement('small');small.textContent=job.id+' · '+new Date(job.created_at).toLocaleString();name.appendChild(small);
   const status=document.createElement('div');const pill=document.createElement('span');pill.className='pill';pill.textContent='Plan only';status.appendChild(pill);
   const kind=document.createElement('div');kind.textContent=job.kind;
   const actions=document.createElement('div');actions.className='downloads';const btn=document.createElement('button');btn.className='secondary';btn.textContent='Download JSON';btn.addEventListener('click',()=>downloadJson(job,job.id+'.json'));actions.appendChild(btn);
   line.append(name,status,kind,actions);root.appendChild(line);
 });
}
$('#refreshJobs').textContent='Clear history';
$('#refreshJobs').addEventListener('click',()=>{if(confirm('Delete all locally saved request history?')){localStorage.removeItem(KEY);renderJobs();showToast('Local request history cleared.');}});
