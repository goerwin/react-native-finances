import { Controller, useController, UseControllerProps } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';

// interface Props extends TextInputProps {
//   name: string;
//   control: UseControllerProps<any>['control'];
//   valueAsNumber?: boolean;
//   defaultValue?: UseControllerProps['defaultValue'];
// }

interface BasicProps extends TextInputProps {
  name: string;
  control: UseControllerProps<any>['control'];
  rules?: UseControllerProps['rules'];
  style?: TextStyle;
  defaultValue?: UseControllerProps['defaultValue'];
}

type ValueTypes = 'number' | 'string';

type Props = Omit<BasicProps, 'value'> &
  (
    | {
        valueType: 'number';
        value?: number;
        defaultValue?: number;
      }
    | {
        valueType?: 'string';
        value?: string;
        defaultValue?: string;
      }
  );

function parseValue(val: string, valueType: 'number'): number;
function parseValue(val: string, valueType?: 'string'): string;
function parseValue(val: string, valueType?: ValueTypes): number | string;
function parseValue(val: string, valueType?: ValueTypes): number | string {
  switch (valueType) {
    case 'number':
      return Number(val);
    default:
      return val;
  }
}

export default function Input({
  control,
  defaultValue,
  name,
  ...props
}: Props) {
  return (
    <Controller
      defaultValue={String(defaultValue ?? props.value)}
      control={control}
      rules={props.rules}
      name={name}
      render={({ field }) => (
        <TextInput
          placeholderTextColor="#aaa"
          {...props}
          style={{ ...styles.input, ...props.style }}
          onBlur={field.onBlur}
          value={String(field.value)}
          onChangeText={field.onChange}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgb(88, 96, 100)',
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
    color: '#fff',
  },
});
