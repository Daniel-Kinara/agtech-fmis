import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateFarmReport = (inventory: any) => {
  const doc = new jsPDF()
  const timestamp = new Date().toLocaleString()

  // Header Styling
  doc.setFontSize(20)
  doc.setTextColor(16, 185, 129) // Emerald-600
  doc.text('Mixed Farming Ecosystem Report', 14, 22)
  
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated on: ${timestamp}`, 14, 30)

  // Section 1: Livestock Inventory
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text('Livestock Assets', 14, 45)
  
  autoTable(doc, {
    startY: 50,
    head: [['Category', 'Quantity', 'Health Status']],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: inventory.livestock.map((item: any) => [
      item.category, 
      `${item.quantity} Head`, 
      item.health_status
    ]),
    headStyles: { fillColor: [249, 115, 22] }, // Orange-500
    margin: { left: 14 }
  })

  // Section 2: Crop Acreage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY || 50
  doc.text('Active Crop Acreage', 14, finalY + 15)

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Crop Type', 'Acreage', 'Status']],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: inventory.crops.map((item: any) => [
      item.crop_type, 
      `${item.acreage} Acres`, 
      item.status
    ]),
    headStyles: { fillColor: [16, 185, 129] }, // Emerald-500
  })

  // Save the PDF
  doc.save(`farm-report-${Date.now()}.pdf`)
}