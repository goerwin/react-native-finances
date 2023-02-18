import 'react-native-get-random-values'; // for nanoid

import { useState } from 'react';
import { Button, StyleSheet, useWindowDimensions, View } from 'react-native';
import Toast from 'react-native-toast-notifications';
import todo_db from './dummytodo.json';
import {
  addAction,
  addCategory,
  deleteAction,
  deleteCategory,
  editAction,
  editCategory,
} from './src/api/actions';
import AddIncomeExpenseForm from './src/components/AddIncomeExpenseForm';
import Calculator from './src/components/Calculator';
import {
  Action,
  ActionCategory,
  ActionType,
  DB,
} from './src/helpers/dbHelpers';
import PopupCategories from './src/components/PopupCategories';
import PopupIncomesExpenses from './src/components/PopupIncomesExpenses';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<{ strValue: string; value: number }>();
  const { height } = useWindowDimensions();
  const [popup, setPopup] = useState<{
    action: 'add' | 'show' | 'showCategories';
    actionType: ActionType;
    // }>();
  } | undefined>({ action: 'show', actionType: 'expense' });
  const [accessToken, setAccessToken] = useState<string>('todo');
  // const [gdFileId, setGDFileId] = useState<Optional<string>>(LSGetGDFileId());
  const [gdFileId, setGDFileId] = useState<Optional<string>>('todo');
  const [db, setDB] = useState<DB>(todo_db as DB);

  // Perform a database operation, sync it and update it locally
  const asyncDBTask = async function (
    fn: (attrs: {
      accessToken: string;
      gdFileId: string;
      successMsg?: string;
    }) => Promise<DB>,
    attrs?: { alertMsg?: string }
  ) {
    try {
      if (!accessToken) throw new Error('Missing accessToken');
      if (!gdFileId) throw new Error('Missing Google Drive FileId');

      setIsLoading(true);
      const db = await fn({ accessToken, gdFileId });
      setDB(db);

      attrs?.alertMsg &&
        toast.show(attrs.alertMsg, { type: 'success', duration: 1000 });

      return db;
    } catch (err: any) {
      toast.show(err?.message || 'Ocurrió un error.', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddActionFormSubmit = async (values: Action) => {
    await asyncDBTask(
      async (attrs) => {
        const db = await addAction({
          ...attrs,
          newAction: {
            incomeCategory: values.incomeCategory,
            expenseCategory: values.expenseCategory,
            type: values.type,
            description: values.description,
            value: values.value,
          },
        });

        setValue(undefined);
        setPopup(undefined);

        return db;
      },
      { alertMsg: 'Entrada agregada' }
    );
  };

  const handleActionDelete = (actionId: string) =>
    asyncDBTask(async (attrs) => deleteAction({ ...attrs, actionId }), {
      alertMsg: 'Entrada eliminada',
    });

  const handleEditActionSubmit = (action: Action) =>
    asyncDBTask(async (attrs) => editAction({ ...attrs, action }), {
      alertMsg: 'Entrada editada',
    });

  const handleCategoryDelete = (categoryId: string) =>
    asyncDBTask(async (attrs) => deleteCategory({ ...attrs, categoryId }), {
      alertMsg: 'Categoría eliminada',
    });

  const handleAddCategorySubmit = (
    category: ActionCategory,
    type: ActionType
  ) =>
    asyncDBTask(async (attrs) => addCategory({ ...attrs, category, type }), {
      alertMsg: 'Categoría agregada',
    });

  const handleEditCategorySubmit = (category: ActionCategory) =>
    asyncDBTask(async (attrs) => editCategory({ ...attrs, category }), {
      alertMsg: 'Categoría editada',
    });

  return (
    <View style={{ ...styles.container, height: height }}>
      <Calculator
        strValue={value?.strValue}
        onButtonClick={setValue}
        onBackspaceLongPress={() => setValue(undefined)}
      />
      <Button
        title="Ingreso"
        onPress={() =>
          value && setPopup({ action: 'add', actionType: 'income' })
        }
      />
      <Button
        title="Gasto"
        onPress={() =>
          value && setPopup({ action: 'add', actionType: 'expense' })
        }
      />

      <Button
        title="Ingresos"
        onPress={() => setPopup({ action: 'show', actionType: 'income' })}
      />

      <Button
        title="Gastos"
        onPress={() => setPopup({ action: 'show', actionType: 'expense' })}
      />

      <Button
        title="Categoría Ingresos"
        onPress={() =>
          setPopup({ action: 'showCategories', actionType: 'income' })
        }
      />

      <Button
        title="Categoría Gastos"
        onPress={() =>
          setPopup({ action: 'showCategories', actionType: 'expense' })
        }
      />

      {db && popup?.action === 'add' && (
        <AddIncomeExpenseForm
          actionType={popup.actionType}
          db={db}
          strValue={value?.strValue}
          value={value?.value}
          onClose={() => setPopup(undefined)}
          onSubmit={handleAddActionFormSubmit}
        />
      )}

      {popup?.action === 'showCategories' ? (
        <PopupCategories
          actionType={popup.actionType}
          db={db}
          onClose={() => setPopup(undefined)}
          onItemDelete={handleCategoryDelete}
          onEditItemSubmit={handleEditCategorySubmit}
          onNewItemSubmit={handleAddCategorySubmit}
        />
      ) : null}

      {popup?.action === 'show' ? (
        <PopupIncomesExpenses
          actionType={popup.actionType}
          db={db}
          onClose={() => setPopup(undefined)}
          onItemDelete={handleCategoryDelete}
          onEditItemSubmit={handleEditCategorySubmit}
          onNewItemSubmit={handleAddCategorySubmit}
        />
      ) : null}

      <Toast ref={(ref) => (global['toast'] = ref!)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181a1b',
    alignItems: 'center',
  },
});
