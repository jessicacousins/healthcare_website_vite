import React, { useMemo, useState } from "react";
import { downloadElementAsPDF } from "../util/pdf.js";

function blankModule() {
  return {
    title: "",
    goalStatement: "",
    measurableObjectives: "",
    strategies: "",
    frequency: "",
    duration: "",
    responsible: "",
    materials: "",
    environment: "",
    dataMethod: "Trial-based",
    masteryCriteria: "80% across 3 consecutive sessions",
    reviewDate: "",
    notes: "",
    images: [], // data URLs
  };
}

function readFilesAsDataURLs(fileList) {
  const files = Array.from(fileList || []);
  return Promise.all(
    files.map(
      (f) =>
        new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(f);
        })
    )
  );
}

export default function CurriculumBuilder() {
  // Header/meta
  const [orgName, setOrgName] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const [meta, setMeta] = useState({
    client: "",
    dob: "",
    planStart: "",
    planEnd: "",
    author: "",
    context: "Day Habilitation / Community-Based",
  });

  // Cover / summary note
  const [summary, setSummary] = useState("");

  // Modules
  const [modules, setModules] = useState([
    blankModule(),
    blankModule(),
    blankModule(),
  ]);

  const totals = useMemo(
    () => ({
      modules: modules.length,
      images: modules.reduce((a, m) => a + (m.images?.length || 0), 0),
    }),
    [modules]
  );

  const onLogoFile = (file) => {
    if (!file) return setLogoSrc("");
    const r = new FileReader();
    r.onload = () => setLogoSrc(String(r.result));
    r.readAsDataURL(file);
  };

  const updateMeta = (patch) => setMeta((m) => ({ ...m, ...patch }));

  const addModule = () => setModules((l) => [...l, blankModule()]);
  const addFive = () =>
    setModules((l) => [...l, ...Array.from({ length: 5 }, blankModule)]);
  const clearModules = () => setModules([]);
  const duplicateModule = (i) =>
    setModules((l) => {
      const next = [...l];
      next.splice(i + 1, 0, { ...l[i], images: [...(l[i].images || [])] });
      return next;
    });
  const removeModule = (i) => setModules((l) => l.filter((_, k) => k !== i));

  const updateModule = (i, patch) =>
    setModules((l) => {
      const next = [...l];
      next[i] = { ...next[i], ...patch };
      return next;
    });

  const onModuleImages = async (i, files) => {
    const urls = await readFilesAsDataURLs(files);
    setModules((l) => {
      const next = [...l];
      next[i] = { ...next[i], images: [...(next[i].images || []), ...urls] };
      return next;
    });
  };
  const removeModuleImage = (i, imgIdx) =>
    setModules((l) => {
      const next = [...l];
      const imgs = [...(next[i].images || [])];
      imgs.splice(imgIdx, 1);
      next[i].images = imgs;
      return next;
    });

  const exportPdf = async () => {
    const base = meta.client
      ? meta.client.trim().replace(/\s+/g, "_")
      : "Curriculum";
    await downloadElementAsPDF("curriculum-preview", `${base}_Curriculum.pdf`);
  };

  return (
    <div className="layout">
      <div className="kicker">Curriculum</div>
      <div className="h1">Curriculum Builder (Client-Side)</div>
      <p className="inline-help">
        Build goal-based modules with measurable objectives, strategies, and
        data plans. Attach images. Export a PDF. Nothing is stored; all
        processing happens in your browser.
      </p>

      <div className="grid grid-2">
        {/* Editor */}
        <section className="card">
          <div className="kicker">Header</div>
          <div className="grid grid-3">
            <div>
              <div className="label">Organization</div>
              <input
                className="input"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Company / Program"
              />
            </div>
            <div>
              <div className="label">Plan Start</div>
              <input
                className="input"
                type="date"
                value={meta.planStart}
                onChange={(e) => updateMeta({ planStart: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Plan End</div>
              <input
                className="input"
                type="date"
                value={meta.planEnd}
                onChange={(e) => updateMeta({ planEnd: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Client</div>
              <input
                className="input"
                value={meta.client}
                onChange={(e) => updateMeta({ client: e.target.value })}
              />
            </div>
            <div>
              <div className="label">DOB</div>
              <input
                className="input"
                type="date"
                value={meta.dob}
                onChange={(e) => updateMeta({ dob: e.target.value })}
              />
            </div>
            <div>
              <div className="label">Author</div>
              <input
                className="input"
                value={meta.author}
                onChange={(e) => updateMeta({ author: e.target.value })}
                placeholder="Preparer name / role"
              />
            </div>
            <div>
              <div className="label">Context</div>
              <input
                className="input"
                value={meta.context}
                onChange={(e) => updateMeta({ context: e.target.value })}
                placeholder="Program / CBDS / Home / Community"
              />
            </div>
            <div>
              <div className="label">Logo (optional)</div>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => onLogoFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="divider"></div>

          <div className="kicker">Overview</div>
          <div>
            <div className="label">Summary / Rationale</div>
            <textarea
              className="input"
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Program goals, strengths, needs, clinical rationale…"
            />
          </div>

          <div className="divider"></div>

          <div className="kicker">Modules</div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              margin: "8px 0",
            }}
          >
            <button className="btn" onClick={addModule}>
              Add Module
            </button>
            <button className="btn" onClick={addFive}>
              Add 5 Modules
            </button>
            <button className="btn warn" onClick={clearModules}>
              Clear
            </button>
            <span className="pill">Modules: {totals.modules}</span>
            <span className="pill">Images: {totals.images}</span>
          </div>

          {modules.length === 0 ? (
            <div className="tag">No modules yet. Click “Add Module”.</div>
          ) : (
            modules.map((m, i) => (
              <div key={i} className="card" style={{ marginBottom: 12 }}>
                <div className="kicker">Module {i + 1}</div>
                <div className="grid grid-3">
                  <div>
                    <div className="label">Title / Area</div>
                    <input
                      className="input"
                      value={m.title}
                      onChange={(e) =>
                        updateModule(i, { title: e.target.value })
                      }
                      placeholder="e.g., Communication: Requesting"
                    />
                  </div>
                  <div>
                    <div className="label">Data Method</div>
                    <select
                      className="input"
                      value={m.dataMethod}
                      onChange={(e) =>
                        updateModule(i, { dataMethod: e.target.value })
                      }
                    >
                      <option>Trial-based</option>
                      <option>Duration</option>
                      <option>Frequency</option>
                      <option>Interval</option>
                      <option>Task Analysis</option>
                    </select>
                  </div>
                  <div>
                    <div className="label">Review Date</div>
                    <input
                      className="input"
                      type="date"
                      value={m.reviewDate}
                      onChange={(e) =>
                        updateModule(i, { reviewDate: e.target.value })
                      }
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="label">Goal Statement</div>
                    <textarea
                      className="input"
                      rows={3}
                      value={m.goalStatement}
                      onChange={(e) =>
                        updateModule(i, { goalStatement: e.target.value })
                      }
                      placeholder="Functional goal stated in client-friendly terms…"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="label">Measurable Objectives</div>
                    <textarea
                      className="input"
                      rows={3}
                      value={m.measurableObjectives}
                      onChange={(e) =>
                        updateModule(i, {
                          measurableObjectives: e.target.value,
                        })
                      }
                      placeholder="Objective 1…&#10;Objective 2…"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="label">
                      Teaching Strategies / Activities
                    </div>
                    <textarea
                      className="input"
                      rows={3}
                      value={m.strategies}
                      onChange={(e) =>
                        updateModule(i, { strategies: e.target.value })
                      }
                      placeholder="DTT / NET procedures, prompting, generalization contexts…"
                    />
                  </div>

                  <div>
                    <div className="label">Frequency</div>
                    <input
                      className="input"
                      value={m.frequency}
                      onChange={(e) =>
                        updateModule(i, { frequency: e.target.value })
                      }
                      placeholder="e.g., 3x/week"
                    />
                  </div>
                  <div>
                    <div className="label">Duration (per session)</div>
                    <input
                      className="input"
                      value={m.duration}
                      onChange={(e) =>
                        updateModule(i, { duration: e.target.value })
                      }
                      placeholder="e.g., 30 minutes"
                    />
                  </div>
                  <div>
                    <div className="label">Responsible Staff</div>
                    <input
                      className="input"
                      value={m.responsible}
                      onChange={(e) =>
                        updateModule(i, { responsible: e.target.value })
                      }
                      placeholder="e.g., RBT / BCBA / DSP"
                    />
                  </div>

                  <div>
                    <div className="label">Materials</div>
                    <textarea
                      className="input"
                      rows={2}
                      value={m.materials}
                      onChange={(e) =>
                        updateModule(i, { materials: e.target.value })
                      }
                      placeholder="Visuals, AAC, token board, task items…"
                    />
                  </div>
                  <div>
                    <div className="label">Environment / Adaptations</div>
                    <textarea
                      className="input"
                      rows={2}
                      value={m.environment}
                      onChange={(e) =>
                        updateModule(i, { environment: e.target.value })
                      }
                      placeholder="Seating, sensory supports, accessibility…"
                    />
                  </div>
                  <div>
                    <div className="label">Mastery Criteria</div>
                    <input
                      className="input"
                      value={m.masteryCriteria}
                      onChange={(e) =>
                        updateModule(i, { masteryCriteria: e.target.value })
                      }
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="label">Notes</div>
                    <textarea
                      className="input"
                      rows={2}
                      value={m.notes}
                      onChange={(e) =>
                        updateModule(i, { notes: e.target.value })
                      }
                      placeholder="Generalization plan, safety notes, collaboration items…"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="label">Attach Images (optional)</div>
                    <input
                      className="input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => onModuleImages(i, e.target.files)}
                    />
                    {m.images?.length ? (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          marginTop: 8,
                        }}
                      >
                        {m.images.map((src, idx) => (
                          <div key={idx} style={{ position: "relative" }}>
                            <img
                              src={src}
                              alt=""
                              style={{
                                width: 120,
                                height: 90,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid var(--border, #e1e4e8)",
                              }}
                            />
                            <button
                              className="btn danger"
                              style={{
                                position: "absolute",
                                right: 4,
                                top: 4,
                                padding: "2px 6px",
                                fontSize: 11,
                              }}
                              onClick={() => removeModuleImage(i, idx)}
                              type="button"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <button className="btn" onClick={() => duplicateModule(i)}>
                    Duplicate
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => removeModule(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <button className="btn ok" onClick={exportPdf}>
              Download PDF
            </button>
            <span className="inline-help">
              PDF is generated locally from the preview.
            </span>
          </div>
        </section>

        {/* Preview for PDF */}
        <section className="card">
          <div className="kicker">Preview</div>
          <div className="h1">Curriculum Plan</div>

          <div id="curriculum-preview" className="preview-surface">
            <header
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 10,
              }}
            >
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt="Logo"
                  style={{ maxHeight: 56, maxWidth: 200, objectFit: "contain" }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>{orgName || "Organization"}</h2>
                <div style={{ color: "#566", fontSize: 12 }}>
                  Plan: {meta.planStart || "—"} to {meta.planEnd || "—"}
                </div>
              </div>
              <span className="file-pill">Generated Preview</span>
            </header>

            <div className="grid grid-3" style={{ marginBottom: 8 }}>
              <div>
                <strong>Client:</strong> {meta.client || "—"}
              </div>
              <div>
                <strong>DOB:</strong> {meta.dob || "—"}
              </div>
              <div>
                <strong>Author:</strong> {meta.author || "—"}
              </div>
              <div>
                <strong>Context:</strong> {meta.context || "—"}
              </div>
              <div>
                <strong>Modules:</strong> {totals.modules}
              </div>
              <div>
                <strong>Images:</strong> {totals.images}
              </div>
            </div>

            {summary ? (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  Summary / Rationale
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>{summary}</div>
              </div>
            ) : null}

            {/* Module printout */}
            {modules.length === 0 ? (
              <div className="tag">No modules yet.</div>
            ) : (
              modules.map((m, i) => (
                <article key={i} className="card" style={{ marginBottom: 10 }}>
                  <div className="kicker">Module {i + 1}</div>
                  <h3 style={{ marginTop: 4, marginBottom: 8 }}>
                    {m.title || "—"}
                  </h3>
                  <table
                    className="aba-grid"
                    style={{ width: "100%", marginBottom: 8 }}
                  >
                    <tbody>
                      <tr>
                        <th style={{ width: 220 }}>Goal Statement</th>
                        <td>{m.goalStatement || "—"}</td>
                      </tr>
                      <tr>
                        <th>Measurable Objectives</th>
                        <td style={{ whiteSpace: "pre-wrap" }}>
                          {m.measurableObjectives || "—"}
                        </td>
                      </tr>
                      <tr>
                        <th>Teaching Strategies / Activities</th>
                        <td style={{ whiteSpace: "pre-wrap" }}>
                          {m.strategies || "—"}
                        </td>
                      </tr>
                      <tr>
                        <th>Schedule</th>
                        <td>
                          <div>
                            <strong>Frequency:</strong> {m.frequency || "—"}
                          </div>
                          <div>
                            <strong>Duration:</strong> {m.duration || "—"}
                          </div>
                          <div>
                            <strong>Responsible:</strong> {m.responsible || "—"}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>Materials</th>
                        <td style={{ whiteSpace: "pre-wrap" }}>
                          {m.materials || "—"}
                        </td>
                      </tr>
                      <tr>
                        <th>Environment / Adaptations</th>
                        <td style={{ whiteSpace: "pre-wrap" }}>
                          {m.environment || "—"}
                        </td>
                      </tr>
                      <tr>
                        <th>Data Method</th>
                        <td>{m.dataMethod || "—"}</td>
                      </tr>
                      <tr>
                        <th>Mastery Criteria</th>
                        <td>{m.masteryCriteria || "—"}</td>
                      </tr>
                      <tr>
                        <th>Review Date</th>
                        <td>{m.reviewDate || "—"}</td>
                      </tr>
                      <tr>
                        <th>Notes</th>
                        <td style={{ whiteSpace: "pre-wrap" }}>
                          {m.notes || "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {m.images?.length ? (
                    <>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>
                        Images
                      </div>
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        {m.images.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt=""
                            style={{
                              width: 140,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 6,
                              border: "1px solid var(--border, #e1e4e8)",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </article>
              ))
            )}

            <footer style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
              <em>
                Generated locally. Not saved or transmitted. Use your official
                EHR/EMR for retention and signatures per policy.
              </em>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}
