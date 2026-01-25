import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface CarrierData {
  carrier: {
    legalName: string;
    dbaName: string;
    dotNumber: string;
    mcNumber: string;
    address: {
      city: string;
      state: string;
    };
    phone: string;
  };
  authority: {
    commonStatus: string;
    bipdInsurance: string;
    cargoInsurance: string;
  };
  safety: {
    rating: string;
  };
  basics: {
    unsafeDriving: { percentile: number } | null;
    hoursOfService: { percentile: number } | null;
    vehicleMaintenance: { percentile: number } | null;
    crashIndicator: { percentile: number } | null;
    driverFitness: { percentile: number } | null;
    controlledSubstances: { percentile: number } | null;
  };
  fleet: {
    powerUnits: number;
    drivers: number;
    mcs150Date: string;
  };
  crashes: {
    fatal: number;
    injury: number;
    towAway: number;
    total: number;
  };
}

// Calculate risk grade for PDF
function calculateRiskGradeForPdf(data: CarrierData): { grade: string; label: string } {
  let score = 100;
  
  if (data.authority.commonStatus === 'REVOKED') score -= 50;
  else if (data.authority.commonStatus === 'INACTIVE' || data.authority.commonStatus === 'NOT AUTHORIZED') score -= 40;
  
  const bipdAmount = parseInt(data.authority.bipdInsurance?.replace(/[^0-9]/g, '') || '0');
  const cargoAmount = parseInt(data.authority.cargoInsurance?.replace(/[^0-9]/g, '') || '0');
  if (bipdAmount < 750000) score -= 15;
  if (cargoAmount < 100000) score -= 10;
  
  const basicScores = [
    data.basics.unsafeDriving?.percentile,
    data.basics.hoursOfService?.percentile,
    data.basics.vehicleMaintenance?.percentile,
    data.basics.crashIndicator?.percentile,
    data.basics.driverFitness?.percentile,
  ].filter(s => s !== null && s !== undefined) as number[];
  
  basicScores.forEach(percentile => {
    if (percentile >= 75) score -= 8;
    else if (percentile >= 65) score -= 4;
  });
  
  if (data.crashes.fatal > 0) score -= 15 * data.crashes.fatal;
  if (data.crashes.injury > 0) score -= 5 * Math.min(data.crashes.injury, 3);
  
  if (data.safety.rating === 'UNSATISFACTORY') score -= 25;
  else if (data.safety.rating === 'CONDITIONAL') score -= 15;
  
  if (score >= 90) return { grade: 'A+', label: 'Excellent' };
  if (score >= 80) return { grade: 'A', label: 'Very Good' };
  if (score >= 70) return { grade: 'B', label: 'Good' };
  if (score >= 60) return { grade: 'C', label: 'Moderate' };
  if (score >= 45) return { grade: 'D', label: 'Concerning' };
  return { grade: 'F', label: 'High Risk' };
}

export function generateCarrierComparisonPdf(carriers: CarrierData[]): void {
  const doc = new jsPDF({
    orientation: carriers.length > 2 ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const primaryColor: [number, number, number] = [34, 197, 94]; // TruMove green
  const darkColor: [number, number, number] = [15, 23, 42]; // Slate-900

  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('TruMove Carrier Safety Report', margin, 12);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('FMCSA Verified Carrier Comparison', margin, 20);

  // Date
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, pageWidth - margin - 60, 12);

  // Reset text color
  doc.setTextColor(...darkColor);

  // Carrier count badge
  doc.setFontSize(9);
  doc.text(`${carriers.length} Carrier${carriers.length > 1 ? 's' : ''} Compared`, pageWidth - margin - 60, 20);

  let yPos = 38;

  // Comparison Table
  const tableData = carriers.map(c => {
    const riskGrade = calculateRiskGradeForPdf(c);
    return [
      c.carrier.dbaName || c.carrier.legalName,
      `DOT ${c.carrier.dotNumber}`,
      riskGrade.grade,
      c.authority.commonStatus,
      c.authority.bipdInsurance || 'N/A',
      c.safety.rating || 'Not Rated',
      `${c.fleet.powerUnits} units`,
      `${c.crashes.total} (${c.crashes.fatal} fatal)`
    ];
  });

  (doc as any).autoTable({
    startY: yPos,
    head: [['Carrier Name', 'DOT #', 'Grade', 'Authority', 'BIPD Insurance', 'Safety Rating', 'Fleet Size', 'Crashes (24mo)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 'auto' },
      2: { halign: 'center', fontStyle: 'bold' },
      3: { halign: 'center' },
      7: { halign: 'center' }
    },
    margin: { left: margin, right: margin }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // BASIC Scores Section for each carrier
  if (yPos + 60 < pageHeight - 30) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CSA BASIC Safety Scores', margin, yPos);
    yPos += 6;

    const basicData = carriers.map(c => {
      return [
        c.carrier.dbaName || c.carrier.legalName,
        c.basics.unsafeDriving?.percentile ?? 'N/A',
        c.basics.hoursOfService?.percentile ?? 'N/A',
        c.basics.vehicleMaintenance?.percentile ?? 'N/A',
        c.basics.driverFitness?.percentile ?? 'N/A',
        c.basics.crashIndicator?.percentile ?? 'N/A',
        c.basics.controlledSubstances?.percentile ?? 'N/A'
      ];
    });

    (doc as any).autoTable({
      startY: yPos,
      head: [['Carrier', 'Unsafe Driving', 'HOS Compliance', 'Vehicle Maint.', 'Driver Fitness', 'Crash Indicator', 'Controlled Subst.']],
      body: basicData,
      theme: 'grid',
      headStyles: {
        fillColor: darkColor,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' }
      },
      margin: { left: margin, right: margin },
      didParseCell: function(data: any) {
        // Color code BASIC scores
        if (data.section === 'body' && data.column.index > 0) {
          const value = parseInt(data.cell.raw);
          if (!isNaN(value)) {
            if (value >= 75) {
              data.cell.styles.textColor = [220, 38, 38]; // Red
              data.cell.styles.fontStyle = 'bold';
            } else if (value >= 65) {
              data.cell.styles.textColor = [217, 119, 6]; // Amber
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.textColor = [22, 163, 74]; // Green
            }
          }
        }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  }

  // Footer
  const footerY = pageHeight - 12;
  doc.setFillColor(250, 250, 250);
  doc.rect(0, footerY - 8, pageWidth, 20, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Data sourced from FMCSA SAFER Web Services | Generated by TruMove Carrier Vetting Tool', margin, footerY);
  doc.text('This report is for informational purposes only. Verify all data at safer.fmcsa.dot.gov', margin, footerY + 4);

  // Disclaimer
  if (yPos + 30 < footerY - 15) {
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    const disclaimer = 'Pursuant to 49 U.S.C. 31144 and 49 CFR Part 385, carriers are evaluated under the FMCSA Safety Measurement System (SMS). Higher BASIC percentiles indicate worse performance. Scores ≥65% may trigger FMCSA intervention. BIPD minimum: $750K for general freight.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - (margin * 2));
    doc.text(splitDisclaimer, margin, yPos + 5);
  }

  // Save
  const timestamp = new Date().toISOString().split('T')[0];
  doc.save(`TruMove-Carrier-Report-${timestamp}.pdf`);
}
