import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, X, Clock, ChevronLeft, ChevronRight,
  BookOpen, CalendarDays, Sparkles, Image as ImageIcon,
  Trash2, Edit3, Check, Search, AlertTriangle, BarChart2,
  ChevronDown, ChevronUp
} from "lucide-react";

// ─────────────────────────────────────
// Constants
// ─────────────────────────────────────
const BABY_NAME = "이솔이";
const BABY_BIRTH = "2025-05-30";

const MEAL_TYPES = [
  { key: "breakfast",      label: "아침",         emoji: "🌅", daycareOwned: false },
  { key: "morningSnack",   label: "오전간식",     emoji: "🍪", daycareOwned: true  },
  { key: "lunch",          label: "점심(어린이집)",emoji: "🍱", daycareOwned: true  },
  { key: "afternoonSnack", label: "오후간식",     emoji: "🥐", daycareOwned: true  },
  { key: "afterCare",      label: "하원 후",      emoji: "🧀", daycareOwned: false },
  { key: "dinner",         label: "저녁",         emoji: "🌙", daycareOwned: false },
];
const mealTypeMap = Object.fromEntries(MEAL_TYPES.map(m => [m.key, m]));

const EAT_LEVELS = [
  { key: "refused", label: "거부",   emoji: "😖", color: "#E8927C" },
  { key: "little",  label: "조금",   emoji: "😕", color: "#EFB88A" },
  { key: "half",    label: "반정도", emoji: "🙂", color: "#E8C468" },
  { key: "good",    label: "잘먹음", emoji: "😋", color: "#9CB380" },
  { key: "all",     label: "다먹음", emoji: "🤩", color: "#7DA77A" },
];
const eatLevelMap = Object.fromEntries(EAT_LEVELS.map(l => [l.key, l]));

const CATEGORY_TAGS = ["밥류","면류","국/찌개","반찬","고기","생선","채소","과일","유제품","간식/빵"];

// ─────────────────────────────────────
// 6월 어린이집 식단 (자동 입력용)
// ─────────────────────────────────────
const DAYCARE_JUNE = {
  "2026-06-01": { morningSnack:{items:["동태살청경채죽"]}, lunch:{items:["차조밥","애호박전국","소고기닭돼지볶음","새송이버섯나물","백김치"]}, afternoonSnack:{items:["찐 감자","우유"]} },
  "2026-06-02": { morningSnack:{items:["배추당근죽"]}, lunch:{items:["쌀밥","미소장국","닭살레몬버터구이","건파래자반","백김치"]}, afternoonSnack:{items:["토마토스파게티","우유"]} },
  "2026-06-04": { morningSnack:{items:["소고기비트죽"]}, lunch:{items:["쌀밥","연두부맑은국","돼지고기볶음","무나물","백김치"]}, afternoonSnack:{items:["카스테라","우유"]} },
  "2026-06-05": { morningSnack:{items:["닭살밥죽"]}, lunch:{items:["기장밥","얼갈이국","생강소스닭가슴살","연근조림","백김치"]}, afternoonSnack:{items:["블루베리","우유"]} },
  "2026-06-08": { morningSnack:{items:["순두부추죽"]}, lunch:{items:["쌀밥","배추된장국","닭살간장조림","시금치무침","어린이깍두기"]}, afternoonSnack:{items:["파인애플","우유"]} },
  "2026-06-09": { morningSnack:{items:["달걀브로콜리죽"]}, lunch:{items:["쌀밥","콩나물실파국","소고기양파볶음","오이무침","백김치"]}, afternoonSnack:{items:["치즈죽억볼","우유"]} },
  "2026-06-10": { morningSnack:{items:["호박죽"]}, lunch:{items:["새우살덮밥","유부장국","미트소스가지조림","백김치"]}, afternoonSnack:{items:["바나나","우유"]} },
  "2026-06-11": { morningSnack:{items:["채소죽"]}, lunch:{items:["쌀밥","사골국","삼색달걀찜","잔멸치조림","백김치"]}, afternoonSnack:{items:["크로와상","우유"]} },
  "2026-06-12": { morningSnack:{items:["전복죽"]}, lunch:{items:["쌀밥","감자국","동그랑땡구이","애호박나물","백김치"]}, afternoonSnack:{items:["토마토","우유"]} },
  "2026-06-15": { morningSnack:{items:["영양닭죽"]}, lunch:{items:["쌀밥","어묵국","마파두부","열무나물","백김치"]}, afternoonSnack:{items:["자른포도","우유"]} },
  "2026-06-16": { morningSnack:{items:["바나나오트밀죽"]}, lunch:{items:["쌀밥","근대된장국","돼지고기잡채","참나물무침","백김치"]}, afternoonSnack:{items:["삶은달걀","우유"]} },
  "2026-06-17": { morningSnack:{items:["두부김죽"]}, lunch:{items:["소고기가지볶음밥","부추달걀국","단호박범벅","백김치"]}, afternoonSnack:{items:["사과","우유"]} },
  "2026-06-18": { morningSnack:{items:["소고기양파죽"]}, lunch:{items:["쌀밥","황태미역국","닭살채소볶음","콩나물무침","백김치"]}, afternoonSnack:{items:["모닝빵","우유"]} },
  "2026-06-19": { morningSnack:{items:["새우살당근죽"]}, lunch:{items:["기장밥","수제비국","떡갈비피망조림","양배추나물","무절임"]}, afternoonSnack:{items:["오렌지","우유"]} },
  "2026-06-20": { morningSnack:{items:["우엉참쌀죽"]}, lunch:{items:["잔치국수","쌀밥(소)","김말이튀김","백김치"]}, afternoonSnack:{items:["우유"]} },
  "2026-06-22": { morningSnack:{items:["잔멸치무죽"]}, lunch:{items:["쌀밥","열무된장국","돼지불고기","감자채볶음","백김치"]}, afternoonSnack:{items:["키위","우유"]} },
  "2026-06-23": { morningSnack:{items:["들깨버섯죽"]}, lunch:{items:["쌀밥","소고기탕국","버섯잡채볶음","채소순전","단배추나물","무절임"]}, afternoonSnack:{items:["블루베리","우유"]} },
  "2026-06-24": { morningSnack:{items:["닭살시금치죽"]}, lunch:{items:["카레라이스","미니우동국","채소순전","백김치"]}, afternoonSnack:{items:["멜론","우유"]} },
  "2026-06-25": { morningSnack:{items:["누룽지미역죽"]}, lunch:{items:["쌀밥","만두국","두부구이","숙주당근무침","백김치"]}, afternoonSnack:{items:["머핀","우유"]} },
  "2026-06-26": { morningSnack:{items:["소고기참깨죽"]}, lunch:{items:["쌀밥","복어국","안동찜닭","오이나물","열무김치"]}, afternoonSnack:{items:["수박","우유"]} },
  "2026-06-29": { morningSnack:{items:["노른자참나물죽"]}, lunch:{items:["쌀밥","들깨미역국","소고기배추찜","가지나물","무절임"]}, afternoonSnack:{items:["바나나","우유"]} },
  "2026-06-30": { morningSnack:{items:["채소죽"]}, lunch:{items:["쌀밥","닭개장","가자미구이","브로콜리숙회","백김치"]}, afternoonSnack:{items:["유부초밥","우유"]} },
};

