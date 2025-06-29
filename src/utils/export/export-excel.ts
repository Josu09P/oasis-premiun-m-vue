import ExcelJS from 'exceljs'

export async function exportToExcel(
  data: any[],
  columns: { header: string; key: string; width?: number }[],
  filename: string
) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Datos')
  sheet.columns = columns
  data.forEach((item) => sheet.addRow(item))

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
