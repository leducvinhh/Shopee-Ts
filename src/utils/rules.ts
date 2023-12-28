import * as yup from 'yup'

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>): boolean {
  const { price_min, price_max } = this.parent as { price_max: string; price_min: string }

  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }

  return price_min !== '' || price_max !== ''
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(160, 'Email must not exceed 160 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(160, 'Password must not exceed 160 characters'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters')
    .max(160, 'Confirm password must not exceed 160 characters')
    .oneOf([yup.ref('password')], 'The passwords do not match'),

  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is not allowed',
    test: testPriceMinMax
  }),

  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Price is not allowed',
    test: testPriceMinMax
  })
})

export const schemaRegister = schema.pick(['email', 'password', 'confirm_password'])
export type TRegisterSchema = yup.InferType<typeof schemaRegister>

export const schemaLogin = schema.pick(['email', 'password'])
export type TLoginSchema = yup.InferType<typeof schemaLogin>

export type Schema = yup.InferType<typeof schema>
