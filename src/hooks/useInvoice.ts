import { useCallback, useRef } from "react";
import { Order } from "@/store/slices/orderSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

export function useInvoice() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generateInvoicePDF = useCallback(async (order: Order) => {
    const element = invoiceRef.current;
    
    if (!element) {
      toast.error("Invoice template not found");
      return;
    }

    try {
      toast.loading("Generating invoice...", { id: "invoice-gen" });
      
      // Make the element visible temporarily
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.display = "block";
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${order.orderNumber}.pdf`);
      
      // Hide the element again
      element.style.display = "none";
      
      toast.success("Invoice downloaded!", { id: "invoice-gen" });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice", { id: "invoice-gen" });
    }
  }, []);

  return {
    invoiceRef,
    generateInvoicePDF,
  };
}
