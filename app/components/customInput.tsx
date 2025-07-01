"use client";

import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from '../../@/components/ui/form'
import { Input } from '../../@/components/ui/input'
import { FieldPath, Control } from 'react-hook-form'
import { z } from 'zod'
import { formSchema } from '../../lib/utils'


const schema=formSchema('sign-up')
interface CustomInputProps {
    control: Control<z.infer<typeof schema>>
    name: FieldPath<z.infer<typeof schema>>,
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
        <div className="form-item mb-4">
  <FormLabel className="form-label text-sm font-medium text-gray-700 mb-2">
    {label}
  </FormLabel>
  <div className="flex w-full flex-col">
    <FormControl>
      <Input
        placeholder={placeholder}
        {...field}
        type={type}
        className="form-input w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      />
    </FormControl>
    <FormMessage className="form-message text-xs text-red-500 mt-2" />
  </div>
</div>

      )}
    />
  )
}

export default CustomInput
