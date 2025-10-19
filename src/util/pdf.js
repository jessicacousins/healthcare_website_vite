import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";

/** Render an HTML element to PDF and trigger download */
export async function downloadElementAsPDF(
  elementId,
  fileName = "document.pdf"
) {
  const node = document.getElementById(elementId);
  if (!node) throw new Error("Preview node not found");
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  const x = (pageWidth - w) / 2;
  const y = 36;
  pdf.addImage(imgData, "PNG", x, y, w, h);
  pdf.save(fileName);
}

/** Merge multiple PDF files (Uint8Array/ArrayBuffer) into one blob */
export async function mergePdfFiles(fileBuffers) {
  const merged = await PDFDocument.create();
  for (const buf of fileBuffers) {
    const doc = await PDFDocument.load(buf);
    const copied = await merged.copyPages(doc, doc.getPageIndices());
    copied.forEach((p) => merged.addPage(p));
  }
  const out = await merged.save();
  return new Blob([out], { type: "application/pdf" });
}

/** Convert images to a single PDF (files: File[]) */
export async function imagesToPdf(files) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  let first = true;
  for (const file of files) {
    const dataUrl = await fileToDataURL(file);
    const img = await loadImage(dataUrl);
    if (!first) pdf.addPage();
    first = false;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
    const w = img.width * ratio,
      h = img.height * ratio;
    const x = (pageWidth - w) / 2,
      y = (pageHeight - h) / 2;
    pdf.addImage(
      dataUrl,
      file.type.includes("png") ? "PNG" : "JPEG",
      x,
      y,
      w,
      h
    );
  }
  return pdf.output("blob");
}

/** Make a simple text PDF */
export async function textToPdf(text) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const lines = pdf.splitTextToSize(text, maxWidth);
  let y = margin;
  const lineHeight = 16;
  for (const line of lines) {
    if (y > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += lineHeight;
  }
  return pdf.output("blob");
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
}
