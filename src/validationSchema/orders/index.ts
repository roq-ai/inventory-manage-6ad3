import * as yup from 'yup';

export const orderValidationSchema = yup.object().shape({
  total_price: yup.number().integer().required(),
  order_date: yup.date().required(),
  status: yup.string().required(),
  customer_id: yup.string().nullable().required(),
});
