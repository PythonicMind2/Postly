import { useState, useRef } from "react";

const PLATFORMS = [
  { id:"twitter",   label:"X / Twitter", color:"#2563eb", icon:"X", charLimit:280,
    postFields:[
      { key:"title",    label:"Tweet Text", type:"textarea", placeholder:"What's happening?", maxLen:280, required:true },
      { key:"hashtags", label:"Hashtags",   type:"text",     placeholder:"#marketing #business" },
    ],
    apiFields:[
      { key:"apiKey",       label:"API Key" },
      { key:"apiSecret",    label:"API Secret" },
      { key:"accessToken",  label:"Access Token" },
      { key:"accessSecret", label:"Access Token Secret" },
    ],
    hint:"developer.twitter.com -> Keys & Tokens tab",
  },
  { id:"instagram", label:"Instagram", color:"#db2777", icon:"IG", charLimit:2200,
    postFields:[
      { key:"caption",  label:"Caption",       type:"textarea", placeholder:"Write a caption...", maxLen:2200, required:true },
      { key:"hashtags", label:"Hashtags",       type:"text",     placeholder:"#instagood #reels" },
      { key:"location", label:"Location Tag",   type:"text",     placeholder:"New York, NY" },
      { key:"altText",  label:"Image Alt Text", type:"text",     placeholder:"Describe the image" },
    ],
    apiFields:[
      { key:"accessToken", label:"Page Access Token" },
      { key:"accountId",   label:"Business Account ID" },
    ],
    hint:"Meta Graph API Explorer -> long-lived page token",
  },
  { id:"linkedin",  label:"LinkedIn", color:"#0284c7", icon:"in", charLimit:3000,
    postFields:[
      { key:"title",    label:"Post Title (optional)", type:"text",     placeholder:"Compelling headline..." },
      { key:"body",     label:"Post Body",             type:"textarea", placeholder:"Share professional insights...", maxLen:3000, required:true },
      { key:"hashtags", label:"Hashtags",              type:"text",     placeholder:"#leadership #innovation" },
      { key:"link",     label:"Article Link",          type:"text",     placeholder:"https://..." },
    ],
    apiFields:[
      { key:"clientId",     label:"Client ID" },
      { key:"clientSecret", label:"Client Secret" },
      { key:"accessToken",  label:"Access Token" },
    ],
    hint:"linkedin.com/developers -> OAuth 2.0",
  },
  { id:"facebook",  label:"Facebook", color:"#1d4ed8", icon:"fb", charLimit:63206,
    postFields:[
      { key:"message",  label:"Post Message",       type:"textarea", placeholder:"What's on your mind?", required:true },
      { key:"link",     label:"Link (optional)",     type:"text",     placeholder:"https://..." },
      { key:"hashtags", label:"Hashtags (optional)", type:"text",     placeholder:"#facebook #business" },
    ],
    apiFields:[
      { key:"pageAccessToken", label:"Page Access Token" },
      { key:"pageId",          label:"Page ID" },
    ],
    hint:"Meta App Dashboard -> pages_manage_posts permission",
  },
  { id:"youtube",   label:"YouTube", color:"#dc2626", icon:"YT", charLimit:5000,
    postFields:[
      { key:"title",       label:"Video Title",  type:"text",     placeholder:"Engaging video title...", maxLen:100, required:true },
      { key:"description", label:"Description",  type:"textarea", placeholder:"Describe your video...", maxLen:5000, required:true },
      { key:"tags",        label:"Tags",          type:"text",     placeholder:"tag1, tag2, tag3" },
      { key:"category",    label:"Category",      type:"select",   options:["Education","Entertainment","How-to & Style","News & Politics","Science & Technology","People & Blogs"] },
      { key:"privacy",     label:"Privacy",       type:"select",   options:["Public","Unlisted","Private"] },
    ],
    apiFields:[
      { key:"clientId",     label:"OAuth Client ID" },
      { key:"clientSecret", label:"OAuth Client Secret" },
      { key:"refreshToken", label:"Refresh Token" },
    ],
    hint:"Google Cloud Console -> YouTube Data API v3",
  },
];

const INDUSTRIES = ["E-commerce","Technology","Food & Beverage","Health & Wellness","Fashion","Education","Finance","Real Estate","Travel","Other"];
const TONES      = ["Professional","Casual & Friendly","Witty & Humorous","Inspirational","Bold & Direct"];
const POST_TYPES = ["Announcement","Product Launch","Behind the Scenes","Educational","Promotional","Event","Q&A","Poll","Story","Thought Leadership"];
const NAV_ITEMS  = [
  { id:"profile",   label:"Business Profiles", icon:"M" },
  { id:"settings",  label:"API Settings",       icon:"K" },
  { id:"create",    label:"Create Post",         icon:"+" },
  { id:"history",   label:"Post History",        icon:"H" },
  { id:"analytics", label:"Analytics",           icon:"~" },
];
const BADGE_COLORS = ["#2563eb","#0284c7","#16a34a","#db2777","#ea580c","#7c3aed"];
const emptyProfile = () => ({ id:Date.now(), name:"", industry:"", bio:"", tone:"", website:"", logoLetter:"", logoColor:"#2563eb", platforms:[] });
const MAKE_WEBHOOK = "https://hook.eu1.make.com/to0rqfrds6x0uv8tta21s4klzugqowho";

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const LIGHT = {
  bg:"#f8fafc", card:"#ffffff", sidebar:"#f1f5f9", input:"#ffffff",
  border:"#e2e8f0", border2:"#cbd5e1",
  text:"#0f172a", muted:"#64748b", muted2:"#94a3b8",
  primary:"#2563eb", primaryHover:"#1d4ed8", primaryBg:"#eff6ff", primaryText:"#ffffff",
  success:"#16a34a", successBg:"#f0fdf4", successBorder:"#bbf7d0", successText:"#166534",
  danger:"#dc2626",  dangerBg:"#fef2f2",  dangerBorder:"#fecaca",  dangerText:"#991b1b",
  warning:"#d97706", warningBg:"#fffbeb", warningBorder:"#fde68a", warningText:"#92400e",
  gemini:"#0284c7",  geminiBg:"#f0f9ff",
};

const DARK = {
  bg:"#0f172a", card:"#1e293b", sidebar:"#0f172a", input:"#1e293b",
  border:"#334155", border2:"#475569",
  text:"#f1f5f9", muted:"#94a3b8", muted2:"#64748b",
  primary:"#3b82f6", primaryHover:"#2563eb", primaryBg:"#1e3a5f", primaryText:"#ffffff",
  success:"#22c55e", successBg:"#052e16", successBorder:"#166534", successText:"#86efac",
  danger:"#f87171",  dangerBg:"#450a0a",  dangerBorder:"#991b1b",  dangerText:"#fca5a5",
  warning:"#fbbf24", warningBg:"#1c1002", warningBorder:"#92400e", warningText:"#fde68a",
  gemini:"#38bdf8",  geminiBg:"#0c4a6e",
};

