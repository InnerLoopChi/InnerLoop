import { useState, useEffect, useRef } from "react";

/* ─── Scroll reveal hook ─────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function R({ children, className = "", delay = 0 }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Icons (inline SVG to avoid deps) ───────────── */
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const MapPin = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Heart = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const Building = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>;
const Shield = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>;
const StarIcon = ({ size = 20, color = "currentColor", filled = false }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const Zap = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Arrow = ({ size = 14, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const Users = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Sparkle = ({ size = 14, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>;
const Clock = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Coins = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>;
const ChevDown = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const ChevUp = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
const MenuIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const XIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

/* ─── Color constants ────────────────────────────── */
const C = { red: "#f18989", purple: "#8B6897", gray: "#e8e6e6", green: "#0a3200", blue: "#aFD2E9" };

/* ─── Styles ─────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  ::selection { background: ${C.blue}; color: ${C.green}; }
  @keyframes float { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-18px) scale(1.08); } }
  @keyframes gentleBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
`;

/* ─── Navbar ─────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, transition:"all 0.3s", background: scrolled ? "rgba(255,255,255,0.92)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.05)" : "none" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px" }}>
        <a href="#" style={{ fontFamily:"Outfit,sans-serif", fontSize:24, fontWeight:800, color:C.green, textDecoration:"none", letterSpacing:"-0.02em" }}>
          Inner<span style={{ background:`linear-gradient(135deg, ${C.purple}, ${C.red})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Loop</span>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:32, fontSize:14, fontWeight:500 }} className="desktop-nav">
          {["Mission","How It Works","Rewards"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`} style={{ color:C.green, opacity:0.6, textDecoration:"none", transition:"opacity 0.2s" }} onMouseEnter={e=>e.target.style.opacity=1} onMouseLeave={e=>e.target.style.opacity=0.6}>{l}</a>
          ))}
          <a href="#join" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:50, background:C.green, color:"#fff", fontSize:12, fontWeight:600, textDecoration:"none", transition:"all 0.3s" }}>
            Join the Loop <Arrow size={13} color="#fff" />
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Floating dots ──────────────────────────────── */
function Dots() {
  const dots = [
    { c: C.red, x: "12%", y: "25%", s: 10, d: "4s" },
    { c: C.purple, x: "28%", y: "50%", s: 14, d: "5s" },
    { c: C.blue, x: "50%", y: "18%", s: 16, d: "6s" },
    { c: C.red, x: "65%", y: "60%", s: 10, d: "4.5s" },
    { c: C.purple, x: "80%", y: "35%", s: 12, d: "5.5s" },
  ];
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {dots.map((d,i) => (
        <div key={i} style={{ position:"absolute", left:d.x, top:d.y, width:d.s, height:d.s, borderRadius:"50%", background:d.c, opacity:0.2, animation:`float ${d.d} ease-in-out infinite alternate`, animationDelay:`${i*0.5}s` }} />
      ))}
    </div>
  );
}

/* ─── Feed Card Mock ─────────────────────────────── */
function FeedCard() {
  return (
    <div style={{ position:"relative", width:330 }}>
      <div style={{ position:"absolute", top:-16, left:-16, width:"100%", height:"100%", borderRadius:24, background:`linear-gradient(135deg, ${C.blue}66, ${C.purple}33)`, transform:"rotate(3deg)" }} />
      <div style={{ position:"absolute", top:-8, right:-12, width:"100%", height:"100%", borderRadius:24, background:`linear-gradient(135deg, ${C.red}33, ${C.blue}1a)`, transform:"rotate(-2deg)" }} />
      <div style={{ position:"relative", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", borderRadius:24, boxShadow:`0 25px 50px ${C.green}15`, padding:28, border:"1px solid rgba(255,255,255,0.6)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg, ${C.purple}4d, ${C.purple}1a)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Building size={18} color={C.purple} />
          </div>
          <div>
            <p style={{ fontWeight:600, fontSize:14, fontFamily:"DM Sans,sans-serif" }}>Pilsen Community Center</p>
            <p style={{ fontSize:11, opacity:0.4, display:"flex", alignItems:"center", gap:4 }}><Shield size={10} color={C.purple} /> Inner · Verified</p>
          </div>
        </div>
        <p style={{ fontSize:14, lineHeight:1.6, opacity:0.8, marginBottom:16 }}>Looking for 3 volunteers to help sort donated winter coats this Saturday 🧤</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {[["#volunteer", C.red, `${C.red}1a`], ["#pilsen", C.green, `${C.blue}33`], ["+2 hrs", C.purple, `${C.purple}1a`]].map(([t,c,bg]) => (
            <span key={t} style={{ padding:"6px 12px", borderRadius:50, background:bg, color:c, fontSize:12, fontWeight:500, border:`1px solid ${c}1a` }}>{t}</span>
          ))}
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, opacity:0.5, marginBottom:6 }}>
            <span>2 of 3 spots filled</span>
            <span style={{ color:C.red, fontWeight:500, opacity:1 }}>1 left!</span>
          </div>
          <div style={{ height:8, background:C.gray, borderRadius:50, overflow:"hidden" }}>
            <div style={{ height:"100%", width:"66%", background:`linear-gradient(90deg, ${C.purple}, ${C.red})`, borderRadius:50 }} />
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:`1px solid ${C.gray}` }}>
          <span style={{ fontSize:12, opacity:0.4, display:"flex", alignItems:"center", gap:4 }}><MapPin size={10} /> 0.3 mi away</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.purple, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>Join Task <Arrow size={12} color={C.purple} /></span>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:-16, right:-16, background:`linear-gradient(135deg, ${C.green}, #065f00)`, color:"#fff", fontSize:12, fontWeight:700, padding:"8px 16px", borderRadius:50, boxShadow:"0 8px 20px rgba(10,50,0,0.3)", display:"flex", alignItems:"center", gap:6, animation:"gentleBounce 3s ease-in-out infinite" }}>
        <Zap size={12} color="#fff" /> 2× Waitlist Bonus
      </div>
      <div style={{ position:"absolute", top:-12, right:32, background:"#fff", color:C.purple, fontSize:12, fontWeight:700, padding:"6px 12px", borderRadius:50, boxShadow:"0 4px 12px rgba(0,0,0,0.08)", border:`1px solid ${C.purple}1a`, display:"flex", alignItems:"center", gap:4 }}>
        <StarIcon size={11} color={C.purple} filled /> 4.9
      </div>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", padding:"112px 24px 80px", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-160, right:-160, width:500, height:500, borderRadius:"50%", background:`linear-gradient(135deg, ${C.blue}66, ${C.purple}33)`, filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:-128, width:400, height:400, borderRadius:"50%", background:`linear-gradient(135deg, ${C.red}40, ${C.purple}1a)`, filter:"blur(80px)", pointerEvents:"none" }} />
      <Dots />
      <div style={{ maxWidth:1280, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center", position:"relative", zIndex:10 }}>
        <div>
          <R>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:50, background:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)", border:`1px solid ${C.green}15`, fontSize:14, fontWeight:500, marginBottom:24, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <MapPin size={14} color={C.red} /> Chicago's Neighborhood Network <Sparkle size={14} color={C.purple} />
            </div>
          </R>
          <R delay={100}>
            <h1 style={{ fontFamily:"Outfit,sans-serif", fontSize:"clamp(48px, 6vw, 72px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-0.03em", marginBottom:24 }}>
              Helping the <span style={{ background:`linear-gradient(135deg, ${C.purple}, #a87bb5)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Inner</span><br/>
              as a <span style={{ background:`linear-gradient(135deg, ${C.red}, #e66767)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Looper</span>
            </h1>
          </R>
          <R delay={200}>
            <p style={{ fontSize:18, opacity:0.55, maxWidth:460, lineHeight:1.7, marginBottom:32 }}>
              InnerLoop connects everyday people with trusted local organizations so neighborhoods thrive — one task, one hour, one connection at a time.
            </p>
          </R>
          <R delay={300}>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:32 }}>
              <a href="#join" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"16px 32px", borderRadius:50, background:C.green, color:"#fff", fontWeight:600, fontSize:14, textDecoration:"none", boxShadow:`0 8px 24px ${C.green}30`, transition:"all 0.3s" }}>
                Get Started <Arrow size={16} color="#fff" />
              </a>
              <a href="#how-it-works" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"16px 32px", borderRadius:50, border:`2px solid ${C.green}33`, fontWeight:600, fontSize:14, textDecoration:"none", color:C.green, transition:"all 0.3s" }}>
                See How It Works
              </a>
            </div>
          </R>
          <R delay={400}>
            <div style={{ display:"flex", gap:32, fontSize:13, opacity:0.45 }}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><Users /> 2,400+ on waitlist</span>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><MapPin size={14} /> 38 neighborhoods</span>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><StarIcon size={14} /> 4.9 avg rating</span>
            </div>
          </R>
        </div>
        <R delay={350} className="flex justify-center">
          <FeedCard />
        </R>
      </div>
    </section>
  );
}

