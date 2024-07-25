import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';
import { randomBytes } from 'crypto';
import { stringify } from 'csv-stringify/sync';
import adminHandler from '@/admin_handler';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { numAccounts } = req.body;
    const logins = await DB.instance.get_logins();
    const loginCodes = [];

    for (let i = 0; i < numAccounts; i++) {
        const login_code = generateRandomSixDigitNumber();
        await DB.instance.create_login(login_code);
        logins.push({ login_code: login_code, voted: 'false' });
        loginCodes.push(login_code);
    }

    const pdfBytes = await generatePDF(loginCodes);
    const csv = stringify(logins, { header: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=logins.pdf');
    res.send(Buffer.from(pdfBytes));
}

export default adminHandler(handler);


const generateRandomSixDigitNumber = () => {
    const randomNumber = randomBytes(3).readUIntBE(0, 3);
    const sixDigitNumber = (randomNumber % 900000) + 100000;
    return sixDigitNumber.toString().padStart(6, '0');
};

const generatePDF = async (loginCodes: string[]) => {
    const pdfDoc = await PDFDocument.create();
    const mmToPoints = (mm: number) => mm * 2.83465;
    const qrSize = mmToPoints(80);
    const margin = 10;
    const pageWidth = qrSize;
    const pageHeight = qrSize + margin;

    const qrPromises = loginCodes.map(async code => {
        const url = `https://bsc.quest-crusaders.de/auto_login?code=${code}`;
        return await QRCode.toDataURL(url);
    });

    const qrCodes = await Promise.all(qrPromises);

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - qrSize - margin;

    for (let index = 0; index < qrCodes.length; index++) {
        if (yPosition < margin) {
            yPosition = pageHeight - qrSize - margin;
            page = pdfDoc.addPage([pageWidth, pageHeight]);
        }

        const qrCode = qrCodes[index];
        const qrImage = await pdfDoc.embedPng(qrCode);
        page.drawImage(qrImage, {
            x: (pageWidth - qrSize) / 2,
            y: yPosition,
            width: qrSize,
            height: qrSize
        });

        page.drawText(loginCodes[index], {
            x: (pageWidth - qrSize) / 2,
            y: yPosition - 15,
            size: 12,
            color: rgb(0, 0, 0),
        });

        yPosition -= (qrSize + margin);
    }

    return await pdfDoc.save();
};
