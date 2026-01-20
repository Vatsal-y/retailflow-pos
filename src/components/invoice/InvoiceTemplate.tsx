import { forwardRef } from "react";
import { Order } from "@/store/slices/orderSlice";
import { format, parseISO } from "date-fns";

interface InvoiceTemplateProps {
  order: Order;
  storeName?: string;
  branchName?: string;
  cashierName?: string;
  shiftId?: string;
  customerPhone?: string;
  loyaltyPoints?: number;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order, storeName = "POS Pro", branchName = "Galaxy Mall - Branch A", cashierName = "John Doe", shiftId = "SHIFT001", customerPhone, loyaltyPoints }, ref) => {
    const pointsEarned = Math.round(order.total * 0.01);

    return (
      <div 
        ref={ref}
        className="bg-white text-black p-8 w-[210mm] min-h-[297mm] font-mono text-sm"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
          <h1 className="text-2xl font-bold tracking-wider">{storeName}</h1>
          <p className="text-lg font-semibold mt-1">INVOICE</p>
          <p className="text-gray-600 mt-2">{order.orderNumber}</p>
        </div>

        {/* Store Info */}
        <div className="text-center mb-4 text-gray-700">
          <p className="font-semibold">{branchName}</p>
          <p>Date: {format(parseISO(order.createdAt), "dd MMM yyyy, HH:mm")} IST</p>
          <p>Cashier: {cashierName} (Shift #{shiftId})</p>
        </div>

        {/* Customer Info */}
        {(order.customerName && order.customerName !== "Walk-in Customer") && (
          <div className="border border-gray-300 rounded p-3 mb-4">
            <p className="font-bold text-gray-600 mb-1">BILL TO:</p>
            <p className="font-semibold">{order.customerName}</p>
            {customerPhone && <p>{customerPhone}</p>}
            {loyaltyPoints !== undefined && (
              <p className="text-green-700 font-semibold mt-1">
                Loyalty Points Earned: +{pointsEarned}
              </p>
            )}
          </div>
        )}

        {/* Items Table */}
        <div className="mb-4">
          <div className="border-t-2 border-b-2 border-gray-400 py-2 flex font-bold text-gray-700">
            <span className="flex-1">ITEM</span>
            <span className="w-12 text-center">QTY</span>
            <span className="w-24 text-right">RATE</span>
            <span className="w-24 text-right">TOTAL</span>
          </div>
          
          {order.items.map((item, index) => (
            <div key={index} className="flex py-2 border-b border-gray-200">
              <span className="flex-1 truncate pr-2">{item.name}</span>
              <span className="w-12 text-center">{item.quantity}</span>
              <span className="w-24 text-right">₹{item.price.toLocaleString()}</span>
              <span className="w-24 text-right">₹{item.total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t-2 border-gray-400 pt-3 space-y-1">
          <div className="flex justify-between">
            <span>SUBTOTAL:</span>
            <span>₹{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (18%):</span>
            <span>₹{order.tax.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>DISCOUNT:</span>
              <span>-₹{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold border-t-2 border-gray-400 pt-2 mt-2">
            <span>TOTAL AMOUNT:</span>
            <span className="flex items-center gap-2">
              ₹{order.total.toLocaleString()}
              <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">PAID</span>
            </span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Payment:</span>
            <span className="capitalize">{order.paymentMethod} ****1234</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-400 text-center text-gray-600">
          <p className="font-semibold mb-2">Thank you for shopping!</p>
          <p className="text-sm">Visit again to earn more points.</p>
          <div className="mt-6 pt-4 border-t border-gray-300">
            <p className="font-bold">{storeName} - Enterprise POS System</p>
            <p className="text-sm">support@pospro.com | +91 9876543210</p>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="mt-6 flex justify-center">
          <div className="w-24 h-24 border-2 border-gray-400 flex items-center justify-center text-xs text-gray-400">
            [QR Code]
          </div>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";
