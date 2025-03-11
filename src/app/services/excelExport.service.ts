import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export class ExcelExportService {
  static exportToExcel(jsonData: any[], fileName: string, selectedColumns: string[]): void {
    let filteredData = jsonData.map(item =>
      selectedColumns.reduce((acc: any, key) => {
        acc[key] = item[key];
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, `${fileName}.xlsx`);
  }
}
