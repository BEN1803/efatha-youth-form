import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Import the autotable plugin
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data } = await supabaseAdmin.from("candidates").select("*");

  const doc = new jsPDF();

  // 1. Add Titles / Headers
  doc.setFontSize(14);
  doc.text("Zoezi la ukusanyaji taarifa za vijana KANISA LA EFATHA", 14, 15);
  doc.setFontSize(12);
  doc.text("KITUO: EFATHA KIGAMBONI", 14, 23);

  // 2. Prepare the table headers and body data
  const tableHeaders = [["No.", "Jina Kamili", "Jinsia", "Umri", "Kazi", "Simu"]];
  
  const tableRows = data ? data.map((d, i) => [
    i + 1, // This forces the ID to count sequentially from 1, ignoring DB gaps
    d.jina || "-",
    d.jinsia || "-",
    d.umri || "-",
    d.kazi || "-",
    d.simu || "-"
  ]) : [];

  // 3. Generate the Table
  autoTable(doc, {
    startY: 30, // Starts the table right below your titles
    head: tableHeaders,
    body: tableRows,
    theme: "striped", // Adds a nice alternating row background
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 15 }, // Makes the ID column smaller
    },
  });

  const pdf = doc.output("arraybuffer");

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}