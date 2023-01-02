import { useController, UseControllerProps } from 'react-hook-form';
import { TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  name: string;
  control: UseControllerProps<any>['control'];
  defaultValue?: UseControllerProps['defaultValue'];
}

export default function Input(props: Props) {
  const { field } = useController({
    control: props.control,
    defaultValue: props.defaultValue,
    name: props.name,
  });

  return (
    <TextInput
      {...props}
      onBlur={field.onBlur}
      value={field.value}
      onChangeText={field.onChange}
    />
  );
}
