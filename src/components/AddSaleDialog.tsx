import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { Customer, Sale, SaleItem, PaymentMethod } from '@/types/customer';

interface AddSaleDialogProps {
  customers: Customer[];
  onAdd: (sale: Omit<Sale, 'id' | 'date' | 'signed' | 'dueDate'>) => { sale: Sale; customer: Customer; isOverLimit: boolean } | null;
  onPrint: (sale: Sale, customer: Customer) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'cheque', label: 'Cheque' },
];

export function AddSaleDialog({ customers, onAdd, onPrint }: AddSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<SaleItem[]>([{ product: '', value: 0 }]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');

  const handleAddItem = () => {
    setItems([...items, { product: '', value: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: string) => {
    const newItems = [...items];
    if (field === 'product') {
      newItems[index].product = value;
    } else {
      newItems[index].value = parseFloat(value) || 0;
    }
    setItems(newItems);
  };

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = items.filter(item => item.product.trim() && item.value > 0);
    if (!customerId || validItems.length === 0) return;

    const result = onAdd({
      customerId,
      items: validItems,
      totalValue,
      paymentMethod,
    });

    if (result) {
      onPrint(result.sale, result.customer);
      setCustomerId('');
      setItems([{ product: '', value: 0 }]);
      setPaymentMethod('dinheiro');
      setOpen(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id === customerId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Nova Venda Fiado
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Venda Fiado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - Dívida: R$ {customer.currentDebt.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCustomer && (
              <p className="text-xs text-muted-foreground">
                Limite disponível: R$ {(selectedCustomer.creditLimit - selectedCustomer.currentDebt).toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Produtos</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Produto
              </Button>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Nome do produto"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    required
                  />
                </div>
                <div className="w-28 space-y-1">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Valor"
                    value={item.value || ''}
                    onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-3 flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold">R$ {totalValue.toFixed(2)}</span>
          </div>

          <Button type="submit" className="w-full" disabled={!customerId || totalValue === 0}>
            Registrar e Imprimir Comprovante
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
