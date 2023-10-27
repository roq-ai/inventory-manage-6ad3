import { SalesInterface } from 'interfaces/sales';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface InventoryInterface {
  id?: string;
  product_name: string;
  product_description?: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  sales?: SalesInterface[];
  company?: CompanyInterface;
  _count?: {
    sales?: number;
  };
}

export interface InventoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  product_name?: string;
  product_description?: string;
  company_id?: string;
}
