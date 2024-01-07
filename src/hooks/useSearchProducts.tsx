import useQueryConfig from './useQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import routerName from '@/router/routerName'
import { Schema, schema } from '@/utils/rules'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const onSubmitSearch = handleSubmit((value) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: value.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: value.name
        }

    navigate({
      pathname: routerName.home,
      search: createSearchParams(config).toString()
    })
  })

  return {
    onSubmitSearch,
    register
  }
}
