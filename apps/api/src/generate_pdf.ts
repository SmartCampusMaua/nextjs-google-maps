import {charSplit, PDFDocument, StandardFonts} from 'pdf-lib';
import { queryRestaurantsConsumptionFromMonth, queryRestaurantsPayment } from './influx';
import { sensorLocations } from './sensors';
import * as d3 from 'd3';
import {JSDOM} from 'jsdom';
import sharp from 'sharp';

const energyCost = 0.35;

export async function createPDF(device_id : string, date: Date) {
  const file = Bun.file("public/comodatos_template.pdf");
  const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const form = pdfDoc.getForm();

  const page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();
  const sensor = sensorLocations.find((e) => e.id == device_id);
  

  const [beginAndEndOfMonthEnergy, valuesFromMonth] = 
  await Promise.all(
    [queryRestaurantsPayment(device_id, date), queryRestaurantsConsumptionFromMonth(device_id, date)]
  );
  const beginTime = beginAndEndOfMonthEnergy[0]["time"];
  const endTime   = beginAndEndOfMonthEnergy[1]["time"];
  const beginOfMonthEnergy : number = beginAndEndOfMonthEnergy[0]["a_plus"];
  const endOfMonthEnergy : number   = beginAndEndOfMonthEnergy[1]["a_plus"];
  const monthEnergy = endOfMonthEnergy - beginOfMonthEnergy;
  const totalCost = new Intl.NumberFormat("pt-BR",{
    style: "currency",
    currency: "BRL"
  }).format(monthEnergy * energyCost);

  const dateOptions : Intl.DateTimeFormatOptions= {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',    
  };

  const chartSVG = getChart(valuesFromMonth, device_id);  

  const png = await sharp(Buffer.from(chartSVG))
    .png()
    .toBuffer();
  const pngImage = await pdfDoc.embedPng(png);
  // pdfImage.scale()
  const pngDims = pngImage.scale(0.5);
  
  const restaurantName = sensor?.name ?? "";
  form.getTextField("comodato").setText(restaurantName);
  form.getTextField("data_inicio").setText(new Date(beginTime).toLocaleString("pt-BR", dateOptions));
  form.getTextField("data_fim").setText(new Date(endTime).toLocaleString("pt-BR", dateOptions));
  form.getTextField("leitura_anterior").setText(`${beginOfMonthEnergy} kWh`);
  form.getTextField("leitura_atual").setText(`${endOfMonthEnergy} kWh`);
  form.getTextField("consumo").setText(`${monthEnergy.toFixed(2)} kWh`);
  form.getTextField("tarifa").setText(new Intl.NumberFormat("pt-BR", {style: "currency", currency:"BRL"}).format(energyCost));
  form.getTextField("total").setText(totalCost);
  form.getTextField("chart").setImage(pngImage);
  form.flatten();
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


function getChart(valuesFromMonth : [{a_plus : number, day : string}], device_id : string){
  // Declare the chart dimensions and margins.
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="chart"></div></body></html>');
  const window = dom.window;
  const document = window.document;

  const width = 640;
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;


  // Create the SVG container.
  const svg = d3.select(document.body)
    .append("svg")
    .attr('xmlns', 'http://www.w3.org/2000/svg') // Important for valid SVG output
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`);


  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("style", "font: 20px sans-serif")
    .text("Consumo durante o Mês");

  const x = d3.scaleBand()
    .domain(valuesFromMonth.map(d => d.day))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
    .domain([0, d3.max(valuesFromMonth, d => d.a_plus)!]).nice()
    .range([height - marginBottom, marginTop]);

  // Create a bar for each letter.
  const bar = svg.append("g")
    .attr("fill", sensorLocations.find((e) => e.id == device_id)?.displayColor!)
    .selectAll("rect")
    .data(valuesFromMonth)
    .join("rect")
      .style("mix-blend-mode", "multiply") // Darker color when bars overlap during the transition.
      .attr("x", d => x(d.day)!)
      .attr("y", d => y(d.a_plus))
      .attr("height", d => y(0) - y(d.a_plus))
      .attr("width", x.bandwidth());

  // Create the axes.
  const gx = svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);
  
  const gy = svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(
      d3.axisLeft(y)
        .tickFormat((y) => (y).toFixed()))
    .call(g => g.select(".domain").remove());



  // 4. Output the generated HTML/SVG string
  const svgOutput = svg.node();
  return svgOutput!.outerHTML;

}