/* ─── Mission ────────────────────────────────────── */
function Mission() {
  const cards = [
    { icon: <MapPin size={22} color={C.red} />, title: "Hyper-Local", body: "Every post is tagged by proximity. You see what matters within blocks, not boroughs.", grad: [`${C.red}1a`,`${C.red}0d`], bdr: `${C.red}1a` },
    { icon: <Shield size={22} color={C.purple} />, title: "Trust Built-In", body: "Verified organizations (Inners) ensure tasks are legit, safe, and completed properly.", grad: [`${C.purple}1a`,`${C.purple}0d`], bdr: `${C.purple}1a` },
    { icon: <Coins size={22} color="#6ba8c7" />, title: "Real Rewards", body: "Earn verified hours and Loop Credits for every task you complete — doubled if you waited.", grad: [`${C.blue}26`,`${C.blue}0d`], bdr: `${C.blue}33` },
  ];
  return (
    <section id="mission" style={{ padding:"80px 24px", background:"#fff", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:800, height:1, background:`linear-gradient(90deg, transparent, ${C.purple}33, transparent)` }} />
      <div style={{ maxWidth:960, margin:"0 auto", textAlign:"center" }}>
        <R><p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.purple, marginBottom:12 }}>Our Mission</p></R>
        <R delay={100}><h2 style={{ fontFamily:"Outfit,sans-serif", fontSize:"clamp(28px, 4vw, 48px)", fontWeight:700, lineHeight:1.2, marginBottom:16 }}>Neighborhoods are strongest when <span style={{ background:`linear-gradient(135deg, ${C.red}, ${C.purple})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>everyone</span> is in the loop.</h2></R>
        <R delay={200}><p style={{ fontSize:18, opacity:0.55, maxWidth:640, margin:"0 auto", lineHeight:1.7 }}>InnerLoop bridges the gap between everyday people and the local organizations that serve them. By making help visible, trackable, and rewarding, we turn disconnected communities into thriving ecosystems.</p></R>
      </div>
      <div style={{ maxWidth:1120, margin:"64px auto 0", display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }}>
        {cards.map((c,i) => (
          <R key={c.title} delay={i * 120}>
            <div style={{ padding:28, borderRadius:16, background:`linear-gradient(180deg, ${c.grad[0]}, ${c.grad[1]})`, border:`1px solid ${c.bdr}`, cursor:"pointer", transition:"all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
              <div style={{ width:48, height:48, borderRadius:12, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", marginBottom:16 }}>{c.icon}</div>
              <h3 style={{ fontFamily:"Outfit,sans-serif", fontSize:18, fontWeight:700, marginBottom:8 }}>{c.title}</h3>
              <p style={{ fontSize:14, opacity:0.55, lineHeight:1.7 }}>{c.body}</p>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────── */
function HowItWorks() {
  const RoleCard = ({ icon, title, subtitle, desc, items, accent }) => (
    <div style={{ borderRadius:24, background:"#fff", border:`1px solid ${accent}26`, padding:32, transition:"all 0.5s", cursor:"pointer" }} onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 20px 50px ${accent}12`; e.currentTarget.style.borderColor=`${accent}4d`; }} onMouseLeave={e => { e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor=`${accent}26`; }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
        <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg, ${accent}33, ${accent}0d)`, display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
        <div>
          <h3 style={{ fontFamily:"Outfit,sans-serif", fontSize:24, fontWeight:700 }}>{title}</h3>
          <p style={{ fontSize:13, opacity:0.45 }}>{subtitle}</p>
        </div>
      </div>
      <p style={{ opacity:0.6, lineHeight:1.7, marginBottom:24 }} dangerouslySetInnerHTML={{ __html: desc }} />
      <ul style={{ listStyle:"none", padding:0 }}>
        {items.map((item,i) => (
          <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12, fontSize:14 }}>
            <span style={{ marginTop:2, width:24, height:24, borderRadius:"50%", background:`${accent}1a`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Arrow size={12} color={accent} />
            </span>
            <span style={{ opacity:0.65 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section id="how-it-works" style={{ padding:"80px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, transparent, ${C.blue}0d, transparent)`, pointerEvents:"none" }} />
      <div style={{ maxWidth:960, margin:"0 auto 64px", textAlign:"center", position:"relative", zIndex:1 }}>
        <R><p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.purple, marginBottom:12 }}>How It Works</p></R>
        <R delay={100}><h2 style={{ fontFamily:"Outfit,sans-serif", fontSize:"clamp(28px, 4vw, 48px)", fontWeight:700 }}>Two roles. One <span style={{ background:`linear-gradient(135deg, ${C.purple}, ${C.red})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Loop</span>.</h2></R>
      </div>
      <div style={{ maxWidth:1120, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, position:"relative", zIndex:1 }}>
        <R><RoleCard icon={<Heart size={26} color={C.red} />} title="Looper" subtitle="Personal Account" accent={C.red} desc={'An everyday person who can both <strong>give help</strong> and <strong>ask for help</strong>. Loopers browse the local feed, pick up tasks, and earn rewards.'} items={["Browse & claim tasks on the local feed","Earn verified hours + Loop Credits","Build your Star Rating through reviews","Join waitlists for full tasks — get 2× rewards"]} /></R>
        <R delay={150}><RoleCard icon={<Building size={26} color={C.purple} />} title="Inner" subtitle="Business / Org Account" accent={C.purple} desc={'A <strong>verified organization</strong> — non-profit, local business, or community group — that posts tasks, manages capacity, and ensures completion.'} items={["Post tasks & manage volunteer capacity","Verify hours and issue Loop Credits","Access the Inner Loop (private B2B feed)","DM other Inners, share space & resources"]} /></R>
      </div>
    </section>
  );
}

/* ─── Rewards ────────────────────────────────────── */
function Rewards() {
  const items = [
    { icon: <StarIcon size={20} color={C.red} />, label: "Star Rating", desc: "Reviewed after every task. 1–5 stars reflect your reliability and effort." },
    { icon: <Clock size={20} color={C.blue} />, label: "Verified Hours", desc: "Logged by Inners once a task is done. Proof of real community impact." },
    { icon: <Coins size={20} color={C.red} />, label: "Loop Credits", desc: "Earned per task. Redeemable at local businesses and partner orgs." },
  ];
  return (
    <section id="rewards" style={{ padding:"80px 24px", background:C.green, color:"#fff", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, right:0, width:384, height:384, borderRadius:"50%", background:`${C.purple}1a`, filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:320, height:320, borderRadius:"50%", background:`${C.red}1a`, filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ maxWidth:960, margin:"0 auto 64px", textAlign:"center", position:"relative", zIndex:1 }}>
        <R><p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.blue, marginBottom:12 }}>Rewards System</p></R>
        <R delay={100}><h2 style={{ fontFamily:"Outfit,sans-serif", fontSize:"clamp(28px, 4vw, 48px)", fontWeight:700 }}>Your time is <span style={{ background:`linear-gradient(135deg, ${C.red}, #f5b0b0)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>valued</span>.</h2></R>
        <R delay={200}><p style={{ opacity:0.45, maxWidth:520, margin:"16px auto 0", lineHeight:1.7 }}>Every task you complete earns you verified hours, a growing Star Rating, and Loop Credits you can redeem with participating organizations.</p></R>
      </div>
      <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24, position:"relative", zIndex:1 }}>
        {items.map((r,i) => (
          <R key={r.label} delay={i*120}>
            <div style={{ borderRadius:16, background:"rgba(255,255,255,0.06)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.08)", padding:28, transition:"all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }} onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}>
              <div style={{ width:48, height:48, borderRadius:12, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>{r.icon}</div>
              <h3 style={{ fontFamily:"Outfit,sans-serif", fontSize:18, fontWeight:700, marginBottom:8 }}>{r.label}</h3>
              <p style={{ fontSize:14, opacity:0.4, lineHeight:1.7 }}>{r.desc}</p>
            </div>
          </R>
        ))}
      </div>
      <R>
        <div style={{ maxWidth:720, margin:"56px auto 0", borderRadius:16, background:`linear-gradient(90deg, ${C.red}33, ${C.purple}33)`, border:`1px solid ${C.red}33`, padding:32, textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, color:C.red, fontWeight:700, fontSize:18, marginBottom:12 }}>
            <Zap size={20} color={C.red} /> Waitlist Reward Multiplier
          </div>
          <p style={{ opacity:0.6, lineHeight:1.7 }}>
            When a task is full, Loopers can join a <strong style={{ opacity:1 }}>waitlist</strong>. If a spot opens and a waitlisted Looper completes the task, their verified hours and Loop Credits are <strong style={{ color:C.red }}>doubled (2×)</strong>. Patience pays.
          </p>
        </div>
      </R>
    </section>
  );
}

/* ─── Privacy ────────────────────────────────────── */
function Privacy() {
  return (
    <section style={{ padding:"80px 24px", background:"#fff" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
        <div>
          <R><p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.purple, marginBottom:12 }}>Privacy & Fairness</p></R>
          <R delay={100}><h2 style={{ fontFamily:"Outfit,sans-serif", fontSize:"clamp(28px, 3.5vw, 40px)", fontWeight:700, marginBottom:24 }}>Fair by design.</h2></R>
          <R delay={200}><p style={{ opacity:0.55, lineHeight:1.7, marginBottom:16 }}>Loopers can never see the full job details of tasks assigned to other Loopers. This prevents bias, mismanagement, and keeps the system balanced for everyone.</p></R>
          <R delay={300}><p style={{ opacity:0.55, lineHeight:1.7 }}>Verified Inners get an exclusive <strong style={{ color:C.purple }}>"Inner Loop"</strong> — a private layer where they can securely DM each other, share event space, or swap resources, completely hidden from the public feed.</p></R>
        </div>
        <R delay={200}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ position:"relative", width:288, height:288 }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:`linear-gradient(135deg, ${C.blue}26, ${C.blue}0d)`, border:`1px solid ${C.blue}33` }} />
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:192, height:192, borderRadius:"50%", background:`linear-gradient(135deg, ${C.purple}26, ${C.purple}0d)`, border:`1px solid ${C.purple}26`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:96, height:96, borderRadius:"50%", background:`linear-gradient(135deg, ${C.green}, #065f00)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 12px 32px ${C.green}33` }}>
                  <Shield size={30} color="#fff" />
                </div>
              </div>
              <span style={{ position:"absolute", top:8, right:0, fontSize:12, fontWeight:700, color:C.purple, background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)", padding:"6px 12px", borderRadius:50, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:`1px solid ${C.purple}1a` }}>Inner Loop</span>
              <span style={{ position:"absolute", bottom:16, left:0, fontSize:12, fontWeight:700, opacity:0.6, background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)", padding:"6px 12px", borderRadius:50, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:`1px solid ${C.blue}1a` }}>Public Feed</span>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Is InnerLoop only for Chicago?", a: "We're launching in Chicago first — neighborhood by neighborhood. Expansion plans depend on community growth." },
    { q: "How do I become a verified Inner?", a: "Organizations apply through our signup flow. We verify legal status, location, and community presence before granting Inner status." },
    { q: "What can I spend Loop Credits on?", a: "Credits are redeemable at participating local businesses and partner orgs — think discounts, event tickets, and community perks." },
    { q: "How does the waitlist bonus work?", a: "If a task is full and you join the waitlist, then complete the task after a spot opens, your verified hours and Loop Credits are doubled." },
  ];
  return (
    <section style={{ padding:"80px 24px" }}>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        <R><p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:C.purple, textAlign:"center", marginBottom:12 }}>FAQ</p></R>
        <R delay={100}><h2 style={{ fontFamily:"Outfit,sans-serif", fontSize:"clamp(28px, 3.5vw, 40px)", fontWeight:700, textAlign:"center", marginBottom:40 }}>Common questions</h2></R>
        {faqs.map((f,i) => (
          <R key={i} delay={i * 80}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width:"100%", textAlign:"left", borderRadius:16, background:"#fff", border:`1px solid ${open === i ? `${C.purple}33` : C.gray}`, padding:24, marginBottom:12, cursor:"pointer", transition:"all 0.3s", boxShadow: open === i ? "0 8px 24px rgba(0,0,0,0.06)" : "none", outline:"none" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600, fontSize:14, paddingRight:16 }}>{f.q}</span>
                <div style={{ width:32, height:32, borderRadius:"50%", background: open === i ? `${C.purple}1a` : C.gray, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.3s" }}>
                  {open === i ? <ChevUp size={16} /> : <ChevDown size={16} />}
                </div>
              </div>
              <div style={{ overflow:"hidden", maxHeight: open === i ? 160 : 0, transition:"max-height 0.3s ease-out", marginTop: open === i ? 16 : 0 }}>
                <p style={{ fontSize:14, opacity:0.55, lineHeight:1.7 }}>{f.a}</p>
              </div>
            </button>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────── */
function JoinCTA() {
  return (
    <section id="join" style={{ padding:"80px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${C.purple}, #6a4d7a, ${C.purple})` }} />
      <div style={{ position:"absolute", top:0, right:0, width:384, height:384, borderRadius:"50%", background:`${C.red}26`, filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:320, height:320, borderRadius:"50%", background:`${C.blue}1a`, filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1, color:"#fff" }}>
        <R><h2 style={{ fontFamily:"Outfit,sans-serif", fontSize:"clamp(28px, 4vw, 48px)", fontWeight:700, marginBottom:16 }}>Ready to join the Loop?</h2></R>
        <R delay={100}><p style={{ opacity:0.6, maxWidth:480, margin:"0 auto 32px", lineHeight:1.7 }}>Whether you're an everyday person looking to help, or an organization ready to mobilize your community — there's a place for you here.</p></R>
        <R delay={200}>
          <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
            <button style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"16px 32px", borderRadius:50, background:"#fff", color:C.purple, fontWeight:700, fontSize:14, border:"none", cursor:"pointer", boxShadow:"0 8px 24px rgba(0,0,0,0.15)", transition:"all 0.3s" }}>
              <Heart size={16} color={C.purple} /> Sign Up as Looper <Arrow size={14} color={C.purple} />
            </button>
            <button style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"16px 32px", borderRadius:50, background:"transparent", color:"#fff", fontWeight:700, fontSize:14, border:"2px solid rgba(255,255,255,0.4)", cursor:"pointer", transition:"all 0.3s" }}>
              <Building size={16} color="#fff" /> Register as Inner
            </button>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:C.green, color:"rgba(255,255,255,0.35)", fontSize:12, padding:"40px 24px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24 }}>
        <p style={{ fontFamily:"Outfit,sans-serif", fontSize:18, fontWeight:800, color:"#fff" }}>
          Inner<span style={{ background:`linear-gradient(135deg, ${C.purple}, ${C.red})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Loop</span>
        </p>
        <p>© 2026 InnerLoop Chicago. All rights reserved.</p>
        <div style={{ display:"flex", gap:24 }}>
          {["Privacy","Terms","Contact"].map(l => (
            <a key={l} href="#" style={{ color:"inherit", textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="inherit"}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── Main App ───────────────────────────────────── */
export default function InnerLoopLanding() {
  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:C.gray, color:C.green, WebkitFontSmoothing:"antialiased", minHeight:"100vh" }}>
      <style>{css}</style>
      <Navbar />
      <Hero />
      <Mission />
      <HowItWorks />
      <Rewards />
      <Privacy />
      <FAQ />
      <JoinCTA />
      <Footer />
    </div>
  );
}
