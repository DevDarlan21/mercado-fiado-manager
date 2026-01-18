import { Customer, Sale } from '@/types/customer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, ShoppingBag, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';

interface CustomerDetailsProps {
  customer: Customer | null;
  sales: Sale[];
  open: boolean;
  onClose: () => void;
  onPayDebt: (customerId: string, amount: number) => void;
}

export function CustomerDetails({ customer, sales, open, onClose, onPayDebt }: CustomerDetailsProps) {
  const [payAmount, setPayAmount] = useState('');

  if (!customer) return null;

  const usagePercent = (customer.currentDebt / customer.creditLimit) * 100;
  const isOverLimit = customer.currentDebt > customer.creditLimit;

  const handlePay = () => {
    const amount = parseFloat(payAmount);
    if (amount > 0) {
      onPayDebt(customer.id, amount);
      setPayAmount('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {customer.name}
            {isOverLimit && (
              <Badge variant="destructive">Limite Excedido</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {customer.phone}
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Dívida Atual</span>
              <span className="text-2xl font-bold">R$ {customer.currentDebt.toFixed(2)}</span>
            </div>
            <Progress 
              value={Math.min(usagePercent, 100)} 
              className={isOverLimit ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Limite: R$ {customer.creditLimit.toFixed(2)}</span>
              <span>Disponível: R$ {Math.max(0, customer.creditLimit - customer.currentDebt).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="Valor do pagamento"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
            <Button onClick={handlePay} disabled={!payAmount || parseFloat(payAmount) <= 0}>
              <DollarSign className="h-4 w-4 mr-1" />
              Receber
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Histórico de Compras
            </h3>
            {sales.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma compra registrada
              </p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {sales.slice().reverse().map(sale => (
                  <div 
                    key={sale.id}
                    className="bg-secondary/50 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{sale.product}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(sale.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {sale.value.toFixed(2)}</p>
                      {sale.signed && (
                        <Badge variant="outline" className="text-xs">Assinado</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
