export interface Customer {
  id: string;
  name: string;
  phone: string;
  creditLimit: number;
  currentDebt: number;
  createdAt: Date;
}

export interface Sale {
  id: string;
  customerId: string;
  product: string;
  value: number;
  date: Date;
  signed: boolean;
}

export interface SaleWithCustomer extends Sale {
  customerName: string;
}
