import { Injectable } from "@nestjs/common";
import * as Excel from "exceljs";
import { resolve } from "path";

@Injectable()
export class ExcelService {
  /**
   * Generate an Excel file with given data and columns.
   * @param data - The data to populate the sheet.
   * @param columns - Array defining headers, keys, and column widths.
   * @param sheetName - Name of the Excel sheet.
   */
  async generateExcel(
    data: any[],
    columns: Array<{ header: string; key: string; width: number }>,
    sheetName: string,
  ) {
    const workbook = new Excel.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(sheetName);

    // Set worksheet columns
    worksheet.columns = columns;

    // Add rows to the worksheet
    if (Array.isArray(data) && data.length) worksheet.addRows(data);

    // Generate a file path and save the file
    const fileName = `file-${Date.now()}.xlsx`;
    const filePath = resolve(`${__dirname}/../attachments/${fileName}`);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  /**
   * Read data from an Excel file on disk.
   * @param filePath - Path to the Excel file.
   * @returns Parsed data from the first worksheet.
   */
  async readExcel(filePath: string) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0]; // Read the first worksheet
    const data: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Skip header row; adapt this logic as needed
        const rowData = row.values as any[]; // Use row.values for row data
        data.push(rowData);
      }
    });

    return data;
  }

  /**
   * Read data from an uploaded Excel file (buffer).
   * @param file - Uploaded file (Express.Multer.File).
   * @returns Parsed data from the first worksheet.
   */
  async readExcelData(file: Express.Multer.File) {
    try {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0]; // Read the first worksheet
      const data: any[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const rowData = Array.isArray(row.values)
            ? (row.values.slice(1) as any[])
            : [];
          // const rowData = row.values as any[]; // Use row.values for row data
          data.push(rowData);
        }
      });
      return data;
    } catch (error) {
      console.error("Error reading Excel file:", error);
      throw error;
    }
  }
}
