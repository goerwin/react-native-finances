import 'react-native-get-random-values'; // for nanoid

import { useState } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Button,
  Text,
} from 'react-native';
import { addAction } from './src/api/actions';
import AddIncomeExpenseForm from './src/components/AddIncomeExpenseForm';
import Calculator from './src/components/Calculator';
import Toast from 'react-native-toast-notifications';
import {
  Action,
  ActionCategory,
  ActionType,
  DB,
  initialDB,
} from './src/helpers/dbHelpers';
import todo_db from './dummytodo.json';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<{ strValue: string; value: number }>();
  const { height } = useWindowDimensions();
  const [popup, setPopup] = useState<{
    action: 'add' | 'show' | 'showCategories';
    actionType: ActionType;
  }>();
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
      // console.log('bb', err.stack);
      toast.show(err?.stack || 'Ocurrió un error.', { type: 'error' });
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

  return (
    <View style={{ ...styles.container, height: height }}>
      <Calculator
        strValue={value?.strValue}
        onButtonClick={setValue}
        onBackspaceLongPress={() => setValue(undefined)}
      />
      <Button
        title="Gasto"
        onPress={() => {
          if (value) setPopup({ action: 'add', actionType: 'expense' });
        }}
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
