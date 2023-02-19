import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Action, ActionCategory, ActionType, DB } from '../helpers/DBHelpers';
import { alert, sortByDateFnCreator } from '../helpers/general';
import Input from './Input';
import Popup from './Popup';

export interface Props {
  db: DB;
  actionType: ActionType;
  onItemDelete: (itemId: string) => void;
  onEditItemSubmit: (item: ActionCategory) => void;
  onNewItemSubmit: (item: ActionCategory, type: ActionType) => void;
  onClose: () => void;
}

export default function PopupCategories({ actionType, ...props }: Props) {
  const { handleSubmit, control, reset } = useForm<ActionCategory>();
  const [formItemId, setFormItemId] = useState<string>();

  const categories = [
    ...props.db[
      actionType === 'income' ? 'incomeCategories' : 'expenseCategories'
    ],
  ]
    .sort(sortByDateFnCreator('name'))
    .sort(sortByDateFnCreator('sortPriority', false));

  const handleItemFormSubmit = handleSubmit((item: ActionCategory) => {
    if (item.id === 'new') props.onNewItemSubmit(item, actionType);
    else props.onEditItemSubmit(item);

    setFormItemId(undefined);
  });

  const getFormCategory = (category: ActionCategory) => {
    return (
      <>
        <Input
          control={control}
          style={{ display: 'none' }}
          name="id"
          rules={{ required: true }}
          value={category.id}
        />
        <Input
          control={control}
          style={styles.input}
          name="name"
          placeholder="Nombre"
          rules={{ required: true }}
          defaultValue={category.name}
        />
        <Input
          control={control}
          style={styles.input}
          name="sortPriority"
          valueType="number"
          rules={{ required: true }}
          defaultValue={category.sortPriority}
          placeholder="Prioridad de orden"
        />
        <Input
          control={control}
          style={styles.input}
          name="description"
          defaultValue={category.description}
          placeholder="Descripción"
        />
      </>
    );
  };

  const getFormItemEdittingButtons = () => {
    return (
      <>
        <Button title="×" onPress={() => setFormItemId(undefined)} />
        <Button title="✓" onPress={() => handleItemFormSubmit()} />
      </>
    );
  };

  return (
    <Popup
      onRequestClose={props.onClose}
      title={
        actionType === 'expense' ? 'Categoría Gastos' : 'Categoría Ingresos'
      }
      bottomArea={
        <View>
          <Button title="Cancelar" onPress={props.onClose} />
          <Button
            title="Agregar"
            onPress={() => {
              reset();
              setFormItemId('new');
            }}
          />
        </View>
      }
    >
      {formItemId === 'new' ? (
        <View style={styles.item}>
          <View style={styles.itemContent}>
            {getFormCategory({ id: formItemId, name: '', sortPriority: 0 })}
          </View>
          <View style={styles.itemButtons}>{getFormItemEdittingButtons()}</View>
        </View>
      ) : null}
      {categories.map((cat) => (
        <View key={cat.id} style={styles.item}>
          <View style={styles.itemContent}>
            {formItemId !== cat.id ? (
              <>
                <Text style={styles.itemTitle}>
                  {cat.name}{' '}
                  <Text style={{ ...styles.textDescription, fontSize: 12 }}>
                    Items:{' '}
                    {props.db.actions.reduce(
                      (count, action) =>
                        action[
                          actionType === 'expense'
                            ? 'expenseCategory'
                            : 'incomeCategory'
                        ] === cat.id
                          ? count + 1
                          : count,
                      0
                    )}
                  </Text>
                </Text>
                <Text style={styles.textDescription}>
                  Prioridad de orden: <Text> {cat.sortPriority}</Text>
                </Text>
                {cat.description ? (
                  <Text style={styles.textDescription}>{cat.description}</Text>
                ) : null}
              </>
            ) : (
              getFormCategory(cat)
            )}
          </View>

          <View style={styles.itemButtons}>
            {formItemId !== cat.id ? (
              <>
                <Button
                  title="✏️"
                  onPress={() => {
                    reset();
                    setFormItemId(cat.id);
                  }}
                />
                <Button
                  title="🗑️"
                  onPress={() => {
                    setFormItemId(undefined);

                    alert(
                      'Eliminar Categoría',
                      `Seguro que quieres eliminar esta categoría (${cat.name})?`,
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          style: 'destructive',
                          onPress: () => props.onItemDelete(cat.id),
                        },
                      ]
                    );
                  }}
                />
              </>
            ) : (
              getFormItemEdittingButtons()
            )}
          </View>
        </View>
      ))}
    </Popup>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: 'rgba(48, 52, 54, 0.2)',
  },

  itemContent: {
    flexGrow: 1,
    flexShrink: 1,
  },

  itemButtons: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemTitle: {
    fontSize: 16,
    color: '#fff',
  },

  textDescription: {
    color: '#ffffff80',
    fontSize: 14,
    fontStyle: 'italic',
  },

  input: {
    padding: 5,
  },
});
