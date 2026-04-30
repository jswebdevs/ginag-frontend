"use client";

import { CreditCard, Truck, Smartphone } from "lucide-react";

interface PaymentProps {
  paymentMethod: "COD" | "MFS";
  setPaymentMethod: (method: "COD" | "MFS") => void;
  mfsInfo: any;
  setMfsInfo: (info: any) => void;
  totalPayable: number;
}

export default function Payment({ paymentMethod, setPaymentMethod, mfsInfo, setMfsInfo, totalPayable }: PaymentProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <CreditCard className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
      </div>

      <div className="space-y-4">
        {/* COD Option */}
        <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-muted-foreground'}`}>
              {paymentMethod === 'COD' && <div className="w-3 h-3 bg-primary rounded-full" />}
            </div>
            <div>
              <h3 className="font-bold text-foreground">Cash on Delivery</h3>
              <p className="text-sm text-muted-foreground">Pay in cash when your order arrives.</p>
            </div>
          </div>
          <Truck className={`w-6 h-6 ${paymentMethod === 'COD' ? 'text-primary' : 'text-muted-foreground'}`} />
          <input type="radio" className="hidden" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
        </label>

        {/* Manual Mobile Banking (MFS) Option */}
        <label className={`flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'MFS' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'MFS' ? 'border-primary' : 'border-muted-foreground'}`}>
                {paymentMethod === 'MFS' && <div className="w-3 h-3 bg-primary rounded-full" />}
              </div>
              <div>
                <h3 className="font-bold text-foreground">Mobile Banking (Manual)</h3>
                <p className="text-sm text-muted-foreground">bKash, Nagad, Rocket, Upay</p>
              </div>
            </div>
            <Smartphone className={`w-6 h-6 ${paymentMethod === 'MFS' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <input type="radio" className="hidden" name="payment" checked={paymentMethod === 'MFS'} onChange={() => setPaymentMethod('MFS')} />

          {/* Expandable Info Section for MFS */}
          {paymentMethod === 'MFS' && (
            <div className="mt-4 pt-4 border-t border-border/50 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="bg-background border border-border p-4 rounded-xl text-sm">
                <p className="font-semibold mb-2 text-foreground">Instructions:</p>
                <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                  <li>Open your Mobile Banking app.</li>
                  <li>Select <strong>Send Money</strong>.</li>
                  <li>Send exactly <strong className="text-foreground">BDT {totalPayable.toFixed(2)}</strong> to <strong className="text-primary font-bold text-base tracking-wider ml-1">01881176704</strong>.</li>
                  <li>Enter the Transaction ID (TrxID) and your phone number below.</li>
                </ol>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select 
                  value={mfsInfo.provider}
                  onChange={(e) => setMfsInfo({...mfsInfo, provider: e.target.value})}
                  className="px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground font-medium"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Upay">Upay</option>
                </select>
                <input 
                  type="text" 
                  required={paymentMethod === 'MFS'}
                  placeholder="Sender Number (e.g. 018...)" 
                  value={mfsInfo.senderNumber}
                  onChange={(e) => setMfsInfo({...mfsInfo, senderNumber: e.target.value})}
                  className="px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                />
                <input 
                  type="text" 
                  required={paymentMethod === 'MFS'}
                  placeholder="Transaction ID (TrxID)" 
                  value={mfsInfo.transactionId}
                  onChange={(e) => setMfsInfo({...mfsInfo, transactionId: e.target.value})}
                  className="sm:col-span-2 px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground uppercase placeholder:normal-case"
                />
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}