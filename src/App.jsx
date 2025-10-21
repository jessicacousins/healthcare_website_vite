import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Templates from "./pages/Templates.jsx";
import Flagged from "./pages/Flagged.jsx";
import FormBuilder from "./pages/FormBuilder.jsx";
import PdfTools from "./pages/PdfTools.jsx";
import AdminTools from "./pages/AdminTools.jsx";
import TourForm from "./pages/TourForm.jsx";
import StaffCompliance from "./pages/StaffCompliance.jsx";
import CaseFileChecklist from "./pages/CaseFileChecklist.jsx";
import HomeSafetyAssessment from "./pages/HomeSafetyAssessment.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/flagged" element={<Flagged />} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/pdf-tools" element={<PdfTools />} />
        <Route path="/admin-tools" element={<AdminTools />} />
        <Route path="/tour-form" element={<TourForm />} />
        <Route path="/staff-compliance" element={<StaffCompliance />} />
        <Route path="/home-safety" element={<HomeSafetyAssessment />} />
        <Route path="/case-file-checklist" element={<CaseFileChecklist />} />
      </Routes>
      <Footer />
    </>
  );
}
