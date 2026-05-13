// @/lib/report-generator.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// This interface defines the "Universal" contract
interface UniversalReportData {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  livestock?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  crops?: any[];
  efficiency?: {
    score: string;
    label: string;
  };
}

export const generateUniversalReport = (data: UniversalReportData) => {
  const doc = new jsPDF();
  
  // 1. Unified Branding
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); 
  doc.text(data.title, 14, 22);

  let currentY = 35;

  // 2. Conditional Logic: Add Efficiency if provided
  if (data.efficiency) {
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`System Efficiency: ${data.efficiency.score} (${data.efficiency.label})`, 14, currentY);
    currentY += 15;
  }

  // 3. Conditional Logic: Add Livestock Table if data exists
  if (data.livestock && data.livestock.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Livestock Inventory", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Category', 'Quantity', 'Status']],
      body: data.livestock.map(l => [l.category, l.quantity, l.health_status]),
      headStyles: { fillColor: [249, 115, 22] } // Professional Orange
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // 4. Conditional Logic: Add Crops Table if data exists
  if (data.crops && data.crops.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Crop Assets", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Crop Type', 'Acreage', 'Status']],
      body: data.crops.map(c => [c.crop_type, c.acreage, c.status]),
      headStyles: { fillColor: [16, 185, 129] } // Professional Emerald
    });
  }

  doc.save(`${data.title.toLowerCase().replace(/\s/g, '-')}.pdf`);
}