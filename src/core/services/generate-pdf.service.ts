import { Injectable } from "@nestjs/common";
// import fs from 'fs';
import * as path from "path";
import * as PdfMake from "pdfmake";

interface CallbackPayload {
  base64File: string;
  fileName: string;
}

@Injectable()
export class PdfService {
  // constructor() {}

  private readonly fonts = {
    Maven: {
      normal: path.resolve("./public/assets/fonts/MavenPro-Regular.ttf"),
      bold: path.resolve("./public/assets/fonts/MavenPro-Bold.ttf"),
      italics: path.resolve("./public/assets/fonts/MavenPro-Italic.ttf"),
      bolditalics: path.resolve("./public/assets/fonts/MavenPro-SemiBold.ttf"),
    },
    Roboto: {
      normal: path.resolve("./public/assets/fonts/Roboto-Regular.ttf"),
      bold: path.resolve("./public/assets/fonts/Roboto-Medium.ttf"),
      italics: path.resolve("./public/assets/fonts/Roboto-Italic.ttf"),
      bolditalics: path.resolve(
        "./public/assets/fonts/Roboto-MediumItalic.ttf",
      ),
    },
  };

  async generatePDF(
    documentDefinition: any,
    fileName: string,
    callback: (payload: CallbackPayload) => void,
    errorCallBack: (errorMessage: string) => void,
  ): Promise<void> {
    try {
      console.log(JSON.stringify(documentDefinition));
      const printer = new PdfMake(this.fonts);
      const pdfDocument = printer.createPdfKitDocument(documentDefinition);
      const chunks: Buffer[] = [];
      let result: Buffer;
      fileName = fileName || `${fileName}-${Date.now()}.pdf`;
      // const filePath = path.resolve(
      //   `${__dirname}/@/@/attachments/${fileName}`,
      // );

      // const writeStream = fs.createWriteStream(filePath);
      pdfDocument.on("error", (err) => {
        console.log("error in creating file");
        console.log(err);
        errorCallBack(err.message);
      });

      // pdfDocument.pipe(writeStream);
      pdfDocument.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });
      pdfDocument.on("end", () => {
        result = Buffer.concat(chunks);
        const payload: CallbackPayload = {
          base64File: `data:application/pdf;base64,${result.toString(
            "base64",
          )}`,
          fileName,
        };
        console.log("payload", payload);
        callback(payload);
      });
      pdfDocument.end();
    } catch (e: any) {
      console.log("generatePDF error", e);
    }
  }
}
