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

import { inventoryValidationSchema } from 'validationSchema/inventories';
import { CompanyInterface } from 'interfaces/company';
import { InventoryInterface } from 'interfaces/inventory';

function InventoryCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: InventoryInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.inventory.create({ data: values as RoqTypes.inventory });
      resetForm();
      router.push('/inventories');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InventoryInterface>({
    initialValues: {
      product_name: '',
      product_description: '',
      quantity: 0,
      cost_price: 0,
      selling_price: 0,
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: inventoryValidationSchema,
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
              label: 'Inventories',
              link: '/inventories',
            },
            {
              label: 'Create Inventory',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Inventory
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.product_name}
            label={'Product Name'}
            props={{
              name: 'product_name',
              placeholder: 'Product Name',
              value: formik.values?.product_name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.product_description}
            label={'Product Description'}
            props={{
              name: 'product_description',
              placeholder: 'Product Description',
              value: formik.values?.product_description,
              onChange: formik.handleChange,
            }}
          />

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
            label="Cost Price"
            formControlProps={{
              id: 'cost_price',
              isInvalid: !!formik.errors?.cost_price,
            }}
            name="cost_price"
            error={formik.errors?.cost_price}
            value={formik.values?.cost_price}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('cost_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Selling Price"
            formControlProps={{
              id: 'selling_price',
              isInvalid: !!formik.errors?.selling_price,
            }}
            name="selling_price"
            error={formik.errors?.selling_price}
            value={formik.values?.selling_price}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('selling_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={() => roqClient.company.findManyWithCount({})}
            labelField={'name'}
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
              onClick={() => router.push('/inventories')}
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
    entity: 'inventory',
    operation: AccessOperationEnum.CREATE,
  }),
)(InventoryCreatePage);
