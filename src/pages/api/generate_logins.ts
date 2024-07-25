import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';
import { randomBytes } from 'crypto';
import { stringify } from 'csv-stringify/sync';
import adminHandler from '@/admin_handler';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

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
    const pageWidth = mmToPoints(80);
    const pageLegth = mmToPoints(210)
    const margin = mmToPoints(10);
    const maxImageWidth = mmToPoints(70);
    const maxImageHeight = mmToPoints(230)
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const qrPromises = loginCodes.map(async code => {
        const url = `https://bsc.quest-crusaders.de/auto_login?code=${code}`;
        return await QRCode.toDataURL(url);
    });

    const qrCodes = await Promise.all(qrPromises);

    const logoImageBytes = fs.readFileSync(path.resolve('src/app/images/logo.png'));
    const qcLogoImageBytes = fs.readFileSync(path.resolve('src/app/images/qc_logo.png'));

    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const qcLogoImage = await pdfDoc.embedPng(qcLogoImageBytes);

    let page = pdfDoc.addPage([pageWidth, pageLegth]); // Set initial page height equal to width
    let yPosition = page.getHeight() - margin;

    for (let index = 0; index < qrCodes.length; index++) {
        if (yPosition < margin * 6 + maxImageWidth * 3) { // Ensure enough space for remaining content
            page = pdfDoc.addPage([pageWidth, pageLegth]);
            yPosition = page.getHeight() - margin;
        }

        // Add main logo
        const logoDims = logoImage.scaleToFit(maxImageWidth, maxImageWidth);
        page.drawImage(logoImage, {
            x: (pageWidth - logoDims.width) / 2,
            y: yPosition - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });
        yPosition -= logoDims.height + margin;

        // Add text "Scan the QR code to login"
        const text1 = 'Scan the QR code to login';
        const text1Width = font.widthOfTextAtSize(text1, 12);
        page.drawText(text1, {
            x: (pageWidth - text1Width) / 2,
            y: yPosition - 15,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
        });
        yPosition -= 25;

        // Add QR code
        const qrCode = qrCodes[index];
        const qrImage = await pdfDoc.embedPng(qrCode);
        const qrDims = qrImage.scaleToFit(maxImageWidth, maxImageWidth);
        page.drawImage(qrImage, {
            x: (pageWidth - qrDims.width) / 2,
            y: yPosition - qrDims.height,
            width: qrDims.width,
            height: qrDims.height,
        });
        yPosition -= qrDims.height + margin;

        // Add login code text
        const text2 = `Your Personal login code: ${loginCodes[index]}`;
        const text2Width = font.widthOfTextAtSize(text2, 12);
        page.drawText(text2, {
            x: (pageWidth - text2Width) / 2,
            y: yPosition - 15,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
        });
        yPosition -= 25;

        // Add secondary logo
        const qcLogoDims = qcLogoImage.scaleToFit(maxImageWidth, maxImageWidth);
        page.drawImage(qcLogoImage, {
            x: (pageWidth - qcLogoDims.width) / 2,
            y: yPosition - qcLogoDims.height,
            width: qcLogoDims.width,
            height: qcLogoDims.height,
        });
        yPosition -= qcLogoDims.height + margin;

        // Add text "Subscribe to our newsletter"
        const text3 = 'Subscribe to our newsletter';
        const text3Width = font.widthOfTextAtSize(text3, 12);
        page.drawText(text3, {
            x: (pageWidth - text3Width) / 2,
            y: yPosition - 15,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
        });
        yPosition -= 25;

        // Add text "quest-crusaders.de"
        const text4 = 'quest-crusaders.de';
        const text4Width = font.widthOfTextAtSize(text4, 12);
        page.drawText(text4, {
            x: (pageWidth - text4Width) / 2,
            y: yPosition - 15,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
        });
        yPosition -= 25;
        const text5 = '--------------------------------------------------------------------------------------------';
        const text5Width = font.widthOfTextAtSize(text4, 12);
        page.drawText(text5, {
            x: 0,
            y: yPosition - 15,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
        });
        yPosition -= 25;
    }

    return await pdfDoc.save();
};
