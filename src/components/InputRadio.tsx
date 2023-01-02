import React from 'react';
import { Controller, useController, UseControllerProps } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Props = {
  name: string;
  label: string;
  value: string;
  control: UseControllerProps<any>['control'];
  // defaultValue?: UseControllerProps['defaultValue'];
};

export default function InputRadio(props: Props) {
  // const { field } = useController({
  //   control: props.control,
  //   name: props.name,
  // });

  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value } }) => (
        <Pressable
          onPress={() => onChange(props.value)}
          style={{
            ...styles.container,
            ...(value === props.value ? styles.containerChecked : {}),
          }}
        >
          <Text
            style={{
              ...styles.text,
              ...(value === props.value ? styles.textChecked : {}),
            }}
          >
            {props.label}
          </Text>
        </Pressable>
      )}
    />
  );

  // return (
  //   <View
  //   // className="relative cursor-pointer"
  //   >
  //     <Input
  //       control={control}
  //       // className="opacity-0 w-1 h-1 absolute top-0 left-0 peer"
  //       // type="radio"
  //       name={
  //         props.actionType === 'income' ? 'incomeCategory' : 'expenseCategory'
  //       }
  //       value={`${value}`}
  //       // {...register(
  //       //   props.actionType === 'income'
  //       //     ? 'incomeCategory'
  //       //     : 'expenseCategory'
  //       // )}
  //     />

  //     <Text
  //     // className="ml-2 mb-2 p-2 inline-block border-2 border-white rounded-lg peer-checked:border-green-500 peer-checked:text-green-500"
  //     >
  //       {name}
  //     </Text>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'rgb(48, 52, 54)',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },

  containerChecked: {
    borderColor: 'rgb(74, 224, 129)',
  },

  textChecked: {
    color: 'rgb(74, 224, 129)',
  },
});
