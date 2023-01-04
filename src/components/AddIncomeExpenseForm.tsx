import { useForm } from 'react-hook-form';
import { Button, StyleSheet, View } from 'react-native';
import { Action, ActionType, DB } from '../helpers/DBHelpers';
import { sortByDateFnCreator } from '../helpers/general';
import Input from './Input';
import InputRadio from './InputRadio';
import Popup from './Popup';

export interface Props {
  db: DB;
  actionType: ActionType;
  strValue?: string;
  value?: number;
  onClose: () => void;
  onSubmit: (value: Action) => void;
}

export default function AddIncomeExpenseForm(props: Props) {
  const { handleSubmit, register, control } = useForm<Action>({
    defaultValues: {
      value: props.value,
      type: props.actionType,
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
    <Popup
      title={props.strValue || '$0'}
      aboveHeadingTitle={props.actionType === 'expense' ? 'Gasto' : 'Ingreso'}
    >
      <View>
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
          ))}
        </View>

        <View>
          <Input
            style={styles.textarea}
            control={control}
            name="description"
            placeholder="Descripción"
            placeholderTextColor="#aaa"
          />
        </View>

        <View>
          <Button title="Cancelar" onPress={props.onClose} />
          <Button title="Aceptar" onPress={handleSubmit(props.onSubmit)} />
        </View>
      </View>
    </Popup>
  );
}

const styles = StyleSheet.create({
  inputsContainer: {
    alignItems: 'baseline',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  textarea: {
    backgroundColor: 'rgb(88, 96, 100)',
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
    color: '#fff',
  },
});
