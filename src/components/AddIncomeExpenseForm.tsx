import { useForm } from 'react-hook-form';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Action, ActionType, DB } from '../helpers/DBHelpers';
import { sortByDateFnCreator } from '../helpers/general';
import { removeCurrencyFormattingToValue } from './Calculator';
import Input from './Input';
import InputRadio from './InputRadio';

export interface Props {
  db: DB;
  actionType: ActionType;
  value?: string;
  onClose: () => void;
  onSubmit: (value: Action) => void;
}

export default function AddIncomeExpenseForm(props: Props) {
  const { handleSubmit, register, control } = useForm<Action>({
    defaultValues: {
      expenseCategory: undefined,
      incomeCategory: undefined,
      description: '',
    },
  });

  const categories = [
    ...props.db[
      props.actionType === 'income' ? 'incomeCategories' : 'expenseCategories'
    ],
  ].sort(sortByDateFnCreator('name'));

  return (
    // TODO: Refactor popup div containers
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.aboveHeadingTitle}>
            {props.actionType === 'expense' ? 'Gasto' : 'Ingreso'}
          </Text>
          <Text style={styles.h2}>{props.value || '$0'}</Text>
        </View>

        <View>
          <Input
            control={control}
            name="value"
            // {...register('value', {
            //   value: Number(removeCurrencyFormattingToValue(props.value || '')),
            //   valueAsNumber: true,
            // })}
          />
          <Input
            control={control}
            name="type"

            // {...register('type', { value: props.actionType })}
          />

          <View style={styles.inputsContainer}>
            {categories.map(({ id, name }) => (
              <InputRadio
                key={id}
                control={control}
                label={name}
                value={id}
                name={
                  props.actionType === 'income'
                    ? 'incomeCategory'
                    : 'expenseCategory'
                }
              />
              // <View
              //   key={id}
              //   // className="relative cursor-pointer"
              // >
              //   <Input
              //     control={control}
              //     // className="opacity-0 w-1 h-1 absolute top-0 left-0 peer"
              //     // type="radio"
              //     name={
              //       props.actionType === 'income'
              //         ? 'incomeCategory'
              //         : 'expenseCategory'
              //     }
              //     value={`${id}`}
              //     // {...register(
              //     //   props.actionType === 'income'
              //     //     ? 'incomeCategory'
              //     //     : 'expenseCategory'
              //     // )}
              //   />

              //   <Text
              //   // className="ml-2 mb-2 p-2 inline-block border-2 border-white rounded-lg peer-checked:border-green-500 peer-checked:text-green-500"
              //   >
              //     {name}
              //   </Text>
              // </View>
            ))}
          </View>

          <View>
            <Input
              // className="w-full bg-gray-500 text-white border-2 border-gray-200 placeholder:text-gray-400 text-base p-4 rounded-lg"
              // type="text"
              control={control}
              name="description"
              placeholder="Descripción"
              // {...register('description')}
            />
          </View>

          <View>
            <Button title="Cancelar" onPress={props.onClose} />
            <Button title="Aceptar" onPress={handleSubmit(props.onSubmit)} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex fixed inset-0 bg-black justify-center items-center bg-opacity-80
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  content: {
    // className="bg-gray-800 py-4 px-5 rounded-lg text-center"
    backgroundColor: 'rgb(25, 33, 44)',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  h2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },

  aboveHeadingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'normal',
  },

  inputsContainer: {
    alignItems: 'baseline',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
