"use client"
import { getRestaurantReport } from '@/lib/api';
import { SensorLocation } from '@smartcampus/types';
import { useEffect, useRef, useState } from 'react';
import { DatePicker } from './DatePicker';

async function openPdfInNewTab(device_id: string, date : Date | undefined){
  try {
    const file = await getRestaurantReport(device_id, date);
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
  const [date, setDate] = useState<Date>(); // The date is not set here because of compiler type errors
  
  useEffect(()=>{
    setDate(new Date()); // Avoid compiler type errors
  }, []);

  return (
    <div className='border-2 mt-2 p-2'>
      <div ref={pdfRef}>
        <h1>Relatório - {sensor.name}</h1>
      </div>
      <DatePicker date={date} setDate={setDate}/>
      <button
        onClick={()=>openPdfInNewTab(sensor.id, date)}
        className='border m-2 rounded-md p-2'
      >
        Baixar PDF
      </button>
    </div>
  );
};

export default PDFGenerator;
