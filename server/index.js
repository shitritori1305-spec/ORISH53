const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'web')));
// basic admin check: accept X-Admin-Password header or query param
function checkAdmin(req, res, next){
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const provided = (req.headers['x-admin-password'] || req.query.admin_password || '').toString();
  if(provided && provided === adminPass) return next();
  res.set('WWW-Authenticate','Basic realm="Admin"');
  return res.status(401).send('Unauthorized');
}

app.get('/questionnaire', (req, res) => {
  const p = path.join(__dirname, 'questionnaire.json');
  const q = JSON.parse(fs.readFileSync(p, 'utf8'));
  res.json(q);
});

// serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'web', 'index.html'));
});

// protect admin page
app.get('/admin.html', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'web', 'admin.html'));
});

app.post('/answers', (req, res) => {
  const data = req.body || {};
  const id = db.insertAnswer(JSON.stringify(data));
  const plan = generatePlan(data);
  res.json({ id, plan });
});
app.get('/answers', checkAdmin, (req, res) => {
  try {
    const json = db.listAnswers();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'failed to read answers' });
  }
});

// delete single answer by id
app.delete('/answers/:id', checkAdmin, (req, res) => {
  const id = parseInt(req.params.id,10);
  if(Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });
  const ok = db.deleteAnswer(id);
  if(!ok) return res.status(404).json({ error: 'not found' });
  res.json({ ok:true });
});

// clear all answers
app.delete('/answers', checkAdmin, (req, res) => {
  db.clearAnswers();
  res.json({ ok:true });
});

function generatePlan(data) {
  const goal = (data.goal || '').toString();
  const time = data.time || 'גמיש';
  const commitment = data.commitment || '10-15 דקות';
  const name = data.name ? data.name : 'חבר';

  const plans = {
    'להתעורר עם אנרגיה': [
      `להעלות סיכוי להתעוררות: לישון אותו זמן כל לילה (חשוב)` ,
      `ביצוע מתיחות קלות 5 דקות בבוקר` ,
      `להימנע ממסכים חצי שעה לפני השינה`
    ],
    'לשפר שינה': [
      `להכניס רוטינת ערב קבועה — אור נמוך, קריאה 10 דקות` ,
      `לנסות להישאר על אותו זמני השינה והיקיצה` ,
      `להגביל קפאין אחרי הצהריים`
    ],
    'להתמיד בפעילות גופנית': [
      `להתחיל ב־${commitment} פעילות ביום — אפילו הליכה` ,
      `לבחור ימים קבועים (למשל: בוקר ימי שני/חמישי)` ,
      `להשתמש ביעד קטן שניתן להשיג מיד` 
    ],
    'להפחית דחיינות': [
      `לשבור משימות לקטעים של ${commitment}` ,
      `להשתמש בטיימר — 25 דקות עבודה + הפסקה קצרה` ,
      `להגדיר התחלה מדויקת (למשל: 09:00) ולא רק "מחר"`]
    ,
    'לשפר תזונה': [
      `להוסיף מנה ירוקה אחת ביום` ,
      `להכין חטיפים בריאים מראש` ,
      `להחליף משקאות ממותקים במים או תה`
    ]
  };

  const chosen = plans[goal] || [
    `להגדיר מטרה קטנה וברורה`,
    `להקדיש ${commitment} ביום` ,
    `לבדוק התקדמות פעם בשבוע` 
  ];

  return {
    title: `התוכנית האישית של ${name}`,
    summary: `ממוקדת ב: ${goal || 'שיפור כללי'}. מתאימה לזמינות: ${time}, זמני מחויבות: ${commitment}.` ,
    habits: chosen,
    tip: 'התחלה קטנה ויציבות יובילו לתוצאות — נסו לתת לעצמכם שבוע להתאקלם.'
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
