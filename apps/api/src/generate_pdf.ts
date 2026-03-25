import {PDFDocument, StandardFonts} from 'pdf-lib';
import { queryRestaurantsPayment } from './influx';
import { sensorLocations } from './sensors';

const energyCost = 0.35;

export async function createPDF(device_id : string) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 30
  const title = 'Relatório de Comodatos';
  const textWidth = font.widthOfTextAtSize(title, fontSize);
  

  const sensor = sensorLocations.find((e) => e.id == device_id);
  

  const beginAndEndOfMonthEnergy = await queryRestaurantsPayment(device_id);
  const beginTime = beginAndEndOfMonthEnergy[0]["time"];
  const endTime   = beginAndEndOfMonthEnergy[1]["time"];
  const beginOfMonthEnergy : number = beginAndEndOfMonthEnergy[0]["a_plus"];
  const endOfMonthEnergy : number   = beginAndEndOfMonthEnergy[1]["a_plus"];
  const monthEnergy = endOfMonthEnergy - beginOfMonthEnergy;
  const totalCost = new Intl.NumberFormat("pt-BR",{
    style: "currency",
    currency: "BRL"
  }).format(monthEnergy * energyCost);
  page.moveDown(30);
  const restaurantName = sensor?.name ?? "";
  page.drawText(`${title}\n
  ${restaurantName}\n
  ${totalCost}\n
  ${new Date(beginTime).toString()}
  ${new Date(endTime).toString()}
`, {
    x: (width - textWidth )/ 2 ,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
  });
 
  const pdfBytes = await pdfDoc.save();
  await Bun.write("report.pdf", pdfBytes);
}


