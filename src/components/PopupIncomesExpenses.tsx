import { useState } from 'react';
import { useForm, UseFormStateProps } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Action, ActionCategory, ActionType, DB } from '../helpers/DBHelpers';
import {
  alert,
  filterActionsByTypeAndStartEndDates,
  sortByDateFnCreator,
} from '../helpers/general';
import {
  getFirstDayOfMonthDate,
  getFormattedLocalDatetime,
  getLastDayOfMonthDate,
} from '../helpers/time';
import { formatNumberValueToCurrency } from './Calculator';
import { Picker } from '@react-native-picker/picker';
import Input from './Input';
import Popup from './Popup';
import Select from './Select';

export interface Props {
  db: DB;
  actionType: ActionType;
  onItemDelete: (itemId: string) => void;
  onEditItemSubmit: (item: ActionCategory) => void;
  onNewItemSubmit: (item: ActionCategory, type: ActionType) => void;
  onClose: () => void;
}

function getCategoryName(db: DB, action: Action) {
  const { type, expenseCategory, incomeCategory } = action;
  const category = db[
    type === 'expense' ? 'expenseCategories' : 'incomeCategories'
  ].find(
    (el) => el.id === (type === 'expense' ? expenseCategory : incomeCategory)
  );

  return category?.name || '-';
}

function getActionView(
  action: Action,
  db: DB,
  attrs?: {
    onEditClick: (id: string) => void;
    onRemoveClick: (id: string) => void;
  }
) {
  return (
    <View key={action.id} style={{ marginBottom: 20 }}>
      <View>
        <Text style={{ color: 'white' }}>
          {formatNumberValueToCurrency(action.value)}
        </Text>
        <Text style={{ color: 'white' }}>{getCategoryName(db, action)}</Text>
        <Text style={{ color: 'white' }}>{action.description}</Text>
        <Text style={{ color: 'white' }}>
          {getFormattedLocalDatetime(action.date)}
        </Text>
      </View>

      <View>
        <Button title="✏️" onPress={() => attrs?.onEditClick(action.id)} />
        <Button title="🗑️" onPress={() => attrs?.onRemoveClick(action.id)} />
      </View>
    </View>
  );
}

function getActionFormView(
  action: Action,
  db: DB,
  attrs: {
    categories: ActionCategory[];
    actionType: ActionType;
    // TODO: REMOVE ANY
    control: UseFormStateProps<any>['control'];
    onCancel?: () => void;
    onSubmit?: () => void;
  }
) {
  return (
    <View key={action.id}>
      <View>
        <Input
          control={attrs.control}
          name="id"
          rules={{ required: true }}
          value={action.id}
        />
        <Input
          control={attrs.control}
          name="value"
          valueType="number"
          rules={{ required: true }}
          defaultValue={action.value}
          placeholder="Valor"
        />

        <Select
          control={attrs.control}
          name={
            attrs.actionType === 'expense'
              ? 'expenseCategory'
              : 'incomeCategory'
          }
          options={attrs.categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))}
          defaultValue={
            attrs.actionType === 'expense'
              ? action.expenseCategory
              : action.incomeCategory
          }
        />

        <Input
          control={attrs.control}
          name="description"
          placeholder="Descripción"
          defaultValue={action.description}
        />
        <Input
          control={attrs.control}
          name="date"
          defaultValue={action.date}
          // getDatetimeLocalFormattedForInputDate(new Date(date))
          placeholder="Fecha"
        />
      </View>
      <View>
        <Button title="X" onPress={attrs.onCancel} />
        <Button title="Done" onPress={attrs.onSubmit} />
      </View>
    </View>
  );
}

export default function PopupIncomesExpenses({ actionType, ...props }: Props) {
  const today = new Date();
  const { handleSubmit, control, reset } = useForm<Action>();
  const [{ filterStartDate, filterEndDate }, setFilterDates] = useState({
    filterStartDate: getFirstDayOfMonthDate(today),
    filterEndDate: getLastDayOfMonthDate(today),
  });
  const [editingActionId, setEditingActionId] = useState<string>();

  const categories =
    actionType === 'expense'
      ? props.db.expenseCategories
      : props.db.incomeCategories;

  const filteredActions = props.db.actions
    .filter(
      filterActionsByTypeAndStartEndDates.bind(null, {
        actionType: actionType,
        startDate: filterStartDate,
        endDate: filterEndDate,
      })
    )
    .sort(sortByDateFnCreator('date', false));

  const filteredTotal = filteredActions.reduce((acc, el) => acc + el.value, 0);

  const resetEditingForm = () => {
    reset();
    setEditingActionId(undefined);
  };

  const handleEditActionClick = (id: string) => {
    reset();
    setEditingActionId(id);
  };

  const submitEditingForm = handleSubmit((data: any) => {
    console.log(data);
  });

  return (
    <Popup
      title={actionType === 'expense' ? 'Gastos' : 'Ingresos'}
      bottomArea={
        <View>
          <Button title="Cancelar" onPress={props.onClose} />
          <Button title="Agregar" onPress={() => {}} />
        </View>
      }
    >
      {filteredActions.map((action) =>
        action.id === editingActionId
          ? getActionFormView(action, props.db, {
              actionType,
              categories,
              control,
              onCancel: resetEditingForm,
              onSubmit: submitEditingForm,
            })
          : getActionView(action, props.db, {
              onEditClick: handleEditActionClick,
              onRemoveClick: resetEditingForm,
            })
      )}
    </Popup>
  );
}

const styles = StyleSheet.create({});
