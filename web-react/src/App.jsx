import React, { useEffect, useState } from 'react'

export default function App(){
  const [q, setQ] = useState(null)
  const [form, setForm] = useState({})
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    fetch('http://localhost:3000/questionnaire')
      .then(r=>r.json())
      .then(setQ)
      .catch(()=>setQ({title:'שגיאה', intro:'לא ניתן לטעון שאלון'}))
  },[])

  function handleChange(e){
    setForm(prev=>({...prev,[e.target.name]: e.target.value}))
  }

  async function handleSubmit(){
    const required = ['goal','time','commitment']
    for(const k of required) if(!form[k]) return alert('אנא מלא/י את כל השאלות הנדרשות')
    setLoading(true)
    try{
      const res = await fetch('http://localhost:3000/answers', {
        method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)
      })
      const j = await res.json();
      setPlan(j.plan)
    }catch(e){ alert('שגיאה בשליחה'); console.error(e) }
    setLoading(false)
  }

  if(!q) return <div style={{padding:20}}>טוען...</div>

  return (
    <div style={{maxWidth:720,margin:'20px auto',padding:20}}>
      <h1>{q.title}</h1>
      <p>{q.intro}</p>
      <div style={{background:'#fff',padding:16,borderRadius:8}}>
        {q.questions.map(qi=> (
          <div key={qi.id} style={{marginBottom:12}}>
            <label style={{display:'block',fontWeight:600,marginBottom:6}}>{qi.label}</label>
            {qi.type==='text' ? (
              <input name={qi.id} onChange={handleChange} style={{width:'100%',padding:8}} />
            ) : (
              <select name={qi.id} onChange={handleChange} style={{width:'100%',padding:8}}>
                <option value="">בחר...</option>
                {qi.options.map(o=> <option key={o} value={o}>{o}</option>)}
              </select>
            )}
          </div>
        ))}
        <div style={{display:'flex',gap:8}}>
          <button onClick={handleSubmit} disabled={loading}>{loading? 'שולח...' : 'שלח וקבל תוכנית'}</button>
          <a href="/admin-login.html" style={{marginLeft:12}}>כניסת מנהל</a>
        </div>
      </div>
      {plan && (
        <div style={{marginTop:16,background:'#fff',padding:16,borderRadius:8}}>
          <h2>{plan.title}</h2>
          <p>{plan.summary}</p>
          <ul>{plan.habits.map((h,i)=><li key={i}>{h}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
