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
