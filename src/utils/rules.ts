import * as yup from 'yup'

const schema = yup.object({
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
    .oneOf([yup.ref('password')], 'The passwords do not match')
})

export const schemaRegister = schema
export type TRegisterSchema = yup.InferType<typeof schemaRegister>

export const schemaLogin = schema.omit(['confirm_password'])
export type TLoginSchema = yup.InferType<typeof schemaLogin>
