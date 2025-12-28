async function loadAnswers(){
  const container = document.getElementById('list');
  container.textContent = 'טוען...';
  try{
    const res = await fetch('/answers');
    const data = await res.json();
    if(!data.length) { container.innerHTML = '<p>אין תשובות עדיין</p>'; return; }
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>id</th><th>timestamp</th><th>data</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.slice().reverse().forEach(row=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.id}</td><td>${row.timestamp}</td><td><pre>${JSON.stringify(row.data, null, 2)}</pre></td>`;
      const del = document.createElement('button');
      del.textContent = 'מחק';
      del.addEventListener('click', async ()=>{
        if(!confirm('למחוק תשובה זו?')) return;
        const res = await fetch('/answers/' + row.id, { method: 'DELETE', headers: { 'X-Admin-Password': prompt('הכנס סיסמת מנהל כדי לאשר') || '' } });
        if(res.ok){ loadAnswers(); } else { alert('שגיאה במחיקה'); }
      });
      const td = document.createElement('td'); td.appendChild(del); tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
  }catch(e){ container.textContent = 'שגיאה בטעינת תשובות'; console.error(e); }
}

document.getElementById('refresh').addEventListener('click', loadAnswers);
document.getElementById('download').addEventListener('click', async ()=>{
  const res = await fetch('/answers');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'answers.json'; document.body.appendChild(a); a.click(); a.remove();
});

loadAnswers();

// clear all
const clearBtn = document.createElement('button'); clearBtn.textContent='מחק הכל';
clearBtn.addEventListener('click', async ()=>{
  if(!confirm('למחוק את כל התשובות?')) return;
  const pass = prompt('הכנס סיסמת מנהל כדי לאשר') || '';
  const res = await fetch('/answers', { method:'DELETE', headers: { 'X-Admin-Password': pass } });
  if(res.ok) loadAnswers(); else alert('שגיאה בהסרה');
});
document.querySelector('.controls').appendChild(clearBtn);