// ─────────────────────────────────────
// Helpers
// ─────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function pad2(n) { return String(n).padStart(2,"0"); }
function toLocalDateStr(d) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function todayStr() { return toLocalDateStr(new Date()); }
function formatDateLabel(ds) {
  const d = new Date(ds+"T00:00:00");
  return `${d.getMonth()+1}월 ${d.getDate()}일 (${"일월화수목금토"[d.getDay()]})`;
}
function ageLabel(ds) {
  const birth = new Date(BABY_BIRTH+"T00:00:00");
  const target = new Date(ds+"T00:00:00");
  let months = (target.getFullYear()-birth.getFullYear())*12+(target.getMonth()-birth.getMonth());
  if (target.getDate()<birth.getDate()) months--;
  const days = Math.floor((target-birth)/86400000);
  return { months, days };
}
function getWeekRange(ds) {
  const d = new Date(ds+"T00:00:00");
  const dow = d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate()-(dow===0?6:dow-1));
  const fri = new Date(mon); fri.setDate(mon.getDate()+4);
  return { mon: toLocalDateStr(mon), fri: toLocalDateStr(fri) };
}
function datesBetween(from, to) {
  const arr=[], cur=new Date(from+"T00:00:00"), end=new Date(to+"T00:00:00");
  while(cur<=end){ arr.push(toLocalDateStr(cur)); cur.setDate(cur.getDate()+1); }
  return arr;
}

// ─────────────────────────────────────
// Storage
// ─────────────────────────────────────
async function loadKey(key, fallback) {
  try { const r=await window.storage.get(key,false); return r?.value ? JSON.parse(r.value) : fallback; }
  catch { return fallback; }
}
async function saveKey(key, val) {
  try { await window.storage.set(key, JSON.stringify(val), false); } catch(e){console.error(e);}
}

// ─────────────────────────────────────
// App
// ─────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("log");
  const [logs, setLogs] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [allergens, setAllergens] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState(null);
  const [recipeEditing, setRecipeEditing] = useState(null);
  const [recipeDetail, setRecipeDetail] = useState(null);
  const [weekView, setWeekView] = useState(false);

  useEffect(() => {
    (async () => {
      const [l, r, a] = await Promise.all([
        loadKey("logs_v2", {}),
        loadKey("recipes_v2", []),
        loadKey("allergens_v1", []),
      ]);
      // Auto-inject daycare meals into logs if not already there
      const merged = { ...l };
      for (const [date, meals] of Object.entries(DAYCARE_JUNE)) {
        if (!merged[date]) merged[date] = {};
        for (const [mealKey, data] of Object.entries(meals)) {
          if (!merged[date][mealKey]) {
            merged[date][mealKey] = { ...data, eatLevel: "", memo: "", daycareAuto: true };
          }
        }
      }
      setLogs(merged);
      setRecipes(r);
      setAllergens(a);
      setLoading(false);
    })();
  }, []);

  const persistLogs = useCallback((nl) => { setLogs(nl); saveKey("logs_v2", nl); }, []);
  const persistRecipes = useCallback((nr) => { setRecipes(nr); saveKey("recipes_v2", nr); }, []);
  const persistAllergens = useCallback((na) => { setAllergens(na); saveKey("allergens_v1", na); }, []);

  if (loading) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,gap:10,fontFamily:FB}}>
      <div style={{fontSize:40}}>🥣</div>
      <div style={{color:C.cocoa,fontSize:14}}>불러오는 중...</div>
    </div>
  );

  return (
    <div style={{fontFamily:FB,background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:84,color:C.cocoa}}>
      <style>{CSS}</style>
      <Header selectedDate={selectedDate} />
      <div style={{padding:"14px 16px 8px"}}>
        {tab==="log" && (
          <LogView
            logs={logs} persistLogs={persistLogs} selectedDate={selectedDate}
            setSelectedDate={setSelectedDate} setEditingEntry={setEditingEntry}
            allergens={allergens} weekView={weekView} setWeekView={setWeekView}
          />
        )}
        {tab==="recipes" && (
          <RecipeListView recipes={recipes} persistRecipes={persistRecipes}
            setRecipeEditing={setRecipeEditing} setRecipeDetail={setRecipeDetail} filterTried={true} />
        )}
        {tab==="challenges" && (
          <RecipeListView recipes={recipes} persistRecipes={persistRecipes}
            setRecipeEditing={setRecipeEditing} setRecipeDetail={setRecipeDetail} filterTried={false} />
        )}
        {tab==="search" && (
          <SearchView logs={logs} recipes={recipes} setRecipeDetail={setRecipeDetail}
            setSelectedDate={(d)=>{setSelectedDate(d);setTab("log");}} />
        )}
        {tab==="allergens" && (
          <AllergenView allergens={allergens} persistAllergens={persistAllergens} logs={logs} />
        )}
      </div>
      {(tab==="recipes"||tab==="challenges") && (
        <button onClick={()=>setRecipeEditing("new")} style={ST.fab} aria-label="새 레시피 추가">
          <Plus size={22} color="#fff" strokeWidth={2.6}/>
        </button>
      )}
      <BottomNav tab={tab} setTab={setTab} />

      {editingEntry && <EntryModal editingEntry={editingEntry} onClose={()=>setEditingEntry(null)}
        logs={logs} persistLogs={persistLogs} selectedDate={selectedDate}
        recipes={recipes} persistRecipes={persistRecipes} allergens={allergens} />}
      {recipeEditing && <RecipeEditModal recipe={recipeEditing==="new"?null:recipeEditing}
        onClose={()=>setRecipeEditing(null)} recipes={recipes} persistRecipes={persistRecipes} />}
      {recipeDetail && <RecipeDetailModal recipe={recipes.find(r=>r.id===recipeDetail)}
        onClose={()=>setRecipeDetail(null)}
        onEdit={r=>{setRecipeDetail(null);setRecipeEditing(r);}}
        onDelete={id=>{persistRecipes(recipes.filter(r=>r.id!==id));setRecipeDetail(null);}} />}
    </div>
  );
}

