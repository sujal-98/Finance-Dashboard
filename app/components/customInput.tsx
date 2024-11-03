import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from '../../@/components/ui/form'
import { Input } from '../../@/components/ui/input'
import { FieldPath, Control } from 'react-hook-form'
import { z } from 'zod'
import { formSchema } from '../../lib/utils'

interface CustomInputProps {
    control: Control<z.infer<typeof formSchema>>
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string,
    type: string
}

const CustomInput: React.FC<CustomInputProps> = ({ control, name, label, placeholder, type }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='form-label'>{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input placeholder={placeholder} {...field} type={type} className='form-label' />
            </FormControl>
            <FormMessage className='form-message mt-2'/>
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput
