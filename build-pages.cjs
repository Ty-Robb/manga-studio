const fs=require('node:fs');
(async()=>{
const source=fs.readFileSync('dist/server/index.js','utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
let html=await (await worker.fetch(new Request('https://example.test/'),{})).text();
const storage=`
const networkFetch=window.fetch.bind(window);
function editionDB(){return new Promise((resolve,reject)=>{let r=indexedDB.open('ink-editions',1);r.onupgradeneeded=()=>r.result.createObjectStore('books',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function editionStore(mode,run){let db=await editionDB();try{return await new Promise((resolve,reject)=>{let tx=db.transaction('books',mode),request=run(tx.objectStore('books')),result;request.onsuccess=()=>result=request.result;tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
window.fetch=async(input,options={})=>{if(input!=='/api/books')return networkFetch(input,options);if(options.method==='POST'){let book=JSON.parse(options.body);book.id=crypto.randomUUID();book.date=new Date().toISOString();await editionStore('readwrite',store=>store.put(book));return Response.json({id:book.id})}let books=await editionStore('readonly',store=>store.getAll());return Response.json(books.sort((a,b)=>b.date.localeCompare(a.date)))};
`;
html=html.replace('<script>','<script>'+storage);
html=html.replace('Publish manga</button>','Save edition</button>').replace('Published editions. Open a book to read every page.','Editions saved in this browser. Open a book to read it, or export a reader to share.').replace('Published editions are saved in your site library.','Editions are saved on this device. Export an HTML reader from the Library to share.').replace('Published to your library.','Edition saved to this browser.').replace('Publishing failed. Please try again.','Could not save the edition. Check available device storage.');
html=html.replace('card.append(im,h,p,btn);',`let share=document.createElement('button');share.textContent='Export reader';share.onclick=()=>{let escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');let title=escape(b.title);let content='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>body{margin:0;background:#202126;color:white;font:18px system-ui;text-align:center}img{display:block;width:100%;max-width:800px;margin:20px auto}</style></head><body><h1>'+title+'</h1>'+[b.cover,...b.pages].map(src=>'<img alt="Manga page" src="'+src+'">').join('')+'</body></html>';let url=URL.createObjectURL(new Blob([content],{type:'text/html'}));download(url,'manga-reader.html');setTimeout(()=>URL.revokeObjectURL(url),5000)};card.append(im,h,p,btn,share);`);
fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/index.html',html);fs.writeFileSync('docs/.nojekyll','');console.log('Built GitHub Pages app in docs/');
})().catch(error=>{console.error(error);process.exitCode=1});
