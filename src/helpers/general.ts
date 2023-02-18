import { Alert, Platform } from 'react-native';
import { Action, ActionType } from './dbHelpers';

type SortablePropertyType = string | number;

type KeysWithValsOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any;
};

export function sortByDateFnCreator<
  T,
  Key extends KeysWithValsOfType<T, SortablePropertyType>
>(key: Key, asc = true) {
  return (it1: T, it2: T) => {
    // TODO: Had to manually set the type;
    const it1Val = it1[key] as SortablePropertyType;
    const it2Val = it2[key] as SortablePropertyType;

    return asc
      ? it1Val === it2Val
        ? 0
        : it1Val > it2[key]
        ? 1
        : -1
      : it1Val === it2Val
      ? 0
      : it1Val < it2[key]
      ? 1
      : -1;
  };
}

/**
 * Type assertion on const/readonly arrays with resolved type
 */
export function arrayIncludes<T extends U, U>(
  arr: ReadonlyArray<T>,
  el: U
): el is T {
  return arr.includes(el as T);
}

// type args = Function typeof Alert.alert
type AlertParameters = Parameters<typeof Alert.alert>;

function alertPolyfill(...[title, msg, buttons, ..._]: AlertParameters) {
  const result = window.confirm([title, msg].filter(Boolean).join('\n'));

  if (result) {
    const confirmOption = buttons?.find(({ style }) => style !== 'cancel');
    confirmOption?.onPress?.();
  } else {
    const cancelOption = buttons?.find(({ style }) => style === 'cancel');
    cancelOption?.onPress?.();
  }
}

export const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert;

export function filterActionsByTypeAndStartEndDates(
  attrs: { actionType: ActionType; startDate: Date; endDate: Date },
  action: Action
) {
  const actionDate = new Date(action.date);

  return (
    action.type === attrs.actionType &&
    actionDate >= attrs.startDate &&
    actionDate <= attrs.endDate
  );
}
