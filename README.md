# ORISH53 — MVP scaffold

[![CI](https://github.com/shitritori1305-spec/ORISH53/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/shitritori1305-spec/ORISH53/actions/workflows/ci.yml)

מיזם MVP קטן שמכיל שרת Express ושאלון אישי לשימוש כבסיס לאפליקציית הרגלים.

הרכיבים:
- `server/` — Node.js + Express + SQLite (שומר תשובות)
- `web/` — frontend פשוט ב־HTML/JS שמושך את השאלון ושולח תשובות

הרצה מקומית:

1. התקנה והנעה של השרת:

```bash
cd server
npm install
npm start
```


השרת יפעל ברירת מחדל על `http://localhost:3000`.

2. פתיחת ה־frontend:

ה־frontend כבר משרת על ידי השרת — פתחו את `http://localhost:3000` בדפדפן כדי לגשת לאפליקציה.

אם ברצונכם לצפות בתשובות שנשמרו — יש עמוד מנהל ב־`http://localhost:3000/admin.html` שמציג את `server/answers.json` ונותן אופציה להורדה.

Admin protection:
- ברירת מחדל: הסיסמה היא `admin123`.
- לשנות: הגדרו את משתנה הסביבה `ADMIN_PASSWORD` לפני הרצת השרת, לדוגמה:

```bash
ADMIN_PASSWORD=mysupersecret npm start
```

אפשר לאמת בעזרת הכותרת `X-Admin-Password: <password>` או להוסיף `?admin_password=<password>` ל־URL (פחות בטוח).

React / Mobile:
- מדריך קצר ל־React נמצא ב־`web-react/README.md` אם תרצו למזג Vite/React.
- scaffold מינימלי ל־Expo נמצא ב־`mobile/` (השתמשו בכתובת `10.0.2.2` לאמולטורים/אנדרואיד כדי להגיע ל־localhost של המחשב).

הערה: זהו scaffold ראשוני — ניתן לשדרג ל־Postgres ושירותים חיצוניים בעתיד.

Docker ופריסה מקומית:
- להריץ בעזרת Docker Compose:

```bash
docker-compose up --build
```

הסביבה תחשוף את השרת ב־`http://localhost:3000`. ניתן לשנות את סיסמת ה־admin בעזרת משתנה הסביבה `ADMIN_PASSWORD` ב־`docker-compose.yml` או דרך סביבה מקומית.

React (Vite):
- לנסות את ה־frontend ב־React:

```bash
cd web-react
npm install
npm run dev
```

ה־React app יפעל בברירת מחדל על `http://localhost:5173` ויפנה ל־API ב־`http://localhost:3000`.

חידושים ושיפורים:
- השאלון ב־`web/` עכשיו מציג שאלה אחת בכל פעם (stepper), שומר התקדמות ב־`localStorage` ומציג מד־התקדמות.
- הודעות toast, אנימציות קלות ושיפורי נגישות.
- בעמוד הניהול ניתן למחוק תשובות בודדות או את כל הרשומות (מוגן בסיסמה).

טיפים לשימוש:
- בעת ניסוי מקומי — פתח את `http://localhost:3000`, ענה על השאלון, ובדוק את עמוד המנהל לטעימה מהנתונים.
- לשינוי סיסמת מנהל השתמש ב־`ADMIN_PASSWORD` לפני הרצה.
# ORISH53
APP MAKER
