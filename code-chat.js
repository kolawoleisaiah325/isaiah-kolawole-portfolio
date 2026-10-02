'use strict';
(() => {
  const byId = id => document.getElementById(id);
  const input = byId('code-question'), status = byId('code-search-status');
  const stopwords = new Set('a an the and or to of for in on at is are was be been it this that how what which where when why does do can with from about as by you your i me my code function repository file explain return returns use uses used configured'.split(' '));
  const tokens = text => (text.replace(/([a-z])([A-Z])/g,'$1 $2').toLowerCase().replaceAll('_',' ').match(/[a-z][a-z0-9]*/g)||[]).filter(word=>word.length>1&&!stopwords.has(word));
  let chunks = [], documents = [], lengths = [], average = 1;
  // The repository is being made public by its owner. Show a usable source link when available.
  fetch('https://api.github.com/search/repositories?q=user%3Akolawoleisaiah325+github-code-chat+in%3Aname',{credentials:'omit'}).then(response=>response.ok?response.json():null).then(data=>{
    const repo=data?.items?.find(item=>item.full_name==='kolawoleisaiah325/github-code-chat');
    if(repo && repo.private===false) {
      const link=document.createElement('a');link.className='text-link';link.href='https://github.com/kolawoleisaiah325/github-code-chat';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Explore the source ↗';document.querySelector('.case-actions').append(link);
    }
  }).catch(()=>{});
  function search(question) {
    const started = performance.now(), terms = [...new Set(tokens(question))];
    const frequency = new Map(terms.map(term=>[term,documents.filter(doc=>doc.has(term)).length]));
    const ranked = chunks.map((chunk,index)=>{
      let score = 0;
      terms.forEach(term=>{
        const count = documents[index].get(term)||0;
        if(count) score += Math.log(1+(chunks.length-frequency.get(term)+.5)/(frequency.get(term)+.5))*count*2.5/(count+1.5*(.25+.75*lengths[index]/average));
      });
      return {chunk,score};
    }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
    const results = byId('code-search-results'); results.replaceChildren();
    ranked.forEach(({chunk},index)=>{
      const article = document.createElement('article'); article.className = 'code-source';
      const heading = document.createElement('h3'); heading.textContent=`[${index+1}] ${chunk.file_path}`;
      const lines = document.createElement('p'); lines.textContent=`Lines ${chunk.start_line}–${chunk.end_line} · Authored demonstration code`;
      const pre = document.createElement('pre'), code = document.createElement('code'); code.textContent=chunk.text; pre.append(code);
      article.append(heading,lines,pre); results.append(article);
    });
    status.textContent=ranked.length?`${ranked.length} source excerpt${ranked.length===1?'':'s'} found · Keyword search · No LLM used · ${(performance.now()-started).toFixed(1)} ms in this browser`:'No matching source evidence. Try naming a function or feature in the bundled shop.';
  }
  byId('code-search-form').addEventListener('submit',event=>{event.preventDefault();const question=input.value.trim();if(question)search(question);});
  document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.question;search(input.value);}));
  fetch('assets/code-chat-demo.json').then(response=>{if(!response.ok)throw new Error('Unavailable');return response.json();}).then(data=>{
    chunks=data.chunks;
    documents=chunks.map(chunk=>{const doc=new Map();tokens(chunk.file_path+'\n'+chunk.text).forEach(term=>doc.set(term,(doc.get(term)||0)+1));return doc;});
    lengths=documents.map(doc=>[...doc.values()].reduce((sum,count)=>sum+count,0)); average=lengths.reduce((sum,count)=>sum+count,0)/lengths.length||1;
    input.disabled=false;byId('code-search-button').disabled=false;document.querySelectorAll('[data-question]').forEach(button=>button.disabled=false);
    status.textContent='Ready · Five bundled Python files · Keyword search · No model download required';
    data.evaluation.hybrid.cases.forEach(record=>{
      const detail=document.createElement('details'), summary=document.createElement('summary'), text=document.createElement('p'), meta=document.createElement('small');
      summary.textContent=record.question;text.textContent=record.answer.text;meta.textContent=`Recorded local AI output · ${record.answer.status} · ${record.answer.seconds}s generation`;
      detail.append(summary,text,meta);byId('code-recorded-answers')?.append(detail);
    });
    if(byId('code-search-form').hasAttribute('data-autosearch') && input.value.trim()) search(input.value);
  }).catch(()=>{status.textContent='The sample could not be loaded. Please refresh or download the recorded data below.';});
})();