// ─────────────────────────────────────
// Header
// ─────────────────────────────────────
function Header({ selectedDate }) {
  const { months, days } = ageLabel(selectedDate);
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
      padding:"20px 18px 14px",background:`linear-gradient(135deg,${C.peach} 0%,${C.bg} 100%)`,
      borderBottom:`1px solid ${C.line}`}}>
      <div>
        <div style={{fontFamily:FD,fontSize:22,fontWeight:700,color:C.cocoa,letterSpacing:"0.01em"}}>
          {BABY_NAME}의 밥상일기
        </div>
        <div style={{fontSize:12,color:C.cocoaLight,marginTop:4}}>
          생후 {months}개월 · 총 {days}일째 🌱
        </div>
      </div>
      <div style={{fontSize:12,background:C.sage,color:"#5E6B4A",padding:"6px 10px",
        borderRadius:999,fontWeight:600,whiteSpace:"nowrap"}}>유아식</div>
    </div>
  );
}

// ─────────────────────────────────────
// BottomNav
// ─────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const items = [
    { key:"log",       label:"기록",    Icon:CalendarDays },
    { key:"recipes",   label:"레시피북", Icon:BookOpen },
    { key:"challenges",label:"도전목록", Icon:Sparkles },
    { key:"search",    label:"검색",    Icon:Search },
    { key:"allergens", label:"주의식품", Icon:AlertTriangle },
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",
      maxWidth:480,background:"#fff",borderTop:`1px solid ${C.line}`,display:"flex",
      justifyContent:"space-around",alignItems:"center",
      padding:"8px 0 calc(8px + env(safe-area-inset-bottom))",zIndex:40}}>
      {items.map(({key,label,Icon})=>{
        const active=tab===key;
        return (
          <button key={key} onClick={()=>setTab(key)} style={{background:"transparent",border:"none",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",flex:1,
            padding:"4px 0",color:active?C.coral:C.cocoaLight}}>
            <Icon size={19} strokeWidth={active?2.4:2}/>
            <span style={{fontSize:10,fontWeight:active?700:500}}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────
// LogView
// ─────────────────────────────────────
function LogView({ logs, persistLogs, selectedDate, setSelectedDate, setEditingEntry, allergens, weekView, setWeekView }) {
  const changeDate = (delta) => {
    const d = new Date(selectedDate+"T00:00:00");
    d.setDate(d.getDate()+delta);
    setSelectedDate(toLocalDateStr(d));
  };

  return (
    <div>
      {/* Date bar */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <button onClick={()=>changeDate(-1)} style={ST.dateArrow}><ChevronLeft size={20} color={C.cocoa}/></button>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontFamily:FD,fontSize:17,fontWeight:700}}>{formatDateLabel(selectedDate)}</div>
          <div style={{display:"flex",gap:6}}>
            {selectedDate!==todayStr() && (
              <button onClick={()=>setSelectedDate(todayStr())} style={{fontSize:11,color:C.coral,background:"transparent",border:"none",cursor:"pointer",fontWeight:600,padding:0}}>오늘로</button>
            )}
            <button onClick={()=>setWeekView(!weekView)} style={{fontSize:11,color:C.cocoaLight,background:"transparent",border:`1px solid ${C.line}`,borderRadius:999,cursor:"pointer",padding:"2px 8px"}}>
              {weekView?"일별보기":"주간보기"}
            </button>
          </div>
        </div>
        <button onClick={()=>changeDate(1)} disabled={selectedDate>=todayStr()} style={{...ST.dateArrow,opacity:selectedDate>=todayStr()?0.35:1}}>
          <ChevronRight size={20} color={C.cocoa}/>
        </button>
      </div>

      {weekView
        ? <WeekSummary logs={logs} selectedDate={selectedDate} setSelectedDate={(d)=>{setSelectedDate(d);setWeekView(false);}}/>
        : <DayView logs={logs} persistLogs={persistLogs} selectedDate={selectedDate}
            setEditingEntry={setEditingEntry} allergens={allergens}/>
      }
    </div>
  );
}

// ─────────────────────────────────────
// WeekSummary
// ─────────────────────────────────────
function WeekSummary({ logs, selectedDate, setSelectedDate }) {
  const { mon, fri } = getWeekRange(selectedDate);
  const dates = datesBetween(mon, fri).filter(d=>new Date(d+"T00:00:00").getDay()!==0&&new Date(d+"T00:00:00").getDay()!==6);

  // collect eat level counts across the week
  const levelCounts = { refused:0, little:0, half:0, good:0, all:0 };
  const allFoods = {};
  dates.forEach(d => {
    const dayLog = logs[d] || {};
    MEAL_TYPES.forEach(m => {
      const e = dayLog[m.key];
      if (e?.eatLevel) levelCounts[e.eatLevel]=(levelCounts[e.eatLevel]||0)+1;
      (e?.items||[]).forEach(f => {
        if (f!=="백김치"&&f!=="우유"&&f!=="쌀밥") allFoods[f]=(allFoods[f]||0)+1;
      });
    });
  });

  const topFoods = Object.entries(allFoods).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const totalLogged = dates.reduce((sum,d)=>{
    const dayLog=logs[d]||{};
    return sum+MEAL_TYPES.filter(m=>dayLog[m.key]?.eatLevel).length;
  },0);

  return (
    <div style={{marginTop:12}}>
      <div style={{fontSize:12,color:C.cocoaLight,marginBottom:10,textAlign:"center"}}>
        {formatDateLabel(mon)} ~ {formatDateLabel(fri)}
      </div>

      {/* Eat level bar */}
      <div style={{background:"#fff",borderRadius:16,padding:"14px 16px",border:`1px solid ${C.line}`,marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:10}}>📊 이번 주 식사 반응</div>
        {totalLogged===0
          ? <div style={{fontSize:12,color:C.cocoaLight,textAlign:"center",padding:"8px 0"}}>기록된 반응이 없어요</div>
          : EAT_LEVELS.map(lv=>{
            const count=levelCounts[lv.key]||0;
            const pct=totalLogged>0?Math.round(count/totalLogged*100):0;
            return (
              <div key={lv.key} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:52,fontSize:12,color:C.cocoa}}>{lv.emoji} {lv.label}</div>
                <div style={{flex:1,height:10,background:C.line,borderRadius:999,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:lv.color,borderRadius:999,transition:"width .4s"}}/>
                </div>
                <div style={{width:28,fontSize:11,color:C.cocoaLight,textAlign:"right"}}>{count}회</div>
              </div>
            );
          })
        }
      </div>

      {/* Top foods */}
      {topFoods.length>0 && (
        <div style={{background:"#fff",borderRadius:16,padding:"14px 16px",border:`1px solid ${C.line}`,marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>🍽️ 이번 주 자주 먹은 음식</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {topFoods.map(([food,cnt])=>(
              <span key={food} style={{fontSize:12,background:C.peach,color:"#A0593F",padding:"4px 10px",borderRadius:10}}>
                {food} <span style={{opacity:.6,fontSize:10}}>×{cnt}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Per-day mini cards */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {dates.map(d=>{
          const dayLog=logs[d]||{};
          const filled=MEAL_TYPES.filter(m=>dayLog[m.key]?.eatLevel).length;
          const total=MEAL_TYPES.length;
          const dow="일월화수목금토"[new Date(d+"T00:00:00").getDay()];
          const dateNum=new Date(d+"T00:00:00").getDate();
          return (
            <button key={d} onClick={()=>setSelectedDate(d)}
              style={{background:"#fff",border:`1px solid ${d===selectedDate?C.coral:C.line}`,
                borderRadius:14,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,
                cursor:"pointer",textAlign:"left",width:"100%"}}>
              <div style={{width:36,textAlign:"center"}}>
                <div style={{fontSize:11,color:C.cocoaLight}}>{dow}</div>
                <div style={{fontSize:16,fontWeight:700,color:d===selectedDate?C.coral:C.cocoa}}>{dateNum}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {MEAL_TYPES.map(m=>{
                    const e=dayLog[m.key];
                    const lv=e?.eatLevel?eatLevelMap[e.eatLevel]:null;
                    return (
                      <span key={m.key} title={m.label} style={{fontSize:13,
                        opacity:e?1:0.25}}>
                        {lv?lv.emoji:m.emoji}
                      </span>
                    );
                  })}
                </div>
                {filled>0 && <div style={{fontSize:11,color:C.cocoaLight,marginTop:2}}>{filled}개 식사 반응 기록됨</div>}
              </div>
              <ChevronRight size={14} color={C.cocoaLight}/>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// DayView
// ─────────────────────────────────────
function DayView({ logs, persistLogs, selectedDate, setEditingEntry, allergens }) {
  const dayLog = logs[selectedDate] || {};
  const filled = MEAL_TYPES.filter(m=>dayLog[m.key]?.eatLevel).length;

  const deleteEntry = (mealKey) => {
    const newDay = { ...dayLog };
    delete newDay[mealKey];
    persistLogs({ ...logs, [selectedDate]: newDay });
  };

  // daycare auto-fill today if exists
  const todayDaycare = DAYCARE_JUNE[selectedDate];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 2px 12px"}}>
        <div style={{flex:1,height:6,background:C.line,borderRadius:999,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(filled/MEAL_TYPES.length)*100}%`,
            background:`linear-gradient(90deg,${C.honey},${C.coral})`,borderRadius:999,transition:"width .3s"}}/>
        </div>
        <span style={{fontSize:11,color:C.cocoaLight,whiteSpace:"nowrap"}}>{filled}/{MEAL_TYPES.length} 반응 기록</span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {MEAL_TYPES.map(meal=>(
          <MealCard key={meal.key} meal={meal} entry={dayLog[meal.key]}
            onAdd={()=>setEditingEntry({mealKey:meal.key,entry:null,date:selectedDate})}
            onEdit={()=>setEditingEntry({mealKey:meal.key,entry:dayLog[meal.key],date:selectedDate})}
            onDelete={()=>deleteEntry(meal.key)}
            allergens={allergens}/>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// MealCard
// ─────────────────────────────────────
function MealCard({ meal, entry, onAdd, onEdit, onDelete, allergens }) {
  const level = entry?.eatLevel ? eatLevelMap[entry.eatLevel] : null;
  const flagged = (entry?.items||[]).filter(f=>allergens?.includes(f));
  const isDaycare = meal.daycareOwned;
  const hasItems = entry?.items?.length>0;

  if (!hasItems) {
    return (
      <button onClick={onAdd} style={{display:"flex",alignItems:"center",gap:10,
        background:"#fff",border:`1.5px dashed ${isDaycare?"#C9D6B4":C.line}`,
        borderRadius:16,padding:"14px 16px",cursor:"pointer",width:"100%",textAlign:"left"}}>
        <span style={{fontSize:18}}>{meal.emoji}</span>
        <span style={{flex:1,fontSize:14,color:isDaycare?"#7A9060":C.cocoaLight,fontWeight:500}}>{meal.label}</span>
        <span style={{fontSize:12,color:isDaycare?"#7A9060":C.coral,fontWeight:600,display:"flex",alignItems:"center",gap:2}}>
          <Plus size={14}/> {isDaycare?"식단 입력":"기록 추가"}
        </span>
      </button>
    );
  }

  return (
    <div style={{background:"#fff",border:`1px solid ${level?eatLevelMap[entry.eatLevel].color+"44":C.line}`,
      borderRadius:16,padding:"14px 16px",boxShadow:"0 1px 3px rgba(92,74,58,0.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>{meal.emoji}</span>
          <span style={{fontSize:14,fontWeight:700}}>{meal.label}</span>
          {entry.time && (
            <span style={{fontSize:11,color:C.cocoaLight,background:C.bg,padding:"2px 8px",borderRadius:999,display:"flex",alignItems:"center",gap:2}}>
              <Clock size={11}/>{entry.time}
            </span>
          )}
          {entry.daycareAuto && !entry.eatLevel && (
            <span style={{fontSize:10,background:"#E8EDD9",color:"#5E6B4A",padding:"2px 6px",borderRadius:999,fontWeight:600}}>어린이집</span>
          )}
        </div>
        <div style={{display:"flex",gap:4}}>
          <button onClick={onEdit} style={ST.iconBtn}><Edit3 size={14} color={C.cocoaLight}/></button>
          <button onClick={onDelete} style={ST.iconBtn}><Trash2 size={14} color={C.cocoaLight}/></button>
        </div>
      </div>

      {flagged.length>0 && (
        <div style={{background:"#FFF3F0",border:"1px solid #F3D6CC",borderRadius:10,padding:"6px 10px",marginBottom:8,fontSize:12,color:"#C0654E"}}>
          ⚠️ 주의 식재료 포함: {flagged.join(", ")}
        </div>
      )}

      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:entry.eatLevel||entry.memo?10:0}}>
        {(entry.items||[]).map((item,i)=>(
          <span key={i} style={{fontSize:12.5,background:C.peach,color:"#A0593F",padding:"4px 10px",borderRadius:10,fontWeight:500}}>
            {item}
          </span>
        ))}
      </div>

      {(entry.eatLevel||entry.memo) && (
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          {level && (
            <span style={{fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:999,border:"1px solid",
              background:level.color+"26",color:level.color,borderColor:level.color+"55"}}>
              {level.emoji} {level.label}
            </span>
          )}
          {!entry.eatLevel && (
            <button onClick={onEdit} style={{fontSize:12,color:C.coral,background:"transparent",border:`1px dashed ${C.coral}`,
              borderRadius:999,padding:"3px 10px",cursor:"pointer",fontWeight:600}}>
              반응 기록하기 →
            </button>
          )}
          {entry.memo && <span style={{fontSize:12,color:C.cocoaLight,fontStyle:"italic",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{entry.memo}"</span>}
        </div>
      )}
      {!entry.eatLevel && !entry.memo && (
        <button onClick={onEdit} style={{fontSize:12,color:C.coral,background:"transparent",border:`1px dashed ${C.coral}`,
          borderRadius:999,padding:"3px 10px",cursor:"pointer",fontWeight:600,marginTop:2}}>
          반응 기록하기 →
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// EntryModal
// ─────────────────────────────────────
function EntryModal({ editingEntry, onClose, logs, persistLogs, selectedDate, recipes, persistRecipes, allergens }) {
  const { mealKey, entry } = editingEntry;
  const meal = mealTypeMap[mealKey];
  const [time, setTime] = useState(entry?.time||"");
  const [itemsText, setItemsText] = useState((entry?.items||[]).join(", "));
  const [eatLevel, setEatLevel] = useState(entry?.eatLevel||"");
  const [memo, setMemo] = useState(entry?.memo||"");
  const [saveAsRecipe, setSaveAsRecipe] = useState(false);

  const flagged = itemsText.split(/[,\n]/).map(s=>s.trim()).filter(f=>allergens?.includes(f));

  const save = () => {
    const items = itemsText.split(/[,\n]/).map(s=>s.trim()).filter(Boolean);
    const newEntry = { time, items, eatLevel, memo, daycareAuto: entry?.daycareAuto||false };
    const dayLog = { ...(logs[selectedDate]||{}) };
    dayLog[mealKey] = newEntry;
    persistLogs({ ...logs, [selectedDate]: dayLog });
    if (saveAsRecipe && items.length>0 && eatLevel) {
      const nr = [...recipes];
      items.forEach(food=>{
        const ex=nr.find(r=>r.title.trim()===food.trim());
        if(ex){ ex.reaction=eatLevel; ex.lastTriedDate=selectedDate; ex.tried=true; }
        else { nr.push({id:uid(),title:food,tags:[],ingredients:"",steps:"",reaction:eatLevel,memo,image:null,tried:true,lastTriedDate:selectedDate}); }
      });
      persistRecipes(nr);
    }
    onClose();
  };

  return (
    <ModalShell onClose={onClose} title={`${meal.emoji} ${meal.label} 기록`}>
      <div style={ST.fg}>
        <label style={ST.fl}>시간</label>
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} style={ST.input}/>
      </div>
      <div style={ST.fg}>
        <label style={ST.fl}>메뉴 (쉼표로 구분)</label>
        <textarea value={itemsText} onChange={e=>setItemsText(e.target.value)}
          placeholder="예: 소고기무국, 잡곡밥, 계란찜"
          style={{...ST.input,minHeight:60,resize:"vertical"}}/>
      </div>
      {flagged.length>0 && (
        <div style={{background:"#FFF3F0",border:"1px solid #F3D6CC",borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#C0654E"}}>
          ⚠️ 주의 식재료가 포함되어 있어요: {flagged.join(", ")}
        </div>
      )}
      <div style={ST.fg}>
        <label style={ST.fl}>먹은 양</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
          {EAT_LEVELS.map(lv=>(
            <button key={lv.key} onClick={()=>setEatLevel(eatLevel===lv.key?"":lv.key)}
              style={{border:"1.5px solid",borderRadius:12,padding:"8px 4px",cursor:"pointer",textAlign:"center",
                background:eatLevel===lv.key?lv.color+"30":"#FBF6EE",
                borderColor:eatLevel===lv.key?lv.color:"#EBE2D3",
                fontWeight:eatLevel===lv.key?700:500}}>
              <div style={{fontSize:18}}>{lv.emoji}</div>
              <div style={{fontSize:11,color:C.cocoa}}>{lv.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={ST.fg}>
        <label style={ST.fl}>메모</label>
        <input type="text" value={memo} onChange={e=>setMemo(e.target.value)}
          placeholder="아기 반응, 특이사항..." style={ST.input}/>
      </div>
      <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer"}}>
        <input type="checkbox" checked={saveAsRecipe} onChange={e=>setSaveAsRecipe(e.target.checked)}
          style={{width:16,height:16,accentColor:C.coral}}/>
        <span style={{fontSize:13,color:C.cocoa}}>레시피북에도 기록하기</span>
      </label>
      <button onClick={save} style={ST.primaryBtn}>저장하기</button>
    </ModalShell>
  );
}

// ─────────────────────────────────────
// RecipeListView
// ─────────────────────────────────────
function RecipeListView({ recipes, persistRecipes, setRecipeEditing, setRecipeDetail, filterTried }) {
  const [tagFilter, setTagFilter] = useState(null);
  let list = recipes.filter(r=>!!r.tried===filterTried);
  if(tagFilter) list=list.filter(r=>(r.tags||[]).includes(tagFilter));
  list = filterTried
    ? [...list].sort((a,b)=>(b.lastTriedDate||"").localeCompare(a.lastTriedDate||""))
    : [...list].sort((a,b)=>a.title.localeCompare(b.title,"ko"));
  const tagCounts={};
  recipes.filter(r=>!!r.tried===filterTried).forEach(r=>(r.tags||[]).forEach(t=>tagCounts[t]=(tagCounts[t]||0)+1));

  return (
    <div>
      <div style={{marginBottom:12,paddingTop:4}}>
        <div style={{fontFamily:FD,fontSize:19,fontWeight:700}}>{filterTried?"📖 우리 아기 레시피북":"✨ 도전해볼 메뉴"}</div>
        <div style={{fontSize:12.5,color:C.cocoaLight,marginTop:3}}>
          {filterTried?"잘 먹었던 음식들을 모아두는 공간이에요.":"아직 시도해보지 않은 메뉴 아이디어를 적어두세요."}
        </div>
      </div>
      {Object.keys(tagCounts).length>0 && (
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:6}}>
          {[["전체",null],...Object.entries(tagCounts)].map(([tag,cnt])=>(
            <button key={tag} onClick={()=>setTagFilter(cnt===null?null:tag)}
              style={{fontSize:12,padding:"6px 12px",borderRadius:999,border:`1px solid ${C.line}`,
                background:tagFilter===(cnt===null?null:tag)?C.cocoa:"#fff",
                color:tagFilter===(cnt===null?null:tag)?"#fff":C.cocoaLight,
                whiteSpace:"nowrap",cursor:"pointer",fontWeight:500}}>
              {tag}{cnt&&` ${cnt}`}
            </button>
          ))}
        </div>
      )}
      {list.length===0 ? (
        <div style={{textAlign:"center",padding:"40px 16px",background:"#fff",borderRadius:18,border:`1px dashed ${C.line}`}}>
          <div style={{fontSize:36,marginBottom:8}}>{filterTried?"🍽️":"💡"}</div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>{filterTried?"저장된 레시피가 없어요":"도전 목록이 비어있어요"}</div>
          <div style={{fontSize:12.5,color:C.cocoaLight,lineHeight:1.6,marginBottom:16}}>
            {filterTried?"식사 기록 시 '레시피북에 기록하기'를 체크하거나,\n아래 + 버튼으로 직접 추가하세요.":"+ 버튼으로 시도해보고 싶은 메뉴를 적어두세요."}
          </div>
          <button onClick={()=>setRecipeEditing("new")} style={{...ST.primaryBtn,width:"auto",padding:"10px 20px",display:"inline-flex",gap:6}}>
            <Plus size={16}/> 새 레시피 추가
          </button>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {list.map(r=>(
            <button key={r.id} onClick={()=>setRecipeDetail(r.id)}
              style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:16,padding:10,cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:6}}>
              <div style={{position:"relative",width:"100%",height:90,borderRadius:12,overflow:"hidden",background:C.bg}}>
                {r.image
                  ? <img src={r.image} alt={r.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:C.peach}}>
                      <ImageIcon size={22} color="#D9CFC2"/>
                    </div>
                }
                {r.tried&&r.reaction&&(
                  <span style={{position:"absolute",top:6,right:6,fontSize:13,borderRadius:999,width:24,height:24,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:eatLevelMap[r.reaction]?.color,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>
                    {eatLevelMap[r.reaction]?.emoji}
                  </span>
                )}
              </div>
              <div style={{fontSize:13.5,fontWeight:700,color:C.cocoa,lineHeight:1.3}}>{r.title}</div>
              {r.tags?.length>0&&(
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {r.tags.slice(0,2).map(t=>(
                    <span key={t} style={{fontSize:10.5,background:C.sage,color:"#5E6B4A",padding:"2px 7px",borderRadius:999,fontWeight:600}}>{t}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// RecipeDetailModal
// ─────────────────────────────────────
function RecipeDetailModal({ recipe, onClose, onEdit, onDelete }) {
  if (!recipe) return null;
  const level = recipe.tried&&recipe.reaction ? eatLevelMap[recipe.reaction] : null;
  return (
    <ModalShell onClose={onClose} title={recipe.title}>
      {recipe.image&&<img src={recipe.image} alt={recipe.title} style={{width:"100%",borderRadius:14,marginBottom:12,maxHeight:200,objectFit:"cover"}}/>}
      {level&&(
        <div style={{fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:999,border:"1px solid",
          background:level.color+"26",color:level.color,borderColor:level.color+"55",
          display:"inline-flex",marginBottom:12,gap:6,alignItems:"center"}}>
          {level.emoji} {level.label}
          {recipe.lastTriedDate&&<span style={{opacity:.7,fontWeight:400}}>({formatDateLabel(recipe.lastTriedDate)})</span>}
        </div>
      )}
      {recipe.tags?.length>0&&(
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {recipe.tags.map(t=><span key={t} style={{fontSize:10.5,background:C.sage,color:"#5E6B4A",padding:"2px 7px",borderRadius:999,fontWeight:600}}>{t}</span>)}
        </div>
      )}
      {recipe.ingredients&&<DS title="🥕 재료" content={recipe.ingredients}/>}
      {recipe.steps&&<DS title="🍳 조리법" content={recipe.steps}/>}
      {recipe.memo&&<DS title="📝 아기 반응 / 메모" content={recipe.memo}/>}
      {!recipe.ingredients&&!recipe.steps&&!recipe.memo&&(
        <div style={{color:C.cocoaLight,fontSize:13,marginBottom:12}}>수정 버튼을 눌러 재료와 조리법을 추가해보세요.</div>
      )}
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button onClick={()=>onEdit(recipe)} style={{flex:1,background:"#fff",color:C.cocoa,border:`1px solid ${C.line}`,borderRadius:14,padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <Edit3 size={15}/> 수정
        </button>
        <button onClick={()=>{if(confirm(`'${recipe.title}'을 삭제할까요?`))onDelete(recipe.id);}}
          style={{flex:1,background:"#FBEAE6",color:"#C0654E",border:"1px solid #F3D6CC",borderRadius:14,padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <Trash2 size={15}/> 삭제
        </button>
      </div>
    </ModalShell>
  );
}
function DS({title,content}){
  return (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{title}</div>
      <div style={{fontSize:13.5,color:C.cocoa,lineHeight:1.7,whiteSpace:"pre-wrap",background:"#fff",border:`1px solid ${C.line}`,borderRadius:12,padding:"10px 12px"}}>{content}</div>
    </div>
  );
}

// ─────────────────────────────────────
// RecipeEditModal
// ─────────────────────────────────────
function RecipeEditModal({ recipe, onClose, recipes, persistRecipes }) {
  const isNew=!recipe;
  const [title,setTitle]=useState(recipe?.title||"");
  const [tags,setTags]=useState(recipe?.tags||[]);
  const [ingredients,setIngredients]=useState(recipe?.ingredients||"");
  const [steps,setSteps]=useState(recipe?.steps||"");
  const [memo,setMemo]=useState(recipe?.memo||"");
  const [reaction,setReaction]=useState(recipe?.reaction||"");
  const [tried,setTried]=useState(recipe?.tried??false);
  const [image,setImage]=useState(recipe?.image||null);

  const toggleTag=t=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);

  const handleImg=e=>{
    const f=e.target.files?.[0]; if(!f)return;
    if(f.size>1.5*1024*1024){alert("1.5MB 이하 사진을 선택해주세요.");return;}
    const r=new FileReader(); r.onload=()=>setImage(r.result); r.readAsDataURL(f);
  };

  const save=()=>{
    if(!title.trim()){alert("음식 이름을 입력해주세요.");return;}
    const data={id:recipe?.id||uid(),title:title.trim(),tags,ingredients,steps,memo,
      reaction:tried?reaction||"good":"",tried,
      lastTriedDate:tried?recipe?.lastTriedDate||todayStr():null,image};
    persistRecipes(isNew?[...recipes,data]:recipes.map(r=>r.id===data.id?data:r));
    onClose();
  };

  return (
    <ModalShell onClose={onClose} title={isNew?"새 레시피 추가":"레시피 수정"}>
      <div style={ST.fg}><label style={ST.fl}>음식 이름</label>
        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="예: 소고기 채소죽" style={ST.input}/>
      </div>
      <div style={ST.fg}><label style={ST.fl}>분류 태그</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {CATEGORY_TAGS.map(t=>(
            <button key={t} onClick={()=>toggleTag(t)} style={{fontSize:12.5,padding:"6px 12px",borderRadius:999,
              border:`1px solid ${tags.includes(t)?"#C9D6B4":C.line}`,cursor:"pointer",
              background:tags.includes(t)?C.sage:"#fff",color:tags.includes(t)?"#5E6B4A":C.cocoaLight,fontWeight:tags.includes(t)?700:500}}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={ST.fg}><label style={ST.fl}>사진</label>
        {image
          ? <div style={{position:"relative",marginBottom:8}}>
              <img src={image} alt="" style={{width:"100%",borderRadius:12,maxHeight:160,objectFit:"cover"}}/>
              <button onClick={()=>setImage(null)} style={{position:"absolute",top:8,right:8,background:"rgba(92,74,58,.6)",border:"none",borderRadius:999,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <X size={14} color="#fff"/>
              </button>
            </div>
          : <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,border:`1.5px dashed ${C.line}`,borderRadius:12,padding:"16px 0",cursor:"pointer",background:"#fff"}}>
              <ImageIcon size={18} color={C.cocoaLight}/><span style={{fontSize:13,color:C.cocoaLight}}>사진 추가하기</span>
              <input type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
            </label>
        }
      </div>
      <div style={ST.fg}><label style={ST.fl}>재료</label>
        <textarea value={ingredients} onChange={e=>setIngredients(e.target.value)}
          placeholder="예: 쇠고기 30g, 애호박 20g, 쌀 30g, 육수 200ml"
          style={{...ST.input,minHeight:60,resize:"vertical"}}/>
      </div>
      <div style={ST.fg}><label style={ST.fl}>조리법</label>
        <textarea value={steps} onChange={e=>setSteps(e.target.value)}
          placeholder={"1. 쇠고기 핏물 빼고 다지기\n2. 채소 잘게 썰기\n3. 끓이기"}
          style={{...ST.input,minHeight:80,resize:"vertical"}}/>
      </div>
      <div style={ST.fg}>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <input type="checkbox" checked={tried} onChange={e=>setTried(e.target.checked)}
            style={{width:16,height:16,accentColor:C.coral}}/>
          <span style={{fontSize:13}}>이미 먹어봤어요 (레시피북 등록)</span>
        </label>
      </div>
      {tried&&(
        <div style={ST.fg}><label style={ST.fl}>아기 반응</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
            {EAT_LEVELS.map(lv=>(
              <button key={lv.key} onClick={()=>setReaction(reaction===lv.key?"":lv.key)}
                style={{border:"1.5px solid",borderRadius:12,padding:"8px 4px",cursor:"pointer",textAlign:"center",
                  background:reaction===lv.key?lv.color+"30":"#FBF6EE",borderColor:reaction===lv.key?lv.color:"#EBE2D3"}}>
                <div style={{fontSize:18}}>{lv.emoji}</div>
                <div style={{fontSize:11}}>{lv.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={ST.fg}><label style={ST.fl}>메모</label>
        <textarea value={memo} onChange={e=>setMemo(e.target.value)}
          placeholder="아기가 좋아했던 포인트나 다음 팁을 적어보세요"
          style={{...ST.input,minHeight:50,resize:"vertical"}}/>
      </div>
      <button onClick={save} style={ST.primaryBtn}><Check size={16} style={{marginRight:4}}/>저장하기</button>
    </ModalShell>
  );
}

// ─────────────────────────────────────
// SearchView
// ─────────────────────────────────────
function SearchView({ logs, recipes, setRecipeDetail, setSelectedDate }) {
  const [q, setQ] = useState("");
  if (!q.trim()) return (
    <div>
      <div style={{fontFamily:FD,fontSize:19,fontWeight:700,marginBottom:4}}>🔍 검색</div>
      <div style={{fontSize:12.5,color:C.cocoaLight,marginBottom:14}}>음식 이름으로 날짜 기록과 레시피를 찾아보세요.</div>
      <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="예: 소고기죽, 감자, 카레..."
        style={{...ST.input,fontSize:15,padding:"12px 14px"}}/>
    </div>
  );

  const keyword = q.trim().toLowerCase();

  // search in logs
  const logResults = [];
  for (const [date, dayLog] of Object.entries(logs)) {
    for (const meal of MEAL_TYPES) {
      const entry = dayLog[meal.key];
      if (!entry?.items) continue;
      const matched = entry.items.filter(f=>f.toLowerCase().includes(keyword));
      if (matched.length>0) logResults.push({ date, meal, entry, matched });
    }
  }
  logResults.sort((a,b)=>b.date.localeCompare(a.date));

  // search in recipes
  const recipeResults = recipes.filter(r=>r.title.toLowerCase().includes(keyword)||
    r.ingredients?.toLowerCase().includes(keyword)||r.tags?.some(t=>t.toLowerCase().includes(keyword)));

  return (
    <div>
      <div style={{fontFamily:FD,fontSize:19,fontWeight:700,marginBottom:4}}>🔍 검색</div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="음식 이름 검색..."
        style={{...ST.input,fontSize:15,padding:"12px 14px",marginBottom:14}}/>

      {logResults.length===0&&recipeResults.length===0 && (
        <div style={{textAlign:"center",padding:"30px 0",color:C.cocoaLight,fontSize:13}}>검색 결과가 없어요</div>
      )}

      {logResults.length>0 && (
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.cocoaLight,marginBottom:8}}>📅 식사 기록 {logResults.length}건</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {logResults.slice(0,10).map((r,i)=>{
              const lv=r.entry.eatLevel?eatLevelMap[r.entry.eatLevel]:null;
              return (
                <button key={i} onClick={()=>setSelectedDate(r.date)}
                  style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:14,padding:"12px 14px",cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{fontSize:20}}>{r.meal.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:C.cocoaLight,marginBottom:2}}>{formatDateLabel(r.date)} · {r.meal.label}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {(r.entry.items||[]).map((f,j)=>(
                        <span key={j} style={{fontSize:12,background:r.matched.includes(f)?C.peach:"#F5F0EA",color:r.matched.includes(f)?"#A0593F":C.cocoaLight,padding:"2px 8px",borderRadius:8,fontWeight:r.matched.includes(f)?700:400}}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  {lv&&<span style={{fontSize:16}}>{lv.emoji}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {recipeResults.length>0 && (
        <div>
          <div style={{fontSize:12,fontWeight:700,color:C.cocoaLight,marginBottom:8}}>📖 레시피 {recipeResults.length}건</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {recipeResults.map(r=>{
              const lv=r.reaction?eatLevelMap[r.reaction]:null;
              return (
                <button key={r.id} onClick={()=>setRecipeDetail(r.id)}
                  style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:14,padding:"12px 14px",cursor:"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"center"}}>
                  {r.image
                    ? <img src={r.image} alt="" style={{width:44,height:44,borderRadius:10,objectFit:"cover"}}/>
                    : <div style={{width:44,height:44,borderRadius:10,background:C.peach,display:"flex",alignItems:"center",justifyContent:"center"}}>🍽️</div>
                  }
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.cocoa}}>{r.title}</div>
                    {r.tags?.length>0&&<div style={{fontSize:11,color:C.cocoaLight,marginTop:2}}>{r.tags.join(" · ")}</div>}
                  </div>
                  {lv&&<span style={{fontSize:16}}>{lv.emoji}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// AllergenView
// ─────────────────────────────────────
function AllergenView({ allergens, persistAllergens, logs }) {
  const [newItem, setNewItem] = useState("");
  const PRESET = ["땅콩","견과류","달걀","우유","밀","대두","새우","게","조개","생선","복숭아","토마토","키위"];

  // find dates where allergens appeared
  const allergenHistory = {};
  for (const al of allergens) {
    allergenHistory[al] = [];
    for (const [date, dayLog] of Object.entries(logs)) {
      for (const m of MEAL_TYPES) {
        const e = dayLog[m.key];
        if (e?.items?.some(f=>f.includes(al))) {
          allergenHistory[al].push({ date, meal:m, eatLevel:e.eatLevel });
        }
      }
    }
    allergenHistory[al].sort((a,b)=>b.date.localeCompare(a.date));
  }

  const add = () => {
    const v=newItem.trim();
    if(!v||allergens.includes(v))return;
    persistAllergens([...allergens,v]);
    setNewItem("");
  };

  return (
    <div>
      <div style={{fontFamily:FD,fontSize:19,fontWeight:700,marginBottom:4}}>⚠️ 주의 식재료</div>
      <div style={{fontSize:12.5,color:C.cocoaLight,marginBottom:14,lineHeight:1.6}}>
        알러지나 주의가 필요한 식재료를 등록하면, 식사 기록 시 자동으로 경고를 보여줘요.
      </div>

      {/* Preset tags */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.cocoaLight,marginBottom:8}}>자주 쓰는 주의 식재료</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {PRESET.map(p=>(
            <button key={p} onClick={()=>allergens.includes(p)?persistAllergens(allergens.filter(a=>a!==p)):persistAllergens([...allergens,p])}
              style={{fontSize:12.5,padding:"6px 12px",borderRadius:999,cursor:"pointer",fontWeight:600,
                border:`1.5px solid ${allergens.includes(p)?"#E8927C":"#EBE2D3"}`,
                background:allergens.includes(p)?"#FFF0EC":"#fff",
                color:allergens.includes(p)?"#C0654E":C.cocoaLight}}>
              {allergens.includes(p)?"✓ ":""}{p}
            </button>
          ))}
        </div>
      </div>

      {/* Custom add */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        <input value={newItem} onChange={e=>setNewItem(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&add()}
          placeholder="직접 입력 (예: 망고)" style={{...ST.input,flex:1}}/>
        <button onClick={add} style={{...ST.primaryBtn,width:"auto",padding:"0 16px",marginTop:0}}>추가</button>
      </div>

      {/* Registered allergens */}
      {allergens.length>0 && (
        <div>
          <div style={{fontSize:12,fontWeight:700,color:C.cocoaLight,marginBottom:10}}>등록된 주의 식재료 ({allergens.length}개)</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {allergens.map(al=>{
              const hist=allergenHistory[al]||[];
              return (
                <AllergenCard key={al} name={al} history={hist}
                  onRemove={()=>persistAllergens(allergens.filter(a=>a!==al))}/>
              );
            })}
          </div>
        </div>
      )}

      {allergens.length===0 && (
        <div style={{textAlign:"center",padding:"30px 0",color:C.cocoaLight,fontSize:13}}>
          <div style={{fontSize:32,marginBottom:8}}>🌿</div>
          등록된 주의 식재료가 없어요.<br/>위에서 선택하거나 직접 입력해보세요.
        </div>
      )}
    </div>
  );
}

function AllergenCard({ name, history, onRemove }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:"#fff",border:"1px solid #F3D6CC",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",padding:"12px 14px",gap:10}}>
        <span style={{fontSize:14,fontWeight:700,color:"#C0654E",flex:1}}>⚠️ {name}</span>
        {history.length>0 && (
          <button onClick={()=>setOpen(!open)} style={{fontSize:11,color:C.cocoaLight,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:2}}>
            기록 {history.length}건 {open?<ChevronUp size={12}/>:<ChevronDown size={12}/>}
          </button>
        )}
        <button onClick={onRemove} style={{background:"transparent",border:"none",cursor:"pointer",padding:4}}>
          <X size={14} color={C.cocoaLight}/>
        </button>
      </div>
      {open && history.length>0 && (
        <div style={{borderTop:`1px solid #F3D6CC`,padding:"10px 14px",background:"#FFF8F0"}}>
          {history.slice(0,5).map((h,i)=>{
            const lv=h.eatLevel?eatLevelMap[h.eatLevel]:null;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.cocoa,marginBottom:4}}>
                <span>{h.meal.emoji}</span>
                <span style={{flex:1}}>{formatDateLabel(h.date)} · {h.meal.label}</span>
                {lv&&<span>{lv.emoji} {lv.label}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// ModalShell
// ─────────────────────────────────────
function ModalShell({ children, onClose, title }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(92,74,58,.35)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:50}} onClick={onClose}>
      <div style={{background:C.bg,width:"100%",maxWidth:480,maxHeight:"88vh",borderRadius:"22px 22px 0 0",display:"flex",flexDirection:"column",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:C.line,borderRadius:999,margin:"10px auto 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 18px 8px"}}>
          <div style={{fontFamily:FD,fontSize:17,fontWeight:700}}>{title}</div>
          <button onClick={onClose} style={{background:"#fff",border:`1px solid ${C.line}`,borderRadius:10,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <X size={18} color={C.cocoa}/>
          </button>
        </div>
        <div style={{padding:"8px 18px 24px",overflowY:"auto"}}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Design tokens & styles
// ─────────────────────────────────────
const C = {
  bg:"#FFF8F0", card:"#FFFFFF", peach:"#FDECE0", sage:"#E8EDD9",
  cocoa:"#5C4A3A", cocoaLight:"#A8957F", coral:"#E8927C", honey:"#D4A574",
  line:"#F0E6D8",
};
const FD = "'Gowun Batang', Georgia, serif";
const FB = "'Pretendard', -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; }
input, textarea, button { font-family: ${FB}; }
input:focus, textarea:focus { outline: 2px solid #D4A574; outline-offset: 1px; }
button:focus-visible { outline: 2px solid #D4A574; outline-offset: 2px; }
::-webkit-scrollbar { display: none; }
`;

const ST = {
  dateArrow:{ background:"#fff",border:`1px solid #F0E6D8`,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" },
  iconBtn:{ background:"transparent",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center" },
  fg:{ marginBottom:14 },
  fl:{ display:"block",fontSize:12.5,fontWeight:700,color:"#5C4A3A",marginBottom:6 },
  input:{ width:"100%",padding:"10px 12px",borderRadius:12,border:"1px solid #F0E6D8",background:"#fff",fontSize:14,color:"#5C4A3A" },
  primaryBtn:{ width:"100%",background:"#E8927C",color:"#fff",border:"none",borderRadius:14,padding:"13px 0",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:6,display:"flex",alignItems:"center",justifyContent:"center" },
  fab:{ position:"fixed",right:"max(16px, calc((100% - 480px)/2 + 16px))",bottom:"calc(78px + env(safe-area-inset-bottom))",width:50,height:50,borderRadius:"50%",background:"#E8927C",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 14px rgba(232,146,124,.45)",zIndex:45 },
};
