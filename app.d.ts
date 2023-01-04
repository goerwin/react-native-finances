type Optional<T> = T | undefined;

type ToastType = import('react-native-toast-notifications').ToastType;

declare global {
  const toast: ToastType;
}

declare var toast: ToastType;