const makeCSS = (T, dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:${T.border2}; border-radius:4px; }
  input,textarea,select {
    background:${T.input}; border:1px solid ${T.border}; color:${T.text};
    border-radius:8px; padding:10px 14px; font-family:inherit; font-size:13.5px;
    width:100%; outline:none; transition:border-color 0.15s;
  }
  input:focus,textarea:focus,select:focus { border-color:${T.primary}; box-shadow:0 0 0 3px ${T.primaryBg}; }
  input::placeholder,textarea::placeholder { color:${T.muted2}; }
  select option { background:${T.input}; color:${T.text}; }
  textarea { resize:vertical; min-height:90px; line-height:1.65; }
  input[type="password"] { font-family:'JetBrains Mono',monospace; letter-spacing:0.1em; }
  input[type="date"],input[type="time"] { color-scheme:${dark?"dark":"light"}; }
  @keyframes fadeIn  { from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
  @keyframes pop     { 0%,100%{transform:scale(1);}50%{transform:scale(1.04);} }
  @keyframes pulse   { 0%,100%{opacity:1;}50%{opacity:0.35;} }
  @keyframes spin    { to{transform:rotate(360deg);} }
  @keyframes shimmer { 0%{opacity:0.3;}50%{opacity:0.6;}100%{opacity:0.3;} }
  .nav-item:hover       { background:${T.primaryBg} !important; color:${T.primary} !important; }
  .chip:hover           { transform:translateY(-1px); }
  .pri-btn:hover        { background:${T.primaryHover} !important; }
  .ghost-btn:hover      { background:${T.border} !important; }
  .hov-card:hover       { border-color:${T.border2} !important; }
  .hov-card:hover .ca   { opacity:1 !important; }
  .pl-row:hover         { background:${T.bg} !important; }
  .ptab:hover           { background:${T.bg} !important; }
  .regen-btn:hover      { background:${T.bg} !important; border-color:${T.border2} !important; }
  .copy-btn:hover       { background:${T.bg} !important; color:${T.primary} !important; }
  .tog-wrap:hover       { border-color:${T.border2} !important; }
  .upload-zone:hover    { border-color:${T.primary} !important; background:${T.primaryBg} !important; }
  .prof-row:hover       { background:${T.bg} !important; }
`;

// ─── Shared components (all accept T prop) ────────────────────────────────────

function Lbl({ T, children, sub, required }) {
  return (
    <div style={{ marginBottom:6 }}>
      <span style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>{children}</span>
      {required && <span style={{ color:T.danger, marginLeft:3, fontSize:11 }}>*</span>}
      {sub && <span style={{ fontSize:11, color:T.muted2, marginLeft:8, textTransform:"none", letterSpacing:0, fontWeight:400 }}>{sub}</span>}
    </div>
  );
}

function MaskedInput({ T, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <input type={show?"text":"password"} value={value} onChange={onChange} placeholder={placeholder} style={{ paddingRight:52 }} />
      <button onClick={() => setShow(s=>!s)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit", padding:"2px 4px" }}>
        {show?"hide":"show"}
      </button>
    </div>
  );
}

function HintBox({ T, accent, children }) {
  return (
    <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:14, background:T.bg, border:("1px solid "+T.border), fontSize:12, color:T.muted, lineHeight:1.7 }}>
      {accent && <span style={{ color:accent, fontWeight:600 }}>Setup: </span>}
      {children}
    </div>
  );
}

function Toggle({ T, value, onChange, label, sub }) {
  return (
    <div className="tog-wrap" onClick={() => onChange(!value)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderRadius:9, border:("1px solid "+T.border), background:T.card, cursor:"pointer", transition:"border-color 0.15s" }}>
      <div>
        <div style={{ fontSize:13, color:T.text, fontWeight:500 }}>{label}</div>
        {sub && <div style={{ fontSize:11.5, color:T.muted, marginTop:3 }}>{sub}</div>}
      </div>
      <div style={{ width:36, height:20, borderRadius:10, background:value?T.primary:T.border2, position:"relative", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:value?19:3, transition:"left 0.2s" }} />
      </div>
    </div>
  );
}

function Spinner({ T }) {
  return <div style={{ width:13, height:13, border:("2px solid "+T.border2), borderTop:("2px solid "+T.primary), borderRadius:"50%", animation:"spin 0.65s linear infinite", flexShrink:0 }} />;
}

function SCard({ T, children, style }) {
  return (
    <div style={{ background:T.card, border:("1px solid "+T.border), borderRadius:12, overflow:"hidden", transition:"border-color 0.15s", ...style }}>
      {children}
    </div>
  );
}

function SCardHead({ T, icon, iconColor, title, subtitle, right }) {
  return (
    <div style={{ padding:"14px 18px", borderBottom:("1px solid "+T.border), display:"flex", alignItems:"center", gap:12 }}>
      {icon && (
        <div style={{ width:34, height:34, borderRadius:8, background:(iconColor+"18"), border:("1px solid "+iconColor+"30"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:iconColor, flexShrink:0 }}>{icon}</div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:600, color:T.text }}>{title}</div>
        {subtitle && <div style={{ fontSize:11.5, color:T.muted, marginTop:2 }}>{subtitle}</div>}
      </div>
      {right && <div style={{ flexShrink:0 }}>{right}</div>}
    </div>
  );
}

function PriBtn({ T, children, onClick, disabled, style }) {
  return (
    <button className="pri-btn" onClick={disabled?undefined:onClick} disabled={disabled} style={{ background:disabled?T.border2:T.primary, color:disabled?T.muted2:"#ffffff", border:"none", borderRadius:9, padding:"10px 22px", fontSize:13, fontWeight:600, cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", transition:"background 0.15s", display:"flex", alignItems:"center", gap:7, opacity:disabled?0.5:1, ...style }}>
      {children}
    </button>
  );
}

function GhostBtn({ T, children, onClick, style }) {
  return (
    <button className="ghost-btn" onClick={onClick} style={{ background:"transparent", color:T.muted, border:("1px solid "+T.border2), borderRadius:9, padding:"10px 18px", fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"background 0.15s", ...style }}>
      {children}
    </button>
  );
}

function StatusBadge({ T, filled, total }) {
  const ready=filled===total, partial=filled>0&&!ready;
  return (
    <span style={{ fontSize:10, padding:"2px 9px", borderRadius:5, fontWeight:600, letterSpacing:"0.04em",
      background:ready?T.successBg:partial?T.warningBg:T.border,
      color:ready?T.successText:partial?T.warningText:T.muted2,
      border:("1px solid "+(ready?T.successBorder:partial?T.warningBorder:T.border2)),
    }}>
      {ready?"Ready":partial?"Partial":"Empty"}
    </span>
  );
}

async function callGemini(apiKey, prompt) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+apiKey, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ contents:[{ parts:[{ text:prompt }] }], generationConfig:{ temperature:0.85, maxOutputTokens:2048 } }),
  });
  if (!res.ok) throw new Error("Gemini error "+res.status);
  const d = await res.json();
  return (d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts&&d.candidates[0].content.parts[0]&&d.candidates[0].content.parts[0].text)||"";
}

// ─── CREATE POST TAB ──────────────────────────────────────────────────────────

function CreatePostTab({ T, apiKeys, profiles }) {
  const [step,               setStep]             = useState("brief");
  const [selectedProfile,    setSelectedProfile]  = useState("");
  const [topic,              setTopic]            = useState("");
  const [postType,           setPostType]         = useState("");
  const [mood,               setMood]             = useState("");
  const [callToAction,       setCTA]              = useState("");
  const [targetAudience,     setAudience]         = useState("");
  const [selectedPlatforms,  setSelPlatforms]     = useState([]);
  const [imagePreview,       setImagePreview]     = useState(null);
  const [scheduleDate,       setScheduleDate]     = useState("");
  const [scheduleTime,       setScheduleTime]     = useState("");
  const [autoAll,            setAutoAll]          = useState(true);
  const [platformContent,    setPlatformContent]  = useState({});
  const [generating,         setGenerating]       = useState(false);
  const [genError,           setGenError]         = useState("");
  const [activePlatformTab,  setActivePlatformTab]= useState(null);
  const [publishing,         setPublishing]       = useState(false);
  const [publishError,       setPublishError]     = useState("");
  const [makeResponse,       setMakeResponse]     = useState(null);
  const imageRef = useRef();

  const profile         = profiles.find(p => p.id===selectedProfile);
  const geminiKey       = apiKeys&&apiKeys.gemini&&apiKeys.gemini.apiKey;
  const activePlatforms = PLATFORMS.filter(p => selectedPlatforms.includes(p.id));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const togglePlatform = pid => {
    setSelPlatforms(ps => ps.includes(pid)?ps.filter(p=>p!==pid):[...ps,pid]);
    if (!platformContent[pid]) setPlatformContent(c=>({...c,[pid]:{autoMode:true,generated:false,loading:false}}));
  };

  const setPContent = (pid,key,val) => setPlatformContent(c=>({...c,[pid]:{...(c[pid]||{}),[key]:val}}));

  const buildPrompt = pl => {
    const prof=profile;
    const fl = pl.postFields.map(f=>'"'+f.key+'": "'+f.label+' - '+f.placeholder+'"').join("\n");
    return "You are a social media expert. Generate content for a "+pl.label+" post.\n\nBUSINESS:\n- Name: "+(prof&&prof.name?prof.name:"Unknown")+"\n- Industry: "+(prof&&prof.industry?prof.industry:"General")+"\n- Bio: "+(prof&&prof.bio?prof.bio:"N/A")+"\n- Tone: "+(prof&&prof.tone?prof.tone:"Professional")+"\n- Website: "+(prof&&prof.website?prof.website:"N/A")+"\n\nPOST BRIEF:\n- Topic: "+topic+"\n- Type: "+(postType||"General")+"\n- Audience: "+(targetAudience||"General")+"\n- CTA: "+(callToAction||"None")+"\n- Mood: "+(mood||"Neutral")+"\n\nPLATFORM: "+pl.label+" (limit: "+pl.charLimit+" chars)\n\nGenerate JSON with ONLY these keys:\n"+fl+"\n\nReturn ONLY valid JSON, no markdown, no extra text.";
  };

  const generateForPlatform = async pid => {
    if (!geminiKey){setGenError("No Gemini API key - add it in API Settings first.");return;}
    if (!topic.trim()){setGenError("Please enter a post topic first.");return;}
    const pl=PLATFORMS.find(p=>p.id===pid);
    setPContent(pid,"loading",true); setPContent(pid,"error",""); setGenError("");
    try {
      const raw=await callGemini(geminiKey,buildPrompt(pl));
      const clean=raw.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setPlatformContent(c=>({...c,[pid]:Object.assign({},c[pid]||{},parsed,{loading:false,generated:true,autoMode:true})}));
      if (!activePlatformTab) setActivePlatformTab(pid);
    } catch(e){setPContent(pid,"loading",false);setPContent(pid,"error","Generation failed - check your API key or try again.");}
  };

  const generateAll = async () => {
    if (!geminiKey){setGenError("No Gemini API key - add it in API Settings first.");return;}
    if (!topic.trim()){setGenError("Enter a topic first.");return;}
    if (selectedPlatforms.length===0){setGenError("Select at least one platform.");return;}
    setGenerating(true); setGenError("");
    for (const pid of selectedPlatforms) await generateForPlatform(pid);
    setGenerating(false); setStep("compose"); setActivePlatformTab(selectedPlatforms[0]);
  };

  const proceedManual = () => {
    if (selectedPlatforms.length===0){setGenError("Select at least one platform.");return;}
    if (!topic.trim()){setGenError("Enter a topic first.");return;}
    setStep("compose"); setActivePlatformTab(selectedPlatforms[0]);
  };

  const resetAll = () => {
    setStep("brief");setTopic("");setSelPlatforms([]);setPlatformContent({});
    setImagePreview(null);setScheduleDate("");setScheduleTime("");
    setGenError("");setSelectedProfile("");setActivePlatformTab(null);
    setPublishError("");setPublishing(false);setMakeResponse(null);
  };

  const publishToMake = async () => {
    setPublishing(true); setPublishError(""); setMakeResponse(null);
    try {
      const payload = { profile:profile?profile.name:"Unknown", platforms:selectedPlatforms, content:{}, scheduleDate, scheduleTime, topic, postType, mood, callToAction, targetAudience };
      selectedPlatforms.forEach(pid => { payload.content[pid]=platformContent[pid]||{}; });
      const res = await fetch(MAKE_WEBHOOK,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      if (!res.ok) throw new Error("Make.com returned status "+res.status+". Make sure your scenario is ON.");
      let data=null;
      try { data=await res.json(); } catch(e){ data={status:"success",message:"Posts published successfully"}; }
      setMakeResponse(data);
      if (data&&data.status==="error"){ setPublishError(data.message||"Something went wrong."); }
      else { setStep("done"); }
    } catch(e){ setPublishError("Failed to reach Make.com: "+e.message); }
    finally { setPublishing(false); }
  };

  // ── BRIEF ──────────────────────────────────────────────────────────────────
  if (step==="brief") return (
    <div style={{ animation:"fadeUp 0.35s ease" }}>
      <div style={{ marginBottom:26 }}>
        <div style={{ fontSize:11, color:T.primary, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:5 }}>New Post</div>
        <h1 style={{ fontSize:26, fontWeight:600, color:T.text, letterSpacing:"-0.02em", marginBottom:4 }}>Create Post</h1>
        <p style={{ fontSize:13, color:T.muted }}>Fill in the brief and let Gemini craft platform-perfect content</p>
      </div>

      {genError && <div style={{ padding:"10px 16px", borderRadius:8, background:T.dangerBg, border:("1px solid "+T.dangerBorder), color:T.dangerText, fontSize:13, marginBottom:18 }}>{genError}</div>}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          <SCard T={T}>
            <SCardHead T={T} icon="M" iconColor={T.primary} title="Business Profile" />
            <div style={{ padding:16 }}>
              {profiles.length===0
                ? <div style={{ fontSize:12, color:T.muted2, padding:"8px 0" }}>No profiles yet - add one in Business Profiles</div>
                : <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    {profiles.map(p=>(
                      <div key={p.id} className="prof-row" onClick={()=>setSelectedProfile(p.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, cursor:"pointer", border:selectedProfile===p.id?("2px solid "+T.primary):("1px solid "+T.border), background:selectedProfile===p.id?T.primaryBg:"transparent", transition:"all 0.15s" }}>
                        <div style={{ width:30, height:30, borderRadius:8, background:p.logoColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>
                          {p.logoLetter||(p.name&&p.name[0]&&p.name[0].toUpperCase())||"?"}
                        </div>
                        <div>
                          <div style={{ fontSize:12.5, fontWeight:500, color:T.text }}>{p.name}</div>
                          <div style={{ fontSize:11, color:T.muted }}>{p.industry}{p.tone?" - "+p.tone:""}</div>
                        </div>
                        {selectedProfile===p.id&&<span style={{ marginLeft:"auto", color:T.primary, fontSize:13, fontWeight:600 }}>v</span>}
                      </div>
                    ))}
                  </div>
              }
            </div>
          </SCard>

          <SCard T={T}>
            <SCardHead T={T} icon="~" iconColor={T.primary} title="Post To" subtitle="Select platforms" />
            <div style={{ padding:16, display:"flex", flexDirection:"column", gap:7 }}>
              {PLATFORMS.map(pl=>{
                const active=selectedPlatforms.includes(pl.id);
                return (
                  <div key={pl.id} onClick={()=>togglePlatform(pl.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, cursor:"pointer", border:active?("2px solid "+pl.color):("1px solid "+T.border), background:active?(pl.color+"12"):"transparent", transition:"all 0.15s" }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:(pl.color+"20"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:pl.color, flexShrink:0 }}>{pl.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12.5, fontWeight:500, color:active?T.text:T.muted }}>{pl.label}</div>
                      <div style={{ fontSize:10, color:T.muted2 }}>{pl.charLimit.toLocaleString()} char limit</div>
                    </div>
                    <div style={{ width:16, height:16, borderRadius:4, border:active?"none":("1.5px solid "+T.border2), background:active?pl.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", flexShrink:0, transition:"all 0.15s" }}>
                      {active?"v":""}
                    </div>
                  </div>
                );
              })}
            </div>
          </SCard>

          <SCard T={T}>
            <SCardHead T={T} icon="[]" iconColor={T.muted} title="Attach Image" subtitle="optional" />
            <div style={{ padding:16 }}>
              <input type="file" accept="image/*" ref={imageRef} style={{ display:"none" }} onChange={handleImage} />
              {imagePreview
                ? <div style={{ position:"relative" }}>
                    <img src={imagePreview} alt="preview" style={{ width:"100%", borderRadius:8, maxHeight:150, objectFit:"cover" }} />
                    <button onClick={()=>setImagePreview(null)} style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.6)", border:"none", color:"#fff", borderRadius:6, padding:"4px 9px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Remove</button>
                  </div>
                : <div className="upload-zone" onClick={()=>imageRef.current.click()} style={{ border:("1.5px dashed "+T.border2), borderRadius:9, padding:"22px", textAlign:"center", cursor:"pointer", transition:"all 0.15s" }}>
                    <div style={{ fontSize:20, marginBottom:7, opacity:0.3 }}>[ ]</div>
                    <div style={{ fontSize:12, color:T.muted }}>Click to upload image</div>
                    <div style={{ fontSize:11, color:T.muted2, marginTop:3 }}>PNG, JPG, GIF up to 10MB</div>
                  </div>
              }
            </div>
          </SCard>
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          <SCard T={T}>
            <SCardHead T={T} icon="/" iconColor={T.primary} title="Post Brief" />
            <div style={{ padding:16, display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <Lbl T={T} required>Topic / Main Idea</Lbl>
                <textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. We just launched a new product feature..." style={{ minHeight:80 }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <Lbl T={T}>Post Type</Lbl>
                  <select value={postType} onChange={e=>setPostType(e.target.value)}>
                    <option value="">Select...</option>
                    {POST_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Lbl T={T}>Mood / Vibe</Lbl>
                  <input value={mood} onChange={e=>setMood(e.target.value)} placeholder="Exciting, Informative..." />
                </div>
              </div>
              <div>
                <Lbl T={T}>Call to Action</Lbl>
                <input value={callToAction} onChange={e=>setCTA(e.target.value)} placeholder="e.g. Sign up free, Learn more..." />
              </div>
              <div>
                <Lbl T={T}>Target Audience</Lbl>
                <input value={targetAudience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. Startup founders, college students..." />
              </div>
            </div>
          </SCard>

          <SCard T={T}>
            <SCardHead T={T} icon="@" iconColor={T.muted} title="Schedule" subtitle="optional - leave blank to post now" />
            <div style={{ padding:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div><Lbl T={T}>Date</Lbl><input type="date" value={scheduleDate} onChange={e=>setScheduleDate(e.target.value)} /></div>
                <div><Lbl T={T}>Time</Lbl><input type="time" value={scheduleTime} onChange={e=>setScheduleTime(e.target.value)} /></div>
              </div>
            </div>
          </SCard>

          <SCard T={T}>
            <SCardHead T={T} icon="G" iconColor={T.gemini} title="Generation Mode" />
            <div style={{ padding:16, display:"flex", flexDirection:"column", gap:10 }}>
              <Toggle T={T} value={autoAll} onChange={setAutoAll} label="Auto-generate with Gemini 2.5 Flash" sub={autoAll?"AI writes all captions and content":"You will fill in content manually"} />
              {!geminiKey&&autoAll&&(
                <div style={{ fontSize:11.5, color:T.warningText, padding:"9px 12px", background:T.warningBg, borderRadius:8, border:("1px solid "+T.warningBorder) }}>
                  No Gemini key set - go to API Settings to add one
                </div>
              )}
            </div>
          </SCard>

          {autoAll
            ? <PriBtn T={T} onClick={generateAll} disabled={generating||!topic.trim()||selectedPlatforms.length===0} style={{ padding:"13px 24px", fontSize:14, justifyContent:"center" }}>
                {generating?<><Spinner T={T} /> {"Generating for "+selectedPlatforms.length+" platform"+(selectedPlatforms.length>1?"s":"")+"..."}</>:"Generate with Gemini"}
              </PriBtn>
            : <GhostBtn T={T} onClick={proceedManual} style={{ padding:"13px 24px", fontSize:14, textAlign:"center", opacity:(selectedPlatforms.length>0&&topic.trim())?1:0.4 }}>
                Write Manually
              </GhostBtn>
          }
        </div>
      </div>
    </div>
  );

  // ── COMPOSE ────────────────────────────────────────────────────────────────
  if (step==="compose") {
    const curPl=PLATFORMS.find(p=>p.id===activePlatformTab);
    const curContent=platformContent[activePlatformTab]||{};
    const schedLabel=scheduleDate?(scheduleDate+" "+scheduleTime):"Post now";

    return (
      <div style={{ animation:"fadeUp 0.35s ease" }}>
        <div style={{ marginBottom:22, display:"flex", alignItems:"center", gap:14 }}>
          <GhostBtn T={T} onClick={()=>setStep("brief")} style={{ padding:"7px 14px", fontSize:12 }}>Back</GhostBtn>
          <div>
            <div style={{ fontSize:11, color:T.primary, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>Step 2 of 2</div>
            <h1 style={{ fontSize:22, fontWeight:600, color:T.text, letterSpacing:"-0.02em" }}>Review and Edit</h1>
            <p style={{ fontSize:11.5, color:T.muted, marginTop:2 }}>{profile?profile.name:"No profile"} &middot; {activePlatforms.length} platform{activePlatforms.length!==1?"s":""} &middot; {schedLabel}</p>
          </div>
          <div style={{ marginLeft:"auto" }}>
            <button className="regen-btn" onClick={generateAll} disabled={generating||!geminiKey} style={{ background:T.card, border:("1px solid "+T.border), color:T.primary, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}>
              {generating?<><Spinner T={T} />Regenerating...</>:"Regenerate all"}
            </button>
          </div>
        </div>

        {genError&&<div style={{ padding:"10px 16px", borderRadius:8, background:T.dangerBg, border:("1px solid "+T.dangerBorder), color:T.dangerText, fontSize:13, marginBottom:16 }}>{genError}</div>}

        <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
          {activePlatforms.map(pl=>{
            const c=platformContent[pl.id]||{};
            const isActive=activePlatformTab===pl.id;
            return (
              <div key={pl.id} className="ptab" onClick={()=>setActivePlatformTab(pl.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, cursor:"pointer", background:isActive?(pl.color+"15"):T.card, border:isActive?("2px solid "+pl.color):("1px solid "+T.border), color:isActive?pl.color:T.muted, fontSize:12, fontWeight:500, transition:"all 0.15s" }}>
                <span style={{ fontSize:10, fontWeight:700 }}>{pl.icon}</span>
                {pl.label}
                {c.loading&&<Spinner T={T} />}
                {c.generated&&!c.loading&&<span style={{ color:T.success, fontSize:10, fontWeight:700 }}>ok</span>}
                {c.error&&<span style={{ color:T.danger, fontSize:10, fontWeight:700 }}>!</span>}
              </div>
            );
          })}
        </div>

        {curPl&&(
          <SCard T={T}>
            <SCardHead T={T}
              icon={curPl.icon} iconColor={curPl.color}
              title={curPl.label}
              subtitle={curPl.charLimit.toLocaleString()+" char limit"}
              right={
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:11, color:T.muted }}>Auto</span>
                  <div onClick={()=>setPContent(curPl.id,"autoMode",!curContent.autoMode)} style={{ width:30, height:17, borderRadius:9, background:curContent.autoMode?T.primary:T.border2, position:"relative", transition:"background 0.2s", cursor:"pointer" }}>
                    <div style={{ width:11, height:11, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:curContent.autoMode?16:3, transition:"left 0.2s" }} />
                  </div>
                  {curContent.autoMode&&(
                    <button className="regen-btn" onClick={()=>generateForPlatform(curPl.id)} disabled={curContent.loading||!geminiKey} style={{ background:T.card, border:("1px solid "+T.border), color:T.primary, borderRadius:7, padding:"5px 10px", cursor:"pointer", fontSize:11, fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" }}>
                      {curContent.loading?<><Spinner T={T} />Gen...</>:"Regen"}
                    </button>
                  )}
                </div>
              }
            />

            {curContent.error&&<div style={{ margin:"12px 18px 0", padding:"10px 14px", borderRadius:8, background:T.dangerBg, border:("1px solid "+T.dangerBorder), color:T.dangerText, fontSize:12 }}>{curContent.error}</div>}

            {curContent.loading&&(
              <div style={{ padding:"20px 18px" }}>
                {[80,55,100,40].map((w,i)=>(
                  <div key={i} style={{ height:12, borderRadius:5, background:T.border, marginBottom:10, width:(w+"%"), animation:("shimmer "+(1+i*0.2)+"s ease-in-out infinite") }} />
                ))}
              </div>
            )}

            {!curContent.loading&&(
              <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:14 }}>
                {curPl.postFields.map(f=>{
                  const val=curContent[f.key]||"";
                  const over=val.length>(f.maxLen||curPl.charLimit);
                  return (
                    <div key={f.key}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                        <Lbl T={T} required={f.required}>{f.label}</Lbl>
                        {f.maxLen&&<span style={{ fontSize:11, color:over?T.danger:T.muted2, fontFamily:"'JetBrains Mono',monospace" }}>{val.length}/{f.maxLen}</span>}
                      </div>
                      {f.type==="textarea"
                        ? <textarea value={val} onChange={e=>setPContent(curPl.id,f.key,e.target.value)} placeholder={f.placeholder} style={{ borderColor:over?T.danger:undefined, minHeight:(f.key==="description"||f.key==="body")?140:90 }} />
                        : f.type==="select"
                          ? <select value={val} onChange={e=>setPContent(curPl.id,f.key,e.target.value)}>
                              <option value="">Select...</option>
                              {f.options.map(o=><option key={o} value={o}>{o}</option>)}
                            </select>
                          : <input value={val} onChange={e=>setPContent(curPl.id,f.key,e.target.value)} placeholder={f.placeholder} />
                      }
                    </div>
                  );
                })}
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  <button className="copy-btn" onClick={()=>{ const t=curPl.postFields.map(f=>f.label+":\n"+(curContent[f.key]||"")).join("\n\n"); navigator.clipboard.writeText(t); }} style={{ background:T.card, border:("1px solid "+T.border), color:T.muted, borderRadius:7, padding:"6px 14px", cursor:"pointer", fontSize:12, fontFamily:"inherit", transition:"all 0.15s" }}>
                    Copy content
                  </button>
                </div>
              </div>
            )}
          </SCard>
        )}

        {publishError&&<div style={{ marginTop:14, padding:"10px 16px", borderRadius:8, background:T.dangerBg, border:("1px solid "+T.dangerBorder), color:T.dangerText, fontSize:13 }}>{publishError}</div>}

        <div style={{ marginTop:20, display:"flex", gap:10, justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:11.5, color:T.muted2 }}>
            {scheduleDate?("Scheduled for "+scheduleDate+" "+scheduleTime):"Will post immediately when you publish"}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <GhostBtn T={T} onClick={()=>{}}>Save draft</GhostBtn>
            <PriBtn T={T} onClick={publishToMake} disabled={publishing}>
              {publishing?<><Spinner T={T} />Sending to Make...</>:(scheduleDate?"Schedule Post":"Publish Now")}
            </PriBtn>
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ textAlign:"center", padding:"60px 40px", animation:"fadeUp 0.5s ease" }}>
      <div style={{ width:60, height:60, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:26, color:"#ffffff", fontWeight:700 }}>v</div>
      <h2 style={{ fontSize:24, fontWeight:600, color:T.text, marginBottom:8, letterSpacing:"-0.02em" }}>
        {scheduleDate?"Post Scheduled!":"Post Published!"}
      </h2>
      <p style={{ fontSize:13, color:T.muted, marginBottom:16 }}>{activePlatforms.map(p=>p.label).join(", ")}</p>

      {makeResponse&&(
        <div style={{ maxWidth:420, margin:"0 auto 20px", padding:"14px 20px", borderRadius:10, background:makeResponse.status==="error"?T.dangerBg:T.successBg, border:("1px solid "+(makeResponse.status==="error"?T.dangerBorder:T.successBorder)) }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center", marginBottom:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:makeResponse.status==="error"?T.danger:T.success }}></div>
            <span style={{ fontSize:13, fontWeight:600, color:makeResponse.status==="error"?T.dangerText:T.successText }}>
              {makeResponse.status==="error"?"Post Failed":"Successfully Posted"}
            </span>
          </div>
          <p style={{ fontSize:12, color:makeResponse.status==="error"?T.dangerText:T.successText, lineHeight:1.6 }}>
            {makeResponse.message||"Posts sent to Make.com successfully"}
          </p>
        </div>
      )}

      {scheduleDate&&<p style={{ fontSize:12, color:T.primary, marginBottom:16 }}>{"Scheduled for "+scheduleDate+" at "+scheduleTime}</p>}

      <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:20 }}>
        <PriBtn T={T} onClick={resetAll}>Create another post</PriBtn>
        <GhostBtn T={T} onClick={()=>setStep("compose")}>Back to edit</GhostBtn>
      </div>
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────

function SettingsTab({ T, apiKeys, setApiKeys }) {
  const [expanded,   setExpanded]   = useState(null);
  const [geminiTest, setGeminiTest] = useState("idle");
  const [savedFlash, setSavedFlash] = useState(false);

  const get = (s,k) => (apiKeys&&apiKeys[s]&&apiKeys[s][k])||"";
  const set = (s,k,v) => setApiKeys(prev=>({...prev,[s]:Object.assign({},prev[s]||{},{[k]:v})}));

  const testGemini = async () => {
    const key=get("gemini","apiKey"); if(!key) return;
    setGeminiTest("testing");
    try {
      const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+key,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"Reply: OK"}]}]})});
      setGeminiTest(res.ok?"ok":"fail");
    } catch(e){setGeminiTest("fail");}
  };

  const stColor=geminiTest==="ok"?T.successText:geminiTest==="fail"?T.dangerText:T.muted2;
  const stLabel=geminiTest==="testing"?"Testing...":geminiTest==="ok"?"Connected":geminiTest==="fail"?"Invalid key":"Not tested";

  return (
    <div style={{ animation:"fadeUp 0.35s ease" }}>
      <div style={{ marginBottom:26 }}>
        <div style={{ fontSize:11, color:T.primary, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:5 }}>Configuration</div>
        <h1 style={{ fontSize:26, fontWeight:600, color:T.text, letterSpacing:"-0.02em", marginBottom:4 }}>API Settings</h1>
        <p style={{ fontSize:13, color:T.muted }}>Credentials live in memory only and are never sent to any external server</p>
      </div>

      <SCard T={T} style={{ marginBottom:18 }}>
        <SCardHead T={T} icon="G" iconColor={T.gemini} title="Gemini AI" subtitle="Powers caption generation - Model: gemini-2.5-flash"
          right={<div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:stColor }}><div style={{ width:6, height:6, borderRadius:"50%", background:geminiTest==="ok"?T.success:T.border2 }}></div>{stLabel}</div>}
        />
        <div style={{ padding:"16px 18px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:10, alignItems:"end", marginBottom:14 }}>
            <div>
              <Lbl T={T}>Gemini API Key</Lbl>
              <MaskedInput T={T} value={get("gemini","apiKey")} onChange={e=>{set("gemini","apiKey",e.target.value);setGeminiTest("idle");}} placeholder="AIza..." />
            </div>
            <button onClick={testGemini} disabled={!get("gemini","apiKey")||geminiTest==="testing"} style={{ background:T.card, border:("1px solid "+T.border2), color:T.muted, borderRadius:8, padding:"10px 16px", fontSize:12, cursor:get("gemini","apiKey")?"pointer":"not-allowed", whiteSpace:"nowrap", fontFamily:"inherit", animation:geminiTest==="testing"?"pulse 1s infinite":"none" }}>
              {geminiTest==="testing"?"Testing...":"Test key"}
            </button>
          </div>
          <HintBox T={T} accent={T.gemini}>
            Go to <span style={{ color:T.primary }}>aistudio.google.com</span> - Get API Key - Create API key in new project. Free tier available.
          </HintBox>
          <div style={{ display:"flex", gap:8 }}>
            {[{l:"Model",v:"gemini-2.5-flash"},{l:"Context",v:"1M tokens"},{l:"Speed",v:"Fast"}].map(({l,v})=>(
              <div key={l} style={{ padding:"5px 11px", borderRadius:7, background:T.bg, border:("1px solid "+T.border), fontSize:11 }}>
                <span style={{ color:T.muted2 }}>{l}: </span>
                <span style={{ color:T.muted, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </SCard>

      <SCard T={T} style={{ marginBottom:22 }}>
        <SCardHead T={T} icon="K" iconColor={T.primary} title="Social Platform Credentials" subtitle="API credentials for posting" />
        {PLATFORMS.map((pl,i)=>{
          const isOpen=expanded===pl.id;
          const filled=pl.apiFields.filter(f=>get(pl.id,f.key)).length;
          return (
            <div key={pl.id}>
              {i>0&&<div style={{ height:1, background:T.border, margin:"0 18px" }} />}
              <div className="pl-row" onClick={()=>setExpanded(isOpen?null:pl.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", cursor:"pointer", transition:"background 0.15s" }}>
                <div style={{ width:32, height:32, borderRadius:7, background:(pl.color+"18"), border:("1px solid "+pl.color+"30"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:pl.color, flexShrink:0 }}>{pl.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:T.text }}>{pl.label}</div>
                  <div style={{ fontSize:11, color:T.muted2 }}>{filled}/{pl.apiFields.length} fields filled</div>
                </div>
                <StatusBadge T={T} filled={filled} total={pl.apiFields.length} />
                <span style={{ color:T.border2, fontSize:12, display:"inline-block", transition:"transform 0.2s", transform:isOpen?"rotate(180deg)":"none" }}>v</span>
              </div>
              {isOpen&&(
                <div style={{ padding:"4px 18px 18px", borderTop:("1px solid "+T.border), animation:"fadeIn 0.2s ease" }}>
                  <HintBox T={T} accent={pl.color}>{pl.hint}</HintBox>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {pl.apiFields.map(f=>(
                      <div key={f.key}>
                        <Lbl T={T}>{f.label}</Lbl>
                        <MaskedInput T={T} value={get(pl.id,f.key)} onChange={e=>set(pl.id,f.key,e.target.value)} placeholder={f.key} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </SCard>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:12, color:T.muted2 }}>Keys stored in memory only</div>
        <PriBtn T={T} onClick={()=>{setSavedFlash(true);setTimeout(()=>setSavedFlash(false),1400);}} style={{ animation:savedFlash?"pop 0.35s ease":"none", background:savedFlash?T.success:T.primary }}>
          {savedFlash?"Saved!":"Save settings"}
        </PriBtn>
      </div>
    </div>
  );
}

// ─── PROFILE TAB ─────────────────────────────────────────────────────────────

function ProfileTab({ T, profiles, setProfiles }) {
  const [editingId, setEditingId] = useState(null);
  const [draft,     setDraft]     = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [saved,     setSaved]     = useState(false);

  const startNew  = () => { setDraft(emptyProfile()); setEditingId(null); setShowForm(true); setSaved(false); };
  const startEdit = p  => { setDraft({...p}); setEditingId(p.id); setShowForm(true); setSaved(false); };
  const cancelForm    = () => { setShowForm(false); setDraft(null); setEditingId(null); };
  const deleteProfile = id => { setProfiles(ps=>ps.filter(p=>p.id!==id)); if(editingId===id) cancelForm(); };

  const saveProfile = () => {
    if (!draft.name.trim()) return;
    if (editingId) setProfiles(ps=>ps.map(p=>p.id===editingId?draft:p));
    else setProfiles(ps=>[...ps,{...draft,id:Date.now()}]);
    setSaved(true);
    setTimeout(()=>{setShowForm(false);setDraft(null);setEditingId(null);setSaved(false);},900);
  };

  const togglePlatform = pid => setDraft(d=>({...d,platforms:d.platforms.includes(pid)?d.platforms.filter(p=>p!==pid):[...d.platforms,pid]}));

  return (
    <div>
      <div style={{ marginBottom:26, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11, color:T.primary, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:5 }}>Management</div>
          <h1 style={{ fontSize:26, fontWeight:600, color:T.text, letterSpacing:"-0.02em", marginBottom:4 }}>Business Profiles</h1>
          <p style={{ fontSize:13, color:T.muted }}>Manage the businesses you post for</p>
        </div>
        <PriBtn T={T} onClick={startNew}>+ Add Profile</PriBtn>
      </div>

      {profiles.length===0&&!showForm&&(
        <div style={{ textAlign:"center", padding:"70px 40px", border:("1px dashed "+T.border2), borderRadius:14, animation:"fadeIn 0.5s ease" }}>
          <div style={{ width:52, height:52, borderRadius:12, background:T.primaryBg, border:("1px solid "+T.primary+"40"), display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:18, color:T.primary }}>M</div>
          <div style={{ fontSize:15, color:T.muted, marginBottom:6 }}>No business profiles yet</div>
          <div style={{ fontSize:13, color:T.muted2 }}>Click "Add Profile" to get started</div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14, marginBottom:showForm?26:0 }}>
        {profiles.map(p=>(
          <div key={p.id} className="hov-card" style={{ background:T.card, border:("1px solid "+T.border), borderRadius:12, padding:18, position:"relative", animation:"fadeIn 0.3s ease", transition:"border-color 0.15s" }}>
            <div className="ca" style={{ position:"absolute", top:14, right:14, display:"flex", gap:6, opacity:0, transition:"opacity 0.2s" }}>
              <button onClick={()=>startEdit(p)} style={{ background:T.bg, border:("1px solid "+T.border), color:T.muted, borderRadius:7, padding:"5px 9px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Edit</button>
              <button onClick={()=>deleteProfile(p.id)} style={{ background:T.dangerBg, border:("1px solid "+T.dangerBorder), color:T.dangerText, borderRadius:7, padding:"5px 9px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Del</button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:p.logoColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#fff", flexShrink:0 }}>
                {p.logoLetter||(p.name&&p.name[0]&&p.name[0].toUpperCase())||"?"}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:2, color:T.text }}>{p.name}</div>
                <div style={{ fontSize:11.5, color:T.muted }}>{p.industry||"No industry set"}</div>
              </div>
            </div>
            {p.bio&&<p style={{ fontSize:12, color:T.muted, marginBottom:10, lineHeight:1.5 }}>{p.bio.slice(0,100)}{p.bio.length>100?"...":""}</p>}
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
              {p.platforms.length===0
                ? <span style={{ fontSize:11, color:T.muted2 }}>No platforms connected</span>
                : p.platforms.map(pid=>{const pl=PLATFORMS.find(x=>x.id===pid);return pl?<span key={pid} style={{ fontSize:11, padding:"3px 8px", borderRadius:5, background:(pl.color+"15"), color:pl.color, border:("1px solid "+pl.color+"30") }}>{pl.label}</span>:null;})
              }
            </div>
            {p.tone&&<span style={{ fontSize:10.5, padding:"3px 9px", borderRadius:5, background:T.primaryBg, color:T.primary, border:("1px solid "+T.primary+"30"), fontWeight:500 }}>{p.tone}</span>}
          </div>
        ))}
      </div>

      {showForm&&draft&&(
        <SCard T={T} style={{ animation:"fadeIn 0.3s ease" }}>
          <SCardHead T={T} title={editingId?"Edit Profile":"New Business Profile"} icon="M" iconColor={T.primary} />
          <div style={{ padding:"18px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div><Lbl T={T} required>Business Name</Lbl><input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} placeholder="e.g. Brew & Co Coffee" /></div>
              <div><Lbl T={T}>Industry</Lbl>
                <select value={draft.industry} onChange={e=>setDraft(d=>({...d,industry:e.target.value}))}>
                  <option value="">Select...</option>
                  {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <Lbl T={T} sub="Gemini uses this for captions">Bio / Description</Lbl>
              <textarea value={draft.bio} onChange={e=>setDraft(d=>({...d,bio:e.target.value}))} placeholder="Products, values, target audience..." />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div><Lbl T={T}>Website</Lbl><input value={draft.website} onChange={e=>setDraft(d=>({...d,website:e.target.value}))} placeholder="https://..." /></div>
              <div><Lbl T={T}>Content Tone</Lbl>
                <select value={draft.tone} onChange={e=>setDraft(d=>({...d,tone:e.target.value}))}>
                  <option value="">Select...</option>
                  {TONES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:18 }}>
              <Lbl T={T}>Profile Badge</Lbl>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:50, height:50, borderRadius:12, background:draft.logoColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:700, color:"#fff", flexShrink:0, transition:"background 0.2s" }}>
                  {draft.logoLetter||(draft.name&&draft.name[0]&&draft.name[0].toUpperCase())||"?"}
                </div>
                <div style={{ flex:1 }}>
                  <input value={draft.logoLetter} onChange={e=>setDraft(d=>({...d,logoLetter:e.target.value.slice(0,1).toUpperCase()}))} placeholder="Custom letter (optional)" style={{ marginBottom:8 }} />
                  <div style={{ display:"flex", gap:8 }}>
                    {BADGE_COLORS.map(c=>(
                      <div key={c} onClick={()=>setDraft(d=>({...d,logoColor:c}))} style={{ width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer", transition:"transform 0.15s", border:draft.logoColor===c?"2.5px solid "+T.text:"2px solid transparent", outline:draft.logoColor===c?("2px solid "+c):""  }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <Lbl T={T}>Platforms to post to</Lbl>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {PLATFORMS.map(pl=>{
                  const active=draft.platforms.includes(pl.id);
                  return (
                    <div key={pl.id} className="chip" onClick={()=>togglePlatform(pl.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", borderRadius:8, border:active?("2px solid "+pl.color):("1px solid "+T.border2), background:active?(pl.color+"15"):T.card, color:active?pl.color:T.muted, fontSize:12.5, fontWeight:500, cursor:"pointer", transition:"all 0.15s", userSelect:"none" }}>
                      {pl.label}{active?" v":""}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <GhostBtn T={T} onClick={cancelForm}>Cancel</GhostBtn>
              <PriBtn T={T} onClick={saveProfile} disabled={!draft.name.trim()} style={{ background:saved?T.success:T.primary, animation:saved?"pop 0.35s ease":"none", minWidth:120 }}>
                {saved?"Saved!":editingId?"Update":"Save Profile"}
              </PriBtn>
            </div>
          </div>
        </SCard>
      )}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("profile");
  const [apiKeys,   setApiKeys]   = useState({});
  const [profiles,  setProfiles]  = useState([]);
  const [isDark,    setIsDark]    = useState(false);
  const BUILT = ["profile","settings","create"];
  const T = isDark ? DARK : LIGHT;

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", fontFamily:"'Inter','Segoe UI',sans-serif", color:T.text, transition:"background 0.2s, color 0.2s" }}>
      <style>{makeCSS(T,isDark)}</style>

      {/* Sidebar */}
      <div style={{ width:232, minHeight:"100vh", background:T.sidebar, borderRight:("1px solid "+T.border), display:"flex", flexDirection:"column", padding:"20px 12px", position:"fixed", top:0, left:0, bottom:0, transition:"background 0.2s" }}>

        {/* Logo + theme toggle */}
        <div style={{ padding:"0 6px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"#ffffff", fontWeight:700, flexShrink:0 }}>S</div>
            <div>
              <div style={{ fontSize:13.5, fontWeight:600, color:T.text }}>Postly</div>
              <div style={{ fontSize:9.5, color:T.muted2, letterSpacing:"0.07em", textTransform:"uppercase" }}>Manager</div>
            </div>
          </div>
          <button onClick={()=>setIsDark(d=>!d)} title={isDark?"Light mode":"Dark mode"} style={{ width:30, height:30, borderRadius:7, background:T.card, border:("1px solid "+T.border), cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:T.muted, transition:"all 0.15s", flexShrink:0 }}>
            {isDark?"L":"D"}
          </button>
        </div>

        <div style={{ height:1, background:T.border, margin:"0 6px 12px" }} />

        <nav style={{ flex:1 }}>
          {NAV_ITEMS.map(item=>(
            <div key={item.id} className="nav-item" onClick={()=>setActiveTab(item.id)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, marginBottom:2, cursor:"pointer",
              background: activeTab===item.id?T.primaryBg:"transparent",
              color:       activeTab===item.id?T.primary:T.muted,
              fontSize:13, fontWeight: activeTab===item.id?500:400,
              transition:"all 0.15s",
              borderLeft:  activeTab===item.id?("2px solid "+T.primary):"2px solid transparent",
            }}>
              <div style={{ width:20, height:20, borderRadius:5, background:activeTab===item.id?T.primaryBg:T.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:activeTab===item.id?T.primary:T.muted2, flexShrink:0, transition:"all 0.15s" }}>
                {item.icon}
              </div>
              {item.label}
              {!BUILT.includes(item.id)&&(
                <span style={{ marginLeft:"auto", fontSize:9, background:T.border, color:T.muted2, padding:"2px 6px", borderRadius:4, letterSpacing:"0.04em" }}>SOON</span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding:"12px 6px 0", borderTop:("1px solid "+T.border) }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:T.muted2, marginBottom:4 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:(apiKeys&&apiKeys.gemini&&apiKeys.gemini.apiKey)?T.success:T.border2, display:"inline-block", flexShrink:0 }}></span>
            {(apiKeys&&apiKeys.gemini&&apiKeys.gemini.apiKey)
              ? <span style={{ color:T.success }}>Gemini ready</span>
              : <span style={{ color:T.muted2 }}>Gemini not set</span>
            }
          </div>
          <div style={{ fontSize:10, color:T.muted2, letterSpacing:"0.04em" }}>v0.3 - Postly</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft:232, flex:1, padding:"36px 40px", minHeight:"100vh" }}>
        {activeTab==="profile"  && <ProfileTab  T={T} profiles={profiles} setProfiles={setProfiles} />}
        {activeTab==="settings" && <SettingsTab T={T} apiKeys={apiKeys} setApiKeys={setApiKeys} />}
        {activeTab==="create"   && <CreatePostTab T={T} apiKeys={apiKeys} profiles={profiles} />}
        {!BUILT.includes(activeTab)&&(
          <div style={{ textAlign:"center", padding:"80px 40px", border:("1px dashed "+T.border2), borderRadius:14, animation:"fadeIn 0.4s ease" }}>
            <div style={{ width:52, height:52, borderRadius:12, background:T.primaryBg, border:("1px solid "+T.primary+"40"), display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:18, color:T.primary }}>
              {(NAV_ITEMS.find(n=>n.id===activeTab)||{}).icon}
            </div>
            <div style={{ fontSize:16, color:T.muted, marginBottom:6 }}>{(NAV_ITEMS.find(n=>n.id===activeTab)||{}).label}</div>
            <div style={{ fontSize:13, color:T.muted2 }}>Coming up next - we will build this together</div>
          </div>
        )}
      </div>
    </div>
  );
}
