"use client"
import { getRestaurantReport } from '@/lib/api';
import { SensorLocation } from '@smartcampus/types';
import { useRef } from 'react';

async function openPdfInNewTab(device_id: string){
  try {
    const file = await getRestaurantReport(device_id);
    if(file == undefined){
      return;
    }
    const fileURL = URL.createObjectURL(file);

    window.open(fileURL, '_blank');

  } catch (error) {
    console.error("Error opening PDF:", error);
  }
};

function PDFGenerator({sensor} : {sensor : SensorLocation}) {
  const pdfRef = useRef(null);

  return (
    <div className='border-2 mt-2 p-2'>
      <div ref={pdfRef}>
        <h1>Relatório - {sensor.name}</h1>
      </div>
      <button onClick={()=>openPdfInNewTab(sensor.id)} className='border m-2 rounded-md p-2'>
        Baixar PDF
      </button>
    </div>
  );
};

export default PDFGenerator;
