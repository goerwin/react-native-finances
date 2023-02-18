import { useForm } from 'react-hook-form';
import {
  Text,
  View,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
} from 'react-native';
import Input from './Input';
// import { useLongPress } from 'use-long-press';

const items: { name: string | number; value: string | number }[] = [
  { name: 1, value: 1 },
  { name: 2, value: 2 },
  { name: 3, value: 3 },
  { name: 4, value: 4 },
  { name: 5, value: 5 },
  { name: 6, value: 6 },
  { name: 7, value: 7 },
  { name: 8, value: 8 },
  { name: 9, value: 9 },
  { name: '.', value: '.' },
  { name: 0, value: 0 },
  { name: '⌫', value: 'backspace' },
];

export function applyCalcString(current: string, input: string) {
  if (input === 'backspace') return current.slice(0, -1) || '0';

  const [integer, decimal] = current.split('.');

  if (['', '0'].includes(integer) && input === '.') return '0.';
  if (decimal !== undefined && input === '.') return current;
  if (decimal !== undefined) return current + input;
  if (input === '.') return integer + input;

  return String(Number(integer + input));
}

export function formatNumberValueToCurrency(value: string | number) {
  const [integerStr, decimalStr] = String(value).split('.');
  const parsedValueStr = Number(
    integerStr + (decimalStr ? `.${decimalStr}` : '')
  ).toFixed(2);

  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
  }).format(Number(parsedValueStr))}`;
}

export function removeCurrencyFormattingToValue(value: string) {
  return value.replace(/,|\$/g, '');
}

type Item = typeof items[0];

const BUTTON_SIZE = 72;
const BUTTON_GAP = 8;

export interface Props {
  strValue?: string;
  onButtonClick: (value: { strValue: string; value: number }) => void;
  onBackspaceLongPress?: () => void;
}

export default function Calculator(props: Props) {
  const handleButtonClick = (val: Item) => {
    const btnValue = String(val.value);
    const currStrValue = props.strValue || '';
    const noCurrencyStrValue = removeCurrencyFormattingToValue(currStrValue);
    const newNoFormatStrValue = applyCalcString(noCurrencyStrValue, btnValue);
    const newStrValue = formatNumberValueToCurrency(newNoFormatStrValue);
    const newValue = Number(newNoFormatStrValue);

    props.onButtonClick({ strValue: newStrValue, value: newValue });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.topInput} value={props.strValue || '$0'} />

      <View style={styles.buttonsContainer}>
        {items.map((el) => (
          <Pressable
            style={styles.button}
            key={el.value}
            onPress={() => handleButtonClick(el)}
            onLongPress={() => {
              if (el.value === 'backspace') props.onBackspaceLongPress?.();
            }}
          >
            <Text style={styles.buttonText}>{String(el.name)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  topInput: {
    width: '100%',
    border: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 48,
    color: '#e8e6e3',
  },

  buttonsContainer: {
    width: BUTTON_SIZE * 3 + 2 * BUTTON_GAP,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: BUTTON_GAP,
  },

  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE,
    backgroundColor: '#0e6794',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#dddad6',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
