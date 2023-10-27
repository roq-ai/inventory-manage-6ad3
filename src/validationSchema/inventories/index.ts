import * as yup from 'yup';

export const inventoryValidationSchema = yup.object().shape({
  product_name: yup.string().required(),
  product_description: yup.string().nullable(),
  quantity: yup.number().integer().required(),
  cost_price: yup.number().integer().required(),
  selling_price: yup.number().integer().required(),
  company_id: yup.string().nullable().required(),
});
