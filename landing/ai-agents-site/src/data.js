const BASE = import.meta.env.BASE_URL
export const IMG = (name) => `${BASE}img/${name}.webp`
export const VID = (name) => `${BASE}video/${name}.mp4`
export const LOGO = (name) => `${BASE}logos/${name}.webp`

export const PHONE = '*3068'
export const PRIVACY_URL = 'https://limudey-hutz.co.il/%d7%9e%d7%93%d7%99%d7%a0%d7%99%d7%95%d7%aa-%d7%a4%d7%a8%d7%98%d7%99%d7%95%d7%aa/'
export const TERMS_URL = 'https://limudey-hutz.co.il/%d7%aa%d7%a7%d7%a0%d7%95%d7%9f-%d7%90%d7%aa%d7%a8/'

export const NAV_LINKS = [
  { label: 'על הקורס', href: '#about' },
  { label: 'סילבוס', href: '#syllabus' },
  { label: 'פרויקטים', href: '#projects' },
  { label: 'תעודות', href: '#certificates' },
  { label: 'מימון', href: '#funding' },
  { label: 'שאלות', href: '#faq' },
]

// All copy below comes from the course page on limudey-hutz.co.il.
// The course in numbers. All figures are from the course page.
export const STATS = [
  ['160', 'שעות אקדמיות'],
  ['12', 'מודולים'],
  ['8', 'פרויקטים מעשיים'],
  ['90%', 'עד, מימון בתוכנית השוברים למתאימים'],
  ['80%+', 'השמה בחממת התעסוקה שמובילה היחידה'],
]

// Who stands behind the certificate. [logo file, organisation, what it means for the student]
export const RECOGNITION = [
  ['labor', 'משרד העבודה', 'תעודת הסמכה ממשלתית'],
  ['elta', 'אלתא מערכות', 'תעודת בוגר מטעם מפעל הסייבר של אלתא'],
  ['taasuka', 'שירות התעסוקה', 'היחידה מובילה את חממת התעסוקה'],
]

export const AUDIENCE = [
  'אנשי שיווק ומכירות',
  'פרילנסרים שרוצים להתמחות בהטמעת AI בארגונים',
  'יועצים עסקיים',
  'בעלי עסקים',
]

export const ADMISSION = [
  'ראיון אישי או ייעוץ להכוונה מקצועית',
  'יכולת בסיסית בעבודת מחשב',
  'היכרות עם אנגלית ברמה בסיסית',
]

export const CAPABILITIES = [
  { title: 'עובדים דיגיטליים וסוכנים חכמים', en: 'AI Agents', text: 'סוכנים עצמאיים שמבינים משימות, מנתחים מידע, מפעילים כלים חיצוניים ומקבלים החלטות באופן אוטומטי.' },
  { title: 'חיבור לידע הארגוני', en: 'RAG · Knowledge Base', text: 'סוכנים שמחוברים בבטחה למסמכים, לבסיסי נתונים ול-Vector Databases, למענה מדויק ומבוסס עובדות.' },
  { title: 'בקרה, איכות וניטור', en: 'Evals & Monitoring', text: 'ניטור בזמן אמת, בדיקות דיוק ל-AI, מניעת הזיות ואבטחת מידע ארגונית.' },
  { title: 'אינטגרציה מקצה לקצה', en: 'End-to-End Integrations', text: 'חיבור מלא בין ה-CRM, הדיוור, הטפסים והתפעול. עובדים עם ChatGPT, Claude, Gemini, Make ו-n8n.' },
]

export const PROJECTS = [
  ["צ'אטבוט ו-AI Agent לשירות לקוחות ושיווק", 'מענה חכם, תיעדוף פניות וחיבור לידע ארגוני.', 'Support Agent'],
  ['מערכת לניהול לידים ושיווק דיגיטלי', 'סיווג חכם, העשרת נתונים וחיבור ל-CRM.', 'Lead Gen Agent'],
  ['אוטומציה לתהליכי מכירה ושירות', 'ניתוח נתונים והמלצות פעולה מבוססות AI.', 'Sales Automation'],
  ['אוטומציה לניהול משאבי אנוש', 'קליטת עובדים, טיפול בפניות ותהליכי Onboarding.', 'HR Onboarding'],
  ['אוטומציה לדוחות וניתוח נתונים פיננסיים', 'סיכום חכם, זיהוי חריגות ותובנות ניהוליות.', 'Finance Reporting'],
  ['מערכת לניהול ותזמון משימות פנים-ארגוניות', 'Workflows ו-Agents חכמים לביצוע משימות.', 'Task Orchestration'],
  ['אוטומציה לשיפור חווית לקוח', 'ניתוח פידבקים והמלצות לשיפור תהליכים.', 'CX Insights'],
  ['פרויקט גמר', 'פתרון AI עסקי מלא: אפיון בעיה אמיתית, ארכיטקטורה, יישום ודמו מקצועי.', 'Capstone Project'],
]

