import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ExportPDFOptions {
  title: string
  headers: string[]
  data: (string | number)[][]
  fileName: string
}

export async function exportToPDF({ title, headers, data, fileName }: ExportPDFOptions) {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    })

    doc.setFontSize(14)
    doc.text(title, 40, 30)

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 40,
      styles: {
        fontSize: 10,
        overflow: 'linebreak',
        cellWidth: 'wrap',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 50 },   // ID
        1: { cellWidth: 150 },  // Título
        2: { cellWidth: 350 },  // Descripción
        3: { cellWidth: 110 },  // Estado
        4: { cellWidth: 102 },  // Creado
        5: { cellWidth: 102 },  // Actualizado ✅ FALTABA ESTA
      },

      headStyles: {
        fillColor: [220, 53, 69],
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        halign: 'left',
        valign: 'middle',
      },
      margin: { top: 30, left: 40, right: 40, bottom: 40 },
    })

    doc.save(fileName)
  } catch (error) {
    console.error('Error al exportar PDF:', error)
    throw error
  }
}
