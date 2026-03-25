"use client"
import dynamic from 'next/dynamic';

const PDFGenerator = dynamic(() => import('./components/PDFGenerator'),{
  loading: () => <p>Loading...</p>,
  ssr: false
});

export default function Page(){
  return (
    <div>
      <PDFGenerator></PDFGenerator>
    </div>
  )
}
