import { InventoryInterface } from 'interfaces/inventory';
import { CustomerInterface } from 'interfaces/customer';
import { GetQueryInterface } from 'interfaces';

export interface SalesInterface {
  id?: string;
  product_id: string;
  customer_id: string;
  quantity: number;
  total_price: number;
  sale_date?: any;
  created_at?: any;
  updated_at?: any;

  inventory?: InventoryInterface;
  customer?: CustomerInterface;
  _count?: {};
}

export interface SalesGetQueryInterface extends GetQueryInterface {
  id?: string;
  product_id?: string;
  customer_id?: string;
}
