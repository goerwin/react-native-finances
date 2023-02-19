import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { getDateFormattedForInput } from '../helpers/time';
import Popup from './Popup';

export interface Props {
  startDate: Date;
  endDate: Date;
  onClose: () => void;
}

export default function PopupFilterByDates(props: Props) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      startDate: props.startDate,
      endDate: props.endDate,
    },
  });

  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
  };

  return (
    <Popup title="Filtro por fecha" onRequestClose={props.onClose}>
      <View>
        {/* <RNDateTimePicker value={props.startDate} mode="date" /> */}
      </View>
    </Popup>
  );
}
