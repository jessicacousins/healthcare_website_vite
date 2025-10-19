import React, { useState } from "react";
import { mergePdfFiles, imagesToPdf, textToPdf } from "../util/pdf.js";

export default function PdfTools() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [text, setText] = useState("");

  const onMerge = async () => {
    if (!pdfFiles.length) return;
    const bufs = await Promise.all(pdfFiles.map((f) => f.arrayBuffer()));
    const blob = await mergePdfFiles(bufs);
    downloadBlob(blob, "merged.pdf");
  };

  const onImagesToPdf = async () => {
    if (!imageFiles.length) return;
    const blob = await imagesToPdf(imageFiles);
    downloadBlob(blob, "images.pdf");
  };

  const onTextToPdf = async () => {
    if (!text.trim()) return;
    const blob = await textToPdf(text);
    downloadBlob(blob, "text.pdf");
  };

  return (
    <div className="layout">
      <div className="grid grid-2">
        <section className="card">
          <div className="kicker">PDF</div>
          <div className="h1">Merge PDFs</div>
          <p className="inline-help">
            Combine multiple PDFs into one. All locally in your browser.
          </p>
          <input
            className="input"
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => setPdfFiles(Array.from(e.target.files))}
          />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button className="btn ok" onClick={onMerge}>
              Merge & Download
            </button>
            <span className="inline-help">
              {pdfFiles.length
                ? `${pdfFiles.length} selected`
                : "No files chosen"}
            </span>
          </div>
        </section>

        <section className="card">
          <div className="kicker">Images → PDF</div>
          <div className="h1">Create PDF from Images</div>
          <input
            className="input"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
          />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button className="btn ok" onClick={onImagesToPdf}>
              Convert & Download
            </button>
            <span className="inline-help">
              {imageFiles.length
                ? `${imageFiles.length} selected`
                : "No files chosen"}
            </span>
          </div>
        </section>
      </div>

      <div className="grid grid-1" style={{ marginTop: 18 }}>
        <section className="card">
          <div className="kicker">Text → PDF</div>
          <div className="h1">Compose Simple Document</div>
          <textarea
            className="textarea"
            rows={8}
            placeholder="Paste or type text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div style={{ marginTop: 10 }}>
            <button className="btn ok" onClick={onTextToPdf}>
              Download PDF
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
