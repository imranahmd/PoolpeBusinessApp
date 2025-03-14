import PDFLib, {PDFDocument, PDFPage} from 'react-native-pdf-lib';
import {Buffer} from 'buffer';

export const createPdf = async panDocumentBase64 => {
  try {
    const page = PDFPage.create()
      .setMediaBox(200, 200)
      .drawImage(panDocumentBase64, 'jpg', {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      });

    const pdfPath = await PDFDocument.create().addPages(page).write();

    return pdfPath;
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
};
