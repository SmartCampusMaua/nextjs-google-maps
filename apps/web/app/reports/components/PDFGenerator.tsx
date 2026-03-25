import { useRef } from 'react';

function PDFGenerator() {
  const pdfRef = useRef(null);

  return (
    <div>
      <div ref={pdfRef}>
        <h1>Sample Content</h1>
        <p>This will be included in the PDF.</p>
      </div>
      <button onClick={()=>window.print()}>
        Download PDF
      </button>
    </div>
  );
};

export default PDFGenerator;
