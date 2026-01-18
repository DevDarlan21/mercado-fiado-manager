import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart } from 'lucide-react';
import { Customer, Sale } from '@/types/customer';

interface AddSaleDialogProps {
  customers: Customer[];
  onAdd: (sale: Omit<Sale, 'id' | 'date' | 'signed'>) => { sale: Sale; customer: Customer; isOverLimit: boolean } | null;
  onPrint: (sale: Sale, customer: Customer) => void;
}

export function AddSaleDialog({ customers, onAdd, onPrint }: AddSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [product, setProduct] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !product.trim() || !value) return;

    const result = onAdd({
      customerId,
      product: product.trim(),
      value: parseFloat(value),
    });

    if (result) {
      onPrint(result.sale, result.customer);
      setCustomerId('');
      setProduct('');
      setValue('');
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
      <DialogContent>
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
            <Label htmlFor="product">Produto</Label>
            <Input
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ex: Arroz 5kg, Feijão 1kg..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Registrar e Imprimir Comprovante
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
