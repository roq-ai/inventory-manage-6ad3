import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';

import { salesValidationSchema } from 'validationSchema/sales';
import { InventoryInterface } from 'interfaces/inventory';
import { CustomerInterface } from 'interfaces/customer';
import { SalesInterface } from 'interfaces/sales';

function SalesCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: SalesInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.sales.create({ data: values as RoqTypes.sales });
      resetForm();
      router.push('/sales');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SalesInterface>({
    initialValues: {
      quantity: 0,
      total_price: 0,
      sale_date: new Date(new Date().toDateString()),
      product_id: (router.query.product_id as string) ?? null,
      customer_id: (router.query.customer_id as string) ?? null,
    },
    validationSchema: salesValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Sales',
              link: '/sales',
            },
            {
              label: 'Create Sales',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Sales
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Quantity"
            formControlProps={{
              id: 'quantity',
              isInvalid: !!formik.errors?.quantity,
            }}
            name="quantity"
            error={formik.errors?.quantity}
            value={formik.values?.quantity}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Total Price"
            formControlProps={{
              id: 'total_price',
              isInvalid: !!formik.errors?.total_price,
            }}
            name="total_price"
            error={formik.errors?.total_price}
            value={formik.values?.total_price}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="sale_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Sale Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.sale_date ? new Date(formik.values?.sale_date) : null}
              onChange={(value: Date) => formik.setFieldValue('sale_date', value)}
            />
          </FormControl>
          <AsyncSelect<InventoryInterface>
            formik={formik}
            name={'product_id'}
            label={'Select Inventory'}
            placeholder={'Select Inventory'}
            fetcher={() => roqClient.inventory.findManyWithCount({})}
            labelField={'product_name'}
          />
          <AsyncSelect<CustomerInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select Customer'}
            placeholder={'Select Customer'}
            fetcher={() => roqClient.customer.findManyWithCount({})}
            labelField={'first_name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/sales')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'sales',
    operation: AccessOperationEnum.CREATE,
  }),
)(SalesCreatePage);
