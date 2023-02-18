import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';

export interface Props {
  name: string;
  control: UseControllerProps<any>['control'];
  defaultValue?: UseControllerProps['defaultValue'];
  options: { label: string; value: string }[];
  rules?: UseControllerProps['rules'];
  value?: string;
}

export default function Select({
  control,
  defaultValue,
  name,
  ...props
}: Props) {
  return (
    <Controller
      defaultValue={defaultValue ?? props.value}
      control={control}
      rules={props.rules}
      name={name}
      render={({ field }) => (
        <Picker
          selectedValue={field.value}
          onValueChange={(itemValue, _itemIndex) => field.onChange(itemValue)}
        >
          {props.options.map((it) => (
            <Picker.Item key={it.value} label={it.label} value={it.value} />
          ))}
        </Picker>
      )}
    />
  );
}
