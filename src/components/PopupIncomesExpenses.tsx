import { useState } from 'react';
import { useForm, UseFormStateProps } from 'react-hook-form';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, ActionCategory, ActionType, DB } from '../helpers/DBHelpers';
import {
  alert,
  filterActionsByTypeAndStartEndDates,
  sortByDateFnCreator,
} from '../helpers/general';
import {
  getFirstDayOfMonthDate,
  getFormattedLocalDate,
  getFormattedLocalDatetime,
  getLastDayOfMonthDate,
  getNextMonthFirstDayDate,
  getPreviousMonthFirstDayDate,
} from '../helpers/time';
import { formatNumberValueToCurrency } from './Calculator';
import { Picker } from '@react-native-picker/picker';
import Input from './Input';
import Popup from './Popup';
import Select from './Select';
import PopupFilterByDates from './PopupFilterByDates';

export interface Props {
  db: DB;
  actionType: ActionType;
  onItemDelete: (itemId: string) => void;
  onEditItemSubmit: (item: Action) => void;
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
    <View key={action.id} style={actionViewStyles.container}>
      <View style={actionViewStyles.content}>
        <Text style={actionViewStyles.value}>
          {formatNumberValueToCurrency(action.value)}
          <Text style={actionViewStyles.category}>
            {getCategoryName(db, action)}
          </Text>
        </Text>

        {action.description ? (
          <Text style={actionViewStyles.desc}>{action.description}</Text>
        ) : null}

        <Text style={actionViewStyles.date}>
          {getFormattedLocalDatetime(action.date)}
        </Text>
      </View>

      <View style={styles.actionBtns}>
        <Button title="✏️" onPress={() => attrs?.onEditClick(action.id)} />
        <Button
          title="🗑️"
          onPress={() => {
            alert(
              'Eliminar Categoría',
              `Seguro que quieres eliminar este ${
                action.type === 'expense' ? 'gasto' : 'ingreso'
              } (${getCategoryName(db, action)} - ${formatNumberValueToCurrency(
                action.value
              )} - ${getFormattedLocalDatetime(action.date)})?`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  style: 'destructive',
                  onPress: () => attrs?.onRemoveClick(action.id),
                },
              ]
            );
          }}
        />
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
    <View key={action.id} style={ActionFormViewStyles.container}>
      <View style={ActionFormViewStyles.content}>
        <Input
          control={attrs.control}
          style={{ display: 'none' }}
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

      <View style={styles.actionBtns}>
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
  const [showFilterByDatesPopup, setShowFilterByDatesPopup] = useState(false);

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

  const handleRemoveActionClick = (id: string) => {
    resetEditingForm();
    props.onItemDelete(id);
  };

  const submitEditingForm = handleSubmit((editedAction: any) => {
    resetEditingForm();
    props.onEditItemSubmit({
      ...editedAction,
      value: Number(editedAction.value),
    });
  });

  return (
    <Popup
      onRequestClose={props.onClose}
      title={actionType === 'expense' ? 'Gastos' : 'Ingresos'}
      bottomArea={
        <View>
          <Text style={styles.value}>
            Total: {formatNumberValueToCurrency(filteredTotal)}
          </Text>

          <View style={styles.filterContainer}>
            <Button
              title="←"
              onPress={() =>
                setFilterDates({
                  filterStartDate:
                    getPreviousMonthFirstDayDate(filterStartDate),
                  filterEndDate: getLastDayOfMonthDate(
                    getPreviousMonthFirstDayDate(filterStartDate)
                  ),
                })
              }
            />
            <Pressable onPress={() => setShowFilterByDatesPopup(true)}>
              <Text style={styles.value}>
                {getFormattedLocalDate(filterStartDate)}
              </Text>
              <Text style={styles.value}>
                {getFormattedLocalDate(filterEndDate)}
              </Text>
            </Pressable>

            <Button
              title="→"
              onPress={() =>
                setFilterDates({
                  filterStartDate: getNextMonthFirstDayDate(filterStartDate),
                  filterEndDate: getLastDayOfMonthDate(
                    getNextMonthFirstDayDate(filterStartDate)
                  ),
                })
              }
            />
          </View>
          <View>
            <Button title="Cancelar" onPress={props.onClose} />
            <Button title="Agregar" onPress={() => {}} />
          </View>
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
              onRemoveClick: handleRemoveActionClick,
            })
      )}

      {showFilterByDatesPopup && (
        <PopupFilterByDates
          onClose={() => setShowFilterByDatesPopup(false)}
          startDate={filterStartDate}
          endDate={filterEndDate}
          // onCancelClick={() => setShowFilterByDatesPopup(false)}
          // onCurrentMonthClick={() => {
          //   setShowFilterByDatesPopup(false);
          //   setFilterDates({
          //     filterStartDate: getFirstDayOfMonthDate(today),
          //     filterEndDate: getLastDayOfMonthDate(today),
          //   });
          // }}
          // onSubmit={(filterStartDate, filterEndDate) => {
          //   setFilterDates({ filterStartDate, filterEndDate });
          //   setShowFilterByDatesPopup(false);
          // }}
        />
      )}
    </Popup>
  );
}

const actionViewStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff3',
    paddingBottom: 10,
  },

  content: {
    flexGrow: 1,
    flexBasis: 1,
  },

  value: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  category: {
    fontSize: 14,
    color: '#ffffff80',
    fontWeight: 'normal',
    marginLeft: 5,
  },

  desc: {
    color: 'white',
  },

  date: {
    marginTop: 3,
    color: '#ffffff80',
  },
});

const ActionFormViewStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  content: {
    flexGrow: 1,
    flexBasis: 1,
  },
});

const styles = StyleSheet.create({
  actionBtns: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginLeft: 5,
  },

  value: {
    color: 'white',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
