'use strict';
(() => {
  const byId = id => document.getElementById(id);
  const year = byId('demo-year'), area = byId('demo-area'), status = byId('demo-status');
  const format = value => Number(value).toLocaleString('en-GB');
  const percent = (value, total) => total ? (value / total * 100).toFixed(1) + '%' : '—';
  let records = [], filtered = [], shown = [], page = 0;
  const pageSize = 12;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function periodLabel(period) { return months[Number(period.slice(5)) - 1] + ' ' + period.slice(0,4); }
  function followup(record) {
    if (record.reporting_status === 'missing') return 'Request report';
    if (record.reporting_status === 'invalid') return 'Resolve invalid count';
    return record.accepted_doses < record.target_doses * .8 ? 'Review below-target delivery' : 'No flag';
  }
  function inRecordView(record) {
    if (status.value === 'followup') return followup(record) !== 'No flag';
    if (status.value === 'zero') return record.reporting_status === 'accepted' && record.accepted_doses === 0;
    return status.value === 'all' || record.reporting_status === status.value;
  }
  function renderTable() {
    shown = filtered.filter(inRecordView);
    const pageCount = Math.ceil(shown.length / pageSize);
    page = Math.max(0, Math.min(page, pageCount - 1));
    const tbody = byId('demo-record-body'); tbody.replaceChildren();
    shown.slice(page * pageSize, (page + 1) * pageSize).forEach(record => {
      const row = document.createElement('tr');
      const cell = text => { const td = document.createElement('td'); td.textContent = text; row.append(td); return td; };
      const facility = cell(record.facility_name);
      const detail = document.createElement('small'); detail.textContent = record.area; facility.append(detail);
      cell(periodLabel(record.period));
      const statusCell = cell('');
      const badge = document.createElement('span'); badge.className = 'record-status ' + record.reporting_status;
      badge.textContent = record.reporting_status; statusCell.append(badge);
      cell(record.accepted_doses === null ? 'Unknown' : format(record.accepted_doses));
      cell(format(record.target_doses)); cell(followup(record)); tbody.append(row);
    });
    if (!shown.length) {
      const row = document.createElement('tr'), cell = document.createElement('td');
      cell.colSpan = 6; cell.textContent = 'No records match this view. Choose another record view or reset the filters.';
      row.append(cell); tbody.append(row);
    }
    byId('table-count').textContent = `${format(shown.length)} record${shown.length === 1 ? '' : 's'} in this view`;
    byId('page-label').textContent = pageCount ? `Page ${page + 1} of ${pageCount}` : 'No matching records';
    byId('previous-page').disabled = page === 0;
    byId('next-page').disabled = !pageCount || page >= pageCount - 1;
    byId('demo-export').disabled = !shown.length;
  }
  function renderChart() {
    const grouped = new Map();
    filtered.forEach(record => {
      if (!grouped.has(record.period)) grouped.set(record.period,{period:record.period,delivered:0,target:0,accepted:0,expected:0});
      const month = grouped.get(record.period); month.expected++;
      if (record.reporting_status === 'accepted') {
        month.delivered += record.accepted_doses; month.target += record.target_doses; month.accepted++;
      }
    });
    const series = [...grouped.values()].sort((a,b)=>a.period.localeCompare(b.period));
    const chart = byId('demo-chart');
    const width = Math.max(300, Math.round(chart.getBoundingClientRect().width));
    chart.setAttribute('viewBox', `0 0 ${width} 290`);
    const ns = 'http://www.w3.org/2000/svg';
    const element = (name,attrs,text) => { const node = document.createElementNS(ns,name); Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value))); if(text!==undefined) node.textContent=text; chart.append(node); return node; };
    chart.replaceChildren();
    element('title',{id:'chart-title'},'Monthly delivered doses and comparable targets');
    const incomplete = series.filter(month=>month.accepted<month.expected).length;
    element('desc',{id:'chart-description'},`${series.length} months. ${incomplete} have incomplete reporting. The table provides the underlying records.`);
    const maxValue = Math.max(1,...series.map(month=>Math.max(month.delivered,month.target))) * 1.12;
    const x = index => 55 + index / Math.max(series.length - 1,1) * (width - 85);
    const y = value => 235 - value / maxValue * 205;
    for (let tick=0;tick<=4;tick++) {
      const value = maxValue * tick / 4, position = y(value);
      element('line',{x1:55,y1:position,x2:width-30,y2:position,stroke:'#dfe7eb','stroke-width':1});
      element('text',{x:45,y:position+4,'text-anchor':'end',fill:'#526575','font-size':12},format(Math.round(value)));
    }
    ['target','delivered'].forEach(key => {
      let segment = '';
      series.forEach((month,index)=>{ if(!month.accepted){ segment=''; return; } const point=`${x(index)},${y(month[key])}`; if(segment) element('line',{x1:x(index-1),y1:y(series[index-1][key]),x2:x(index),y2:y(month[key]),stroke:key==='delivered'?'#087f8c':'#8a9ba7','stroke-width':key==='delivered'?2.5:1.5,...(key==='target'?{'stroke-dasharray':'5 5'}:{})}); segment=point; });
    });
    series.forEach((month,index)=>{
      if(month.accepted) {
        const point = element('circle',{cx:x(index),cy:y(month.delivered),r:month.accepted<month.expected?5:3,fill:month.accepted<month.expected?'#b27a20':'#087f8c'});
        const title = document.createElementNS(ns,'title'); title.textContent=`${periodLabel(month.period)}: ${format(month.delivered)} delivered; ${format(month.target)} comparable target; ${month.accepted}/${month.expected} accepted reports`; point.append(title);
      }
      const tickStep = Math.max(1,Math.ceil(series.length/(width<600?3:6)));
      if(index===0 || index===series.length-1 || (index % tickStep===0 && series.length-1-index>=tickStep)) element('text',{x:x(index),y:267,'text-anchor':index===series.length-1?'end':'middle',fill:'#526575','font-size':12},periodLabel(month.period));
    });
  }
  function render() {
    filtered = records.filter(record=>(year.value==='all'||record.period.startsWith(year.value))&&(area.value==='all'||record.area===area.value));
    const accepted = filtered.filter(record=>record.reporting_status==='accepted');
    const submitted = filtered.filter(record=>record.submission_count>0).length;
    const delivered = accepted.reduce((sum,record)=>sum+record.accepted_doses,0);
    const target = accepted.reduce((sum,record)=>sum+record.target_doses,0);
    byId('metric-completeness').textContent=percent(submitted,filtered.length);
    byId('metric-completeness-note').textContent=`${submitted} / ${filtered.length} submitted facility-months`;
    byId('metric-accepted').textContent=format(accepted.length);
    byId('metric-accepted-note').textContent=`${filtered.length-accepted.length} missing or invalid`;
    byId('metric-delivered').textContent=accepted.length?format(delivered):'Unknown';
    byId('metric-achievement').textContent=percent(delivered,target);
    const facilityCount = new Set(filtered.map(record=>record.facility_id)).size;
    byId('demo-scope').textContent=`${year.options[year.selectedIndex].text} · ${area.options[area.selectedIndex].text} · ${facilityCount} facilities · ${filtered.length} expected facility-months`;
    renderChart(); renderTable();
  }
  [year,area].forEach(control=>control.addEventListener('change',()=>{page=0;render();}));
  let resizeFrame;
  window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(filtered.length)renderChart();});});
  status.addEventListener('change',()=>{page=0;renderTable();});
  byId('demo-reset').addEventListener('click',()=>{year.value='all';area.value='all';status.value='all';page=0;render();});
  byId('previous-page').addEventListener('click',()=>{page--;renderTable();});
  byId('next-page').addEventListener('click',()=>{page++;renderTable();});
  byId('demo-export').addEventListener('click',()=>{
    const columns=['data_label','facility_id','facility_name','area','period','reporting_status','accepted_doses','target_doses','follow_up'];
    const escape = value => '"'+String(value??'').replaceAll('"','""')+'"';
    const lines=[columns.join(','),...shown.map(record=>columns.map(column=>escape(column==='data_label'?'synthetic demonstration data':column==='follow_up'?followup(record):record[column])).join(','))];
    const url=URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download=`synthetic-health-${year.value}-${area.value==='all'?'all-areas':area.value.replaceAll(' ','-')}-${status.value}.csv`;anchor.hidden=true;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  fetch('assets/demo-data.json').then(response=>{if(!response.ok)throw new Error('Data unavailable');return response.json();}).then(data=>{
    records=data.records.sort((a,b)=>b.period.localeCompare(a.period)||a.facility_id.localeCompare(b.facility_id));
    [...new Set(records.map(record=>record.area))].sort().forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value;area.append(option);});
    const names={seasonal_naive:'Seasonal naive',ridge_trend_seasonal:'Ridge trend + seasonality',holt_winters:'Holt-Winters'};
    Object.entries(data.diagnostics.candidate_scores).forEach(([model,score])=>{
      const row=document.createElement('tr');if(model===data.diagnostics.selected_model)row.className='best-model';
      [names[model],score.mae.toFixed(2),score.wape_percent.toFixed(2)+'%'].forEach((value,index)=>{const cell=document.createElement(index?'td':'th');if(!index)cell.scope='row';cell.textContent=value;row.append(cell);});byId('demo-model-body').append(row);
    });
    [year,area,status,byId('demo-reset')].forEach(control=>control.disabled=false);render();
  }).catch(()=>{byId('demo-error').hidden=false;byId('demo-scope').textContent='Demo data unavailable.';});
})();
