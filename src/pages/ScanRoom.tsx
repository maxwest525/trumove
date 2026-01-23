import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import ScanIntroModal from "@/components/estimate/ScanIntroModal";
import { 
  Scan, Sparkles, ArrowRight, 
  Smartphone, Box, Clock, Shield, Zap, ChevronRight,
  Ruler, Package, Printer, Download, Square, Trash2, ArrowRightLeft,
  Phone, Video
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import previewImage from "@/assets/scan-room-preview.jpg";

// Simulated detected items for the live demo
const DEMO_ITEMS = [
  // Living Room
  { id: 1, name: "3-Seat Sofa", room: "Living Room", weight: 350, cuft: 45, image: "/inventory/living-room/sofa-3-cushion.png" },
  { id: 2, name: "Coffee Table", room: "Living Room", weight: 45, cuft: 8, image: "/inventory/living-room/coffee-table.png" },
  { id: 3, name: "TV Stand", room: "Living Room", weight: 80, cuft: 12, image: "/inventory/living-room/tv-stand.png" },
  { id: 4, name: "Armchair", room: "Living Room", weight: 85, cuft: 18, image: "/inventory/living-room/armchair.png" },
  // Bedroom
  { id: 5, name: "Queen Bed", room: "Bedroom", weight: 180, cuft: 55, image: "/inventory/bedroom/bed-queen.png" },
  { id: 6, name: "Dresser", room: "Bedroom", weight: 150, cuft: 32, image: "/inventory/bedroom/dresser.png" },
  { id: 7, name: "Nightstand", room: "Bedroom", weight: 35, cuft: 6, image: "/inventory/bedroom/nightstand.png" },
  { id: 8, name: "Chest of Drawers", room: "Bedroom", weight: 120, cuft: 24, image: "/inventory/bedroom/chest-of-drawers.png" },
  // Kitchen
  { id: 9, name: "Kitchen Table", room: "Kitchen", weight: 85, cuft: 18, image: "/inventory/kitchen/kitchen-table.png" },
  { id: 10, name: "Kitchen Chair", room: "Kitchen", weight: 20, cuft: 4, image: "/inventory/kitchen/kitchen-chair.png" },
  { id: 11, name: "Microwave", room: "Kitchen", weight: 35, cuft: 3, image: "/inventory/appliances/microwave.png" },
  { id: 12, name: "Bar Stool", room: "Kitchen", weight: 25, cuft: 5, image: "/inventory/kitchen/bar-stool.png" },
];

export default function ScanRoom() {
  const navigate = useNavigate();
  const [detectedItems, setDetectedItems] = useState<typeof DEMO_ITEMS>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);

  // Simulate live detection
  useEffect(() => {
    if (isScanning && detectedItems.length < DEMO_ITEMS.length) {
      const timer = setTimeout(() => {
        setDetectedItems(prev => [...prev, DEMO_ITEMS[prev.length]]);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (detectedItems.length >= DEMO_ITEMS.length) {
      setIsScanning(false);
    }
  }, [isScanning, detectedItems]);

  const handleStartScanClick = () => {
    setShowIntroModal(true);
  };

  const startDemo = () => {
    setDetectedItems([]);
    setIsScanning(true);
  };

  const totalWeight = detectedItems.reduce((sum, item) => sum + item.weight, 0);
  const totalCuFt = detectedItems.reduce((sum, item) => sum + item.cuft, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = format(new Date(), "MMMM d, yyyy");
    
    // Header - Green header bar
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    // Logo text
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("TruMove", 14, 16);
    
    // Date on right
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${currentDate}`, pageWidth - 14, 16, { align: "right" });
    
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("AI Scanned Inventory", 14, 40);

    // Helper function to load image as base64
    const loadImageAsBase64 = (url: string): Promise<string | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#f5f5f5';
              ctx.fillRect(0, 0, 32, 32);
              const scale = Math.min(28 / img.width, 28 / img.height);
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = (32 - scaledWidth) / 2;
              const y = (32 - scaledHeight) / 2;
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
              resolve(canvas.toDataURL('image/png'));
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });
    };

    // Pre-load all images
    const imagePromises = detectedItems.map(async (item) => {
      if (item.image) {
        const base64 = await loadImageAsBase64(item.image);
        return { id: item.id, base64 };
      }
      return { id: item.id, base64: null };
    });
    
    const loadedImages = await Promise.all(imagePromises);
    const imageMap = new Map(loadedImages.map(img => [img.id, img.base64]));
    
    // Table data
    const tableData = detectedItems.map((item, index) => [
      (index + 1).toString(),
      '',
      item.name,
      item.room,
      '1',
      `${item.weight}`,
      `${item.cuft}`,
      `${item.weight}`,
      `${item.cuft}`
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [['#', '', 'Item', 'Room', 'Qty', 'Weight', 'Cu Ft', 'Total Wt', 'Total Cu Ft']],
      body: tableData,
      foot: [[
        '', '', '', '', 'Totals:', '—', '—', 
        `${totalWeight.toLocaleString()} lbs`, 
        `${totalCuFt} cu ft`
      ]],
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 4,
      },
      footStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4,
        minCellHeight: 12,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 14 },
        2: { cellWidth: 38 },
        3: { cellWidth: 28 },
        4: { cellWidth: 12, halign: 'center' },
        5: { cellWidth: 18, halign: 'center' },
        6: { cellWidth: 16, halign: 'center' },
        7: { cellWidth: 22, halign: 'center' },
        8: { cellWidth: 22, halign: 'center' },
      },
      styles: {
        overflow: 'linebreak',
        lineColor: [230, 230, 230],
        lineWidth: 0.5,
      },
      tableLineColor: [200, 200, 200],
      tableLineWidth: 0.5,
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const item = detectedItems[data.row.index];
          if (item) {
            const base64 = imageMap.get(item.id);
            if (base64) {
              try {
                const imgSize = 10;
                const x = data.cell.x + (data.cell.width - imgSize) / 2;
                const y = data.cell.y + (data.cell.height - imgSize) / 2;
                doc.addImage(base64, 'PNG', x, y, imgSize, imgSize);
              } catch (e) {
                // Silently fail
              }
            }
          }
        }
      },
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Generated by TruMove - AI-powered moving quotes", 14, finalY + 12);
    doc.text("www.trumove.com", 14, finalY + 18);
    
    doc.save('trumove-ai-scan-inventory.pdf');
  };

  return (
    <SiteShell>
      <div className="tru-scan-page">
        {/* Trust Strip - Top */}
        <section className="tru-scan-trust-strip-slim">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="tru-scan-trust-row-slim tru-scan-trust-spread">
              <div className="tru-scan-trust-item-slim">
                <Smartphone className="w-3.5 h-3.5" />
                <span>No App Required</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Zap className="w-3.5 h-3.5" />
                <span>500+ Item Types</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Ruler className="w-3.5 h-3.5" />
                <span>Auto Dimensions</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Clock className="w-3.5 h-3.5" />
                <span>Save 30+ Minutes</span>
              </div>
              <div className="tru-scan-trust-item-slim">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </section>

        {/* Centered Header Section */}
        <section className="tru-scan-header-section">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="tru-scan-main-headline">
              Start Your <span className="tru-scan-headline-accent">AI Inventory Analysis</span>
            </h1>
            <p className="tru-scan-main-subheadline">
              Simply scan your rooms and our AI will identify, measure, and catalog every item automatically.
            </p>
            
            <div className="tru-scan-header-buttons">
              <button
                onClick={handleStartScanClick}
                disabled={isScanning}
                className="tru-scan-btn-dark"
              >
                <Sparkles className="w-4 h-4" />
                Start Scanning
              </button>
              <Link to="/online-estimate" className="tru-scan-btn-outline">
                Try Manual Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Scan Intro Modal */}
        <ScanIntroModal 
          isOpen={showIntroModal}
          onClose={() => setShowIntroModal(false)}
          onStartScan={startDemo}
        />

        {/* How It Works - Full Width Dark Divider Bar */}
        <section className="tru-scan-steps-bar">
          <div className="tru-scan-steps-bar-inner">
            <h2 className="tru-scan-steps-bar-title">From Video to Quote in 3 Steps</h2>
            <div className="tru-scan-steps-bar-line" />
            <div className="tru-scan-steps-bar-items">
              <div className="tru-scan-step-bar-item">
                <span className="tru-scan-step-bar-num">1</span>
                <span className="tru-scan-step-bar-label">Record Walkthrough</span>
              </div>
              <ChevronRight className="tru-scan-step-bar-arrow" />
              <div className="tru-scan-step-bar-item">
                <span className="tru-scan-step-bar-num">2</span>
                <span className="tru-scan-step-bar-label">AI Identifies Items</span>
              </div>
              <ChevronRight className="tru-scan-step-bar-arrow" />
              <div className="tru-scan-step-bar-item">
                <span className="tru-scan-step-bar-num">3</span>
                <span className="tru-scan-step-bar-label">Get Your Quote</span>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section - Video + Inventory Table Below */}
        <section className="tru-scan-split-demo">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Scanner Video/Preview */}
            <div className="tru-scan-video-container tru-scan-video-centered">
              <img 
                src={previewImage} 
                alt="AI Room Scanner" 
                className="tru-scan-video-preview"
              />
              
              {/* Always show scanning overlay with grid pattern */}
              <div className="tru-scan-video-overlay">
                <div className="tru-scan-grid-pattern" />
                {isScanning && <div className="tru-scan-video-scanline" />}
              </div>
              
              {/* Status Pills Bar - Left Side */}
              <div className="tru-scan-status-pills tru-scan-status-pills-left">
                <div className="tru-scan-status-pill">
                  <Package className="w-3.5 h-3.5" />
                  <span>{detectedItems.length} items</span>
                </div>
                <div className="tru-scan-status-divider" />
                <div className="tru-scan-status-pill">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{totalWeight.toLocaleString()} lbs</span>
                </div>
                <div className="tru-scan-status-divider" />
                <div className="tru-scan-status-pill">
                  <Box className="w-3.5 h-3.5" />
                  <span>{totalCuFt} cu ft</span>
                </div>
              </div>

              {/* Scan Control Buttons - Bottom Right */}
              <div className="tru-scan-control-pills">
                {isScanning ? (
                  <button 
                    onClick={() => setIsScanning(false)}
                    className="tru-scan-stop-pill"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop Scan</span>
                  </button>
                ) : (
                  <button 
                    onClick={startDemo}
                    className="tru-scan-begin-pill"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Begin AI Inventory Scan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Floating Inventory Bar */}
            {detectedItems.length > 0 && (
              <div className="tru-scan-floating-bar">
                <div className="tru-scan-floating-bar-item">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="tru-scan-floating-bar-value">{detectedItems.length}</span>
                  <span className="tru-scan-floating-bar-label">items</span>
                </div>
                <div className="tru-scan-floating-bar-divider" />
                <div className="tru-scan-floating-bar-item">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <span className="tru-scan-floating-bar-value">{totalWeight.toLocaleString()}</span>
                  <span className="tru-scan-floating-bar-label">lbs</span>
                </div>
                <div className="tru-scan-floating-bar-divider" />
                <div className="tru-scan-floating-bar-item">
                  <Box className="w-4 h-4 text-muted-foreground" />
                  <span className="tru-scan-floating-bar-value">{totalCuFt}</span>
                  <span className="tru-scan-floating-bar-label">cu ft</span>
                </div>
                <Link to="/online-estimate" className="tru-scan-floating-bar-btn">
                  <ArrowRight className="w-4 h-4" />
                  View All
                </Link>
              </div>
            )}

            {/* Inventory Table Below Video */}
            <div className="tru-scan-table-panel">
              <div className="tru-scan-table-header">
                <h3>Your Move <span className="tru-scan-headline-accent">Inventory</span></h3>
              </div>
              
              {detectedItems.length === 0 ? (
                <div className="tru-scan-table-empty">
                  <Scan className="w-8 h-8" />
                  <p>Items will appear here as they're detected</p>
                  <span>Click "Start Scanning" above to begin</span>
                </div>
              ) : (
                <>
                  <div className="tru-scan-table-wrapper">
                    <table className="tru-scan-table">
                      <thead>
                        <tr>
                          <th>ORDER</th>
                          <th>ITEM</th>
                          <th>ROOM</th>
                          <th>QTY</th>
                          <th>WEIGHT (LBS)</th>
                          <th>CU FT</th>
                          <th>TOTAL WEIGHT</th>
                          <th>TOTAL CU FT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detectedItems.map((item, idx) => (
                          <tr key={item.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                            <td className="tru-scan-table-order">{idx + 1}</td>
                            <td className="tru-scan-table-item">
                              <img src={item.image} alt={item.name} />
                              <span>{item.name}</span>
                            </td>
                            <td>{item.room}</td>
                            <td>1</td>
                            <td>{item.weight}</td>
                            <td>{item.cuft}</td>
                            <td className="tru-scan-table-total">{item.weight}</td>
                            <td className="tru-scan-table-total">{item.cuft}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={4}></td>
                          <td className="tru-scan-table-footer-label">Totals:</td>
                          <td>—</td>
                          <td className="tru-scan-table-footer-value">{totalWeight.toLocaleString()} lbs</td>
                          <td className="tru-scan-table-footer-value">{totalCuFt} cu ft</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="tru-scan-table-actions">
                    <button
                      type="button"
                      onClick={handlePrint}
                      disabled={detectedItems.length === 0}
                      className="tru-scan-action-btn"
                    >
                      <Printer className="w-4 h-4" />
                      Print inventory
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      disabled={detectedItems.length === 0}
                      className="tru-scan-action-btn"
                    >
                      <Download className="w-4 h-4" />
                      Download as PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetectedItems([])}
                      disabled={detectedItems.length === 0}
                      className="tru-scan-action-btn tru-scan-action-btn-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Save to localStorage for manual builder sync
                        const inventoryForBuilder = detectedItems.map((item, idx) => ({
                          id: `scanned-${item.id}-${Date.now()}`,
                          name: item.name,
                          room: item.room,
                          quantity: 1,
                          weightEach: item.weight,
                          cubicFeet: item.cuft,
                          imageUrl: item.image,
                        }));
                        localStorage.setItem('tm_scanned_inventory', JSON.stringify(inventoryForBuilder));
                        toast({
                          title: "Inventory synced!",
                          description: "Your scanned items have been added to the manual builder.",
                        });
                        navigate('/online-estimate');
                      }}
                      disabled={detectedItems.length === 0}
                      className="tru-scan-btn-dark"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      Migrate to Manual Builder
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>


        {/* Bottom CTA */}
        <section className="tru-scan-bottom-cta">
          <p className="tru-scan-bottom-text">
            Can't wait? Try our AI-powered inventory tools now.
          </p>
          <div className="tru-scan-bottom-buttons">
            <button
              onClick={() => navigate("/online-estimate")}
              className="tru-scan-alt-btn"
            >
              <Sparkles className="w-4 h-4" />
              Build Inventory Manually
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="tru-scan-bottom-secondary">
            <a href="tel:1-800-555-0123" className="tru-scan-secondary-link">
              <Phone className="w-4 h-4" />
              Prefer to talk?
            </a>
            <Link to="/book" className="tru-scan-secondary-link">
              <Video className="w-4 h-4" />
              Book Video Consult
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