// The 12 modules are from the syllabus. Grouping them into three stages is ours, for readability.
export const PHASES = [
  {
    tab: 'יסודות', en: 'Foundations', img: 'm-learn', alt: 'הסוכן לומד שיעור אונליין עם אוזניות',
    modules: [
      ['מבוא לעולם הפתרונות הדיגיטליים ו-NoCode', 'מה זה פתרון דיגיטלי, למה עסקים צריכים אוטומציה, ואיך בונים מערכות חכמות בלי קוד כבד.', 'No-Code Fundamentals'],
      ['אפיון תהליכים ופתרונות דיגיטליים', 'מזהים מה העסק באמת צריך, והופכים תהליך עמום לתוכנית ברורה שאפשר לבנות עליה.', 'Process Design'],
      ['הנדסת פרומפטים ועבודה עם מודלי שפה גדולים', 'ניסוח בקשות מדויקות ל-Gemini, ChatGPT ו-Claude, לתוצאה טובה, שימושית ועקבית.', 'Prompt Engineering · LLMs'],
      ['בניית יישומים ודפי נחיתה', 'מרעיון לממשק, אפליקציה או דף נחיתה שנראים מקצועיים ועובדים טוב.', 'Apps & Landing Pages'],
    ],
  },
  {
    tab: 'דאטה ואוטומציה', en: 'Data & Automation', img: 'm-build', alt: 'הסוכן מחבר קוביות צבעוניות בכבלים',
    modules: [
      ['יצירת תוכן ומחקר נתונים באמצעות AI', 'תוכן שיווקי ותפעולי, מחקר נתונים, דוחות BI ולוחות בקרה.', 'AI Content & Research'],
      ['מחקר וניתוח נתונים באמצעות כלי AI', 'ניתוח, זיהוי דפוסים והפקת תובנות שאפשר לפעול לפיהן.', 'AI Data Analysis · BI'],
      ['בניית תרחישי אוטומציה ב-Make וב-n8n', 'מחברים כלים, טריגרים ותהליכים שרצים מאחורי הקלעים בלי התערבות ידנית.', 'Workflows · Make · n8n'],
      ["שילוב סוכן AI או צ'אטבוט בתהליך אוטומטי", 'AI שמגיב, מנתח ומקבל החלטות בסיסיות, עם API ו-JSON להעברת מידע בין מערכות.', 'AI Agents · API · JSON'],
      ['חיבור מערכות עסקיות חיצוניות', 'CRM, דיוור, טפסים וניהול מדברים אחד עם השני, בלי כפילויות ובלי עבודה כפולה.', 'CRM & Integrations'],
    ],
  },
  {
    tab: 'הטמעה ופרויקט גמר', en: 'Deploy & Capstone', img: 'm-work', alt: 'הסוכן עובד מול מחשב נייד על זרימת עבודה',
    modules: [
      ['Data Validation ואבטחת מידע בסיסית', 'נתונים תקינים ומאובטחים: פרטיות, הרשאות, בדיקות קלט ועבודה בטוחה עם מידע.', 'Data Validation · Security'],
      ['היכרות עם פלטפורמות מתקדמות, Vibe Coding', 'סביבת פיתוח מהירה: מנסים רעיונות, בונים מהר ומשפרים תוך כדי תנועה.', 'Vibe Coding'],
      ['פרויקט גמר', 'מוצר אמיתי שמחבר אפיון, תוכן, דאטה, אוטומציה וממשק, ומוצג בדמו מקצועי.', 'Capstone Project'],
    ],
  },
]

export const ROLES = [
  ['מומחה אוטומציה ו-AI', 'AI Automation Specialist'],
  ['אדריכל יישומים דיגיטליים', 'Digital Solutions Architect'],
  ['מנהל פרויקטים טכנולוגיים', 'Technical Project Manager'],
  ['מומחה אינטגרציה', 'Integration Specialist'],
  ['יועץ עצמאי ל-AI ואוטומציה', 'Freelance AI Consultant'],
  ['מוביל חדשנות AI', 'AI Innovation Lead'],
  ['מומחה הדרכה והטמעה', 'AI Enablement Trainer'],
]

export const CERTS = [
  ['תעודת הסמכה ממשלתית', 'פיתוח פתרונות דיגיטליים לפרויקטים עסקיים, No-Code & AI.'],
  ['תעודת בוגר Agents and Automation', 'מטעם היחידה ללימודי חוץ ומפעל הסייבר של אלתא מערכות.'],
]

export const LOGOS = [
  ['yechida', 'היחידה ללימודי חוץ'], ['elta', 'אלתא מערכות'], ['iai', 'התעשייה האווירית'], ['tame', 'TAME Range'], ['eccouncil', 'EC-Council'],
  ['edx', 'edX'], ['labor', 'משרד העבודה'], ['taasuka', 'שירות התעסוקה'], ['otzar', 'משרד האוצר'], ['kalkala', 'משרד הכלכלה והתעשייה'],
]

export const TRACKS = [
  { id: 'פיקדון חיילים משוחררים', name: 'חיילים משוחררים', value: 'פיקדון', text: 'הקורס מוכר לשימוש בכספי הפיקדון.' },
  { id: 'תוכנית השוברים', name: 'תוכנית השוברים', value: 'עד 90%', text: 'מימון למתאימים, בכפוף לתנאי התוכנית.' },
  { id: 'מילואימניקים', name: 'משרתי מילואים', value: 'מילואים', text: 'בודקים יחד בשיחת הייעוץ את ההטבות שמגיעות לכם.' },
]

export const FAQS = [
  ['איך בנויה התוכנית?', '160 שעות אקדמיות של למידה עיונית, מעשית ועבודה על פרויקט גמר. הלימודים אונליין בפיקוח, מכל מקום בארץ.'],
  ['מה נדרש כדי לקבל את התעודות?', 'נוכחות של 80% לפחות מהשיעורים, ביצוע תרגולים ומטלות שוטפות, ועמידה במבחנים ובפרויקטי הסיום.'],
  ['אילו כלים לומדים?', 'מודלי שפה כמו Gemini, ChatGPT ו-Claude, פלטפורמות האוטומציה Make ו-n8n, עבודה עם API ו-JSON, חיבור ל-CRM ולמערכות דיוור, כלי BI וסביבות Vibe Coding.'],
  ['איך בודקים זכאות לפיקדון או לשוברים?', 'משאירים פרטים בטופס. בשיחת הייעוץ בודקים יחד את המסלול המתאים לכם.'],
]
