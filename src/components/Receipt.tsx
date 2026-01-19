import { forwardRef } from 'react';
import { Sale, Customer, PaymentMethod } from '@/types/customer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceiptProps {
  sale: Sale;
  customer: Customer;
  marketName?: string;
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  cartao: 'Cartão',
  cheque: 'Cheque',
};

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
            <span>Vencimento:</span>
            <span className="font-bold text-destructive">
              {format(new Date(sale.dueDate), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cliente:</span>
            <span className="text-right max-w-[150px] truncate">{customer.name}</span>
          </div>
        </div>

        <div className="border-t-2 border-b-2 border-dashed border-foreground py-4 my-4">
          <div className="mb-2">
            <span className="font-bold">PRODUTOS:</span>
          </div>
          <div className="space-y-1 mb-4">
            {sale.items.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="flex-1 truncate mr-2">{item.product}</span>
                <span>R$ {item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-dashed border-foreground pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL:</span>
              <span>R$ {sale.totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs">
            <span>Dívida Anterior:</span>
            <span>R$ {(customer.currentDebt - sale.totalValue).toFixed(2)}</span>
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
          <p className="font-bold mt-2">Vencimento: {format(new Date(sale.dueDate), "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = 'Receipt';
