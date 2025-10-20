import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

export default function TourForm() {
  // Branding
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const onLogoChange = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(r.result.toString());
    r.readAsDataURL(file);
  };

  // Tour basics
  const [clientName, setClientName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [notes, setNotes] = useState("");
  const [tourGuide, setTourGuide] = useState("");
  const [priority, setPriority] = useState("Medium"); // High | Medium | Low

  // NEW info
  const [pcpHistory, setPcpHistory] = useState([{ name:"", practice:"", phone:"", from:"", to:"" }]);
  const addPCP = ()=> setPcpHistory(prev=>[...prev, {name:"", practice:"", phone:"", from:"", to:""}]);
  const updatePCP = (i,k,v)=> setPcpHistory(prev=>{ const n=[...prev]; n[i]={...n[i],[k]:v}; return n; });
  const removePCP = (i)=> setPcpHistory(prev=> prev.filter((_,idx)=>idx!==i));

  const [diagnoses, setDiagnoses] = useState("");
  const [medications, setMedications] = useState([{ name:"", dose:"", route:"", frequency:"", purpose:"", prescriber:"", start:"" }]);
  const addMed = ()=> setMedications(prev=>[...prev, { name:"", dose:"", route:"", frequency:"", purpose:"", prescriber:"", start:"" }]);
  const updateMed = (i,k,v)=> setMedications(prev=>{ const n=[...prev]; n[i]={...n[i],[k]:v}; return n; });
  const removeMed = (i)=> setMedications(prev=> prev.filter((_,idx)=>idx!==i));

  const LEVELS = ["Independent","Supervision","Partial Assist","Full Assist"];
  const [adl, setAdl] = useState({ bathing:"", dressing:"", toileting:"", transferring:"", eating:"", continence:"" });
  const updAdl = (k,v)=> setAdl(prev=>({...prev, [k]:v}));

  const [careNeeds, setCareNeeds] = useState("");
  const [currentServices, setCurrentServices] = useState({
    homeHealth:false, physicalTherapy:false, occupationalTherapy:false, speechTherapy:false,
    behavioralTherapy:false, skilledNursing:false, caseManagement:false, transportation:false,
    dayProgram:false, other:false, otherDetail:"", serviceNotes:""
  });
  const [trauma, setTrauma] = useState({ triggers:"", calmingStrategies:"", notes:"" });

  const fileName = useMemo(() => {
    const base = clientName?.trim() ? clientName.trim().replace(/\s+/g, "_") : "Tour_Form";
    return `${base}_Tour_Form.pdf`;
  }, [clientName]);

  const clear = () => {
    setClientName(""); setGuardianName(""); setLocation(""); setContactPhone(""); setContactEmail("");
    setBirthday(""); setNotes(""); setTourGuide(""); setPriority("Medium");
    setPcpHistory([{name:"",practice:"",phone:"",from:"",to:""}]);
    setDiagnoses(""); setMedications([{ name:"", dose:"", route:"", frequency:"", purpose:"", prescriber:"", start:"" }]);
    setAdl({ bathing:"", dressing:"", toileting:"", transferring:"", eating:"", continence:"" });
    setCareNeeds(""); setCurrentServices({homeHealth:false,physicalTherapy:false,occupationalTherapy:false,speechTherapy:false,behavioralTherapy:false,skilledNursing:false,caseManagement:false,transportation:false,dayProgram:false,other:false,otherDetail:"",serviceNotes:""});
    setTrauma({triggers:"", calmingStrategies:"", notes:""});
  };

  const exportPdf = async () => {
    await downloadElementAsPDF("tour-preview", fileName);
  };

  const Field = ({ label, value }) => (
    <div style={{ display:"grid", gap:4 }}>
      <div style={{ fontSize: 12, color: "#334", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, background: "#fff" }}>
        {value?.toString().trim() ? value : "—"}
      </div>
    </div>
  );

  const Box = ({ checked }) => (
    <span style={{display:"inline-block", width:14, height:14, border:"1px solid #888", borderRadius:2, marginRight:6, textAlign:"center", lineHeight:"14px", fontWeight:700, fontSize:11}}>
      {checked ? "✓" : " "}
    </span>
  );

  return (
    <div className="layout">
      <section className="card">
        <div className="kicker">Form</div>
        <div className="h1">Tour Form</div>
        <p className="inline-help">
          Ephemeral form. Nothing is saved or transmitted. Download your PDF and store it in your approved system.
        </p>

        {/* Branding */}
        <div className="card" style={{ marginTop: 8 }}>
          <div className="kicker">Branding</div>
          <div className="grid grid-2">
            <div>
              <div className="label">Organization (optional)</div>
              <input className="input" value={orgName} onChange={(e)=>setOrgName(e.target.value)} placeholder="Company / Program name" />
            </div>
            <div>
              <div className="label">Logo (optional)</div>
              <input className="input" type="file" accept="image/*" onChange={(e)=>onLogoChange(e.target.files?.[0])} />
              {logoSrc && <div style={{ marginTop: 8 }}><img src={logoSrc} alt="Logo preview" style={{ maxHeight: 48, objectFit:"contain", background:"#fff", padding:6, borderRadius:8, border:"1px solid var(--border)" }} /></div>}
            </div>
          </div>
        </div>

        {/* Basics */}
        <div className="grid grid-2" style={{ marginTop: 12 }}>
          <div>
            <div className="label">Client Name *</div>
            <input className="input" value={clientName} onChange={e=>setClientName(e.target.value)} required />
          </div>
          <div>
            <div className="label">Guardian Name</div>
            <input className="input" value={guardianName} onChange={e=>setGuardianName(e.target.value)} />
          </div>
          <div>
            <div className="label">Location *</div>
            <input className="input" value={location} onChange={e=>setLocation(e.target.value)} required />
          </div>
          <div>
            <div className="label">Birthday *</div>
            <input className="input" type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} required />
          </div>
          <div>
            <div className="label">Contact Phone *</div>
            <input className="input" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} placeholder="(555) 555-5555" required />
          </div>
          <div>
            <div className="label">Contact Email</div>
            <input className="input" type="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} placeholder="name@example.com" />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div className="label">Notes</div>
            <textarea className="textarea" rows={5} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Context, accommodations, scheduling, etc." />
          </div>

          <div>
            <div className="label">Toured By (Staff)</div>
            <input className="input" value={tourGuide} onChange={e=>setTourGuide(e.target.value)} placeholder="Staff name" />
          </div>

          <fieldset className="card" style={{ padding: 12 }}>
            <legend className="label">Priority</legend>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {["High","Medium","Low"].map(p => (
                <label key={p} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="radio" name="priority" value={p} checked={priority === p} onChange={e=>setPriority(e.target.value)} />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* NEW Sections */}
        <div className="card" style={{ marginTop: 12 }}>
          <div className="kicker">Past Primary Care Providers</div>
          {pcpHistory.map((p,i)=> (
            <div key={i} className="card" style={{ padding:12, marginBottom:8 }}>
              <div className="grid grid-3">
                <input className="input" placeholder="Name" value={p.name} onChange={(e)=>updatePCP(i,'name',e.target.value)} />
                <input className="input" placeholder="Practice" value={p.practice} onChange={(e)=>updatePCP(i,'practice',e.target.value)} />
                <input className="input" placeholder="Phone" value={p.phone} onChange={(e)=>updatePCP(i,'phone',e.target.value)} />
                <input className="input" type="date" value={p.from} onChange={(e)=>updatePCP(i,'from',e.target.value)} />
                <input className="input" type="date" value={p.to} onChange={(e)=>updatePCP(i,'to',e.target.value)} />
                <button className="btn warn" onClick={()=>removePCP(i)}>Remove</button>
              </div>
            </div>
          ))}
          <button className="btn ok" onClick={addPCP}>Add PCP</button>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="kicker">Diagnoses</div>
          <textarea className="textarea" rows={4} placeholder="ICD-10 codes or narrative" value={diagnoses} onChange={(e)=>setDiagnoses(e.target.value)} />
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="kicker">Medications</div>
          {medications.map((m, i) => (
            <div key={i} className="card" style={{ padding:12, marginBottom:8 }}>
              <div className="grid grid-3">
                <input className="input" placeholder="Name" value={m.name} onChange={(e)=>updateMed(i,'name',e.target.value)} />
                <input className="input" placeholder="Dose (e.g., 10 mg)" value={m.dose} onChange={(e)=>updateMed(i,'dose',e.target.value)} />
                <input className="input" placeholder="Route (PO, IM, etc.)" value={m.route} onChange={(e)=>updateMed(i,'route',e.target.value)} />
                <input className="input" placeholder="Frequency (BID, qHS…)" value={m.frequency} onChange={(e)=>updateMed(i,'frequency',e.target.value)} />
                <input className="input" placeholder="Purpose" value={m.purpose} onChange={(e)=>updateMed(i,'purpose',e.target.value)} />
                <input className="input" placeholder="Prescriber" value={m.prescriber} onChange={(e)=>updateMed(i,'prescriber',e.target.value)} />
                <input className="input" type="date" placeholder="Start date" value={m.start} onChange={(e)=>updateMed(i,'start',e.target.value)} />
                <button className="btn warn" onClick={()=>removeMed(i)}>Remove</button>
              </div>
            </div>
          ))}
          <button className="btn ok" onClick={addMed}>Add Medication</button>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="kicker">ADL Assistance Levels</div>
          <div className="grid grid-3">
            {Object.keys(adl).map((k)=> (
              <div key={k}>
                <div className="label">{k[0].toUpperCase()+k.slice(1)}</div>
                <select className="select" value={adl[k]} onChange={(e)=>updAdl(k,e.target.value)}>
                  <option value="">—</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="kicker">Type of Care Needed</div>
          <textarea className="textarea" rows={3} placeholder="e.g., 24/7 supervision, wound care, behavioral supports…" value={careNeeds} onChange={(e)=>setCareNeeds(e.target.value)} />
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="kicker">Current Services</div>
          <div className="grid grid-3">
            {Object.keys(currentServices).filter(k=>!['otherDetail','serviceNotes'].includes(k)).map((k)=> (
              <label key={k} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input type="checkbox" checked={!!currentServices[k]} onChange={(e)=>setCurrentServices(prev=>({...prev, [k]: e.target.checked}))} />
                {k.replace(/([A-Z])/g," $1").replace(/^./, c=>c.toUpperCase())}
              </label>
            ))}
            {currentServices.other && (
              <input className="input" placeholder="Other service detail" value={currentServices.otherDetail} onChange={(e)=>setCurrentServices(prev=>({...prev, otherDetail:e.target.value}))} />
            )}
            <div style={{ gridColumn:"1 / -1" }}>
              <textarea className="textarea" rows={2} placeholder="Notes about frequency, providers, schedules…" value={currentServices.serviceNotes} onChange={(e)=>setCurrentServices(prev=>({...prev, serviceNotes:e.target.value}))} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="kicker">Trauma-Informed Care</div>
          <div className="grid grid-3">
            <textarea className="textarea" rows={2} placeholder="Known triggers" value={trauma.triggers} onChange={(e)=>setTrauma(prev=>({...prev, triggers:e.target.value}))} />
            <textarea className="textarea" rows={2} placeholder="Calming strategies that work" value={trauma.calmingStrategies} onChange={(e)=>setTrauma(prev=>({...prev, calmingStrategies:e.target.value}))} />
            <textarea className="textarea" rows={2} placeholder="Notes for staff awareness" value={trauma.notes} onChange={(e)=>setTrauma(prev=>({...prev, notes:e.target.value}))} />
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn ok" onClick={exportPdf}>Download PDF</button>
          <button className="btn ghost" onClick={clear} type="button">Clear</button>
          <span className="inline-help">PDF is rendered locally from the preview below.</span>
        </div>
      </section>

      {/* Printable Preview */}
      <section className="card" style={{ marginTop: 18 }}>
        <div className="kicker">Preview</div>
        <div className="h1">Tour Form — Preview</div>

        <div className="preview-surface" id="tour-preview">
          {/* Header / Branding */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
            {logoSrc && <img src={logoSrc} alt="Organization logo" style={{ maxHeight: 56, maxWidth: 200, objectFit: "contain" }} />}
            <div style={{ flex: 1 }}>
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>Tour Form</h2>
              {orgName && <div style={{ color: "#566", fontSize: 12 }}>{orgName}</div>}
            </div>
            <span className="file-pill">Generated Preview</span>
          </div>

          {/* Basics */}
          <div style={{ display: "grid", gap: 10 }}>
            <Field label="Client Name" value={clientName} />
            <Field label="Guardian Name" value={guardianName} />
            <Field label="Location" value={location} />
            <Field label="Birthday" value={birthday} />
            <Field label="Contact Phone" value={contactPhone} />
            <Field label="Contact Email" value={contactEmail} />
            <Field label="Toured By (Staff)" value={tourGuide} />
            <Field label="Priority" value={priority} />
            <div>
              <div style={{ fontSize: 12, color: "#334", textTransform: "uppercase", letterSpacing: ".05em" }}>Notes</div>
              <div style={{ whiteSpace: "pre-wrap", minHeight: 80, border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
                {notes || "—"}
              </div>
            </div>
          </div>

          {/* NEW Sections mirror Intake for continuity */}
          {pcpHistory.length ? (
            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>Past Primary Care Providers</h3>
              <div style={{ display:"grid", gap:6 }}>
                {pcpHistory.map((p, i) => (
                  <div key={i} style={{ border:"1px solid #ddd", padding:10, borderRadius:8, background:"#fff" }}>
                    {[p?.name, p?.practice, p?.phone].filter(Boolean).join(" — ") || "—"}
                    {(p?.from || p?.to) && <div style={{color:"#555", fontSize:12}}>Dates: {p?.from || "?"} – {p?.to || "?"}</div>}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {(diagnoses && diagnoses.trim()) ? (
            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>Diagnoses</h3>
              <div style={{ border:"1px solid #ddd", padding:10, borderRadius:8, background:"#fff", whiteSpace:"pre-wrap" }}>{diagnoses}</div>
            </section>
          ) : null}

          {medications.length ? (
            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>Medications</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, background:"#fff" }}>
                  <thead>
                    <tr>
                      {["Name","Dose","Route","Frequency","Purpose","Prescriber","Start"].map(h => (
                        <th key={h} style={{ textAlign:"left", borderBottom:"1px solid #ccc", padding:"8px 6px", color:"#223" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((m, i) => (
                      <tr key={i}>
                        <td style={{ borderBottom:"1px solid #eee", padding:"6px" }}>{m?.name || "—"}</td>
                        <td style={{ borderBottom:"1px solid #eee", padding:"6px" }}>{m?.dose || "—"}</td>
                        <td style={{ borderBottom:"1px solid #eee", padding:"6px" }}>{m?.route || "—"}</td>
                        <td style={{ borderBottom:"1px solid #eee", padding:"6px" }}>{m?.frequency || "—"}</td>
                        <td style={{ borderBottom:"1px solid #eee", padding:"6px" }}>{m?.purpose || "—"}</td>
                        <td style={{ borderBottom:"1px solid #eee", padding:"6px" }}>{m?.prescriber || "—"}</td>
                        <td style={{ borderBottom:"1px solid #eee", padding:"6px" }}>{m?.start || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {Object.keys(adl).some(k=>adl[k]) ? (
            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>ADL Assistance</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:8 }}>
                {Object.entries(adl).map(([k,v])=> v ? <Field key={k} label={k[0].toUpperCase()+k.slice(1)} value={v} /> : null)}
              </div>
            </section>
          ) : null}

          {(careNeeds && careNeeds.trim()) ? (
            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>Type of Care Needed</h3>
              <div style={{ border:"1px solid #ddd", padding:10, borderRadius:8, background:"#fff", whiteSpace:"pre-wrap" }}>{careNeeds}</div>
            </section>
          ) : null}

          {Object.values(currentServices).some(Boolean) ? (
            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>Current Services</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:6 }}>
                {[
                  ["Home Health","homeHealth"],
                  ["Physical Therapy","physicalTherapy"],
                  ["Occupational Therapy","occupationalTherapy"],
                  ["Speech Therapy","speechTherapy"],
                  ["Behavioral Therapy","behavioralTherapy"],
                  ["Skilled Nursing","skilledNursing"],
                  ["Case Management","caseManagement"],
                  ["Transportation","transportation"],
                  ["Day Program","dayProgram"],
                ].map(([label,key])=> currentServices[key] ? <div key={key}><Box checked={true}/> {label}</div> : null)}
                {currentServices.other && <div><Box checked={true}/> Other — {currentServices.otherDetail || "—"}</div>}
              </div>
              {currentServices.serviceNotes && (
                <div style={{marginTop:8}}>
                  <div style={{ fontSize: 12, color: "#334", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Notes</div>
                  <div style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, background: "#fff", whiteSpace:"pre-wrap" }}>{currentServices.serviceNotes}</div>
                </div>
              )}
            </section>
          ) : null}

          {(trauma.triggers || trauma.calmingStrategies || trauma.notes) ? (
            <section style={{ marginTop: 12 }}>
              <h3 style={{ margin: "10px 0 6px", color: "#0e1a2b" }}>Trauma-Informed Care</h3>
              <Field label="Known Triggers" value={trauma.triggers} />
              <Field label="Calming Strategies" value={trauma.calmingStrategies} />
              <Field label="Notes (for staff awareness)" value={trauma.notes} />
            </section>
          ) : null}

          <div style={{ marginTop: 14, fontSize: 12, color: "#666" }}>
            <em>Generated locally. This preview is not saved or transmitted.</em>
          </div>
        </div>
      </section>
    </div>
  );
}