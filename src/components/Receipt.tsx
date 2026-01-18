import { forwardRef } from 'react';
import { Sale, Customer } from '@/types/customer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceiptProps {
  sale: Sale;
  customer: Customer;
  marketName?: string;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ sale, customer, marketName = "MERCADO DO ZÉ" }, ref) => {
    return (
      <div 
        ref={ref}
        className="bg-white p-6 w-[300px] font-mono text-sm print:block"
        style={{ fontFamily: 'Courier New, monospace' }}
      >
        <div className="text-center border-b-2 border-dashed border-foreground pb-4 mb-4">
          <h1 className="text-lg font-bold">{marketName}</h1>
          <p className="text-xs text-muted-foreground">COMPROVANTE DE COMPRA FIADO</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Data:</span>
            <span>{format(new Date(sale.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
          </div>
          <div className="flex justify-between">
            <span>Cliente:</span>
            <span className="text-right max-w-[150px] truncate">{customer.name}</span>
          </div>
        </div>

        <div className="border-t-2 border-b-2 border-dashed border-foreground py-4 my-4">
          <div className="flex justify-between mb-2">
            <span className="font-bold">PRODUTO:</span>
          </div>
          <p className="mb-4">{sale.product}</p>
          
          <div className="flex justify-between text-lg font-bold">
            <span>VALOR:</span>
            <span>R$ {sale.value.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs">
            <span>Dívida Anterior:</span>
            <span>R$ {(customer.currentDebt - sale.value).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Dívida Total:</span>
            <span>R$ {customer.currentDebt.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Limite:</span>
            <span>R$ {customer.creditLimit.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-foreground pt-6 mt-6">
          <p className="text-center text-xs mb-4">ASSINATURA DO CLIENTE</p>
          <div className="border-b border-foreground mx-4 h-8"></div>
          <p className="text-center text-xs mt-2">{customer.name}</p>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-6">
          <p>Obrigado pela preferência!</p>
          <p>Este é um comprovante de dívida.</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = 'Receipt';
