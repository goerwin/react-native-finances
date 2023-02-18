import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export type Props = {
  title: string;
  children: ReactNode;
  aboveHeadingTitle?: string;
  bottomArea?: ReactNode;
};

export default function Popup(props: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{ alignItems: 'center' }}>
          {props.aboveHeadingTitle ? (
            <Text style={styles.aboveHeadingTitle}>
              {props.aboveHeadingTitle}
            </Text>
          ) : null}

          <Text style={styles.h2}>{props.title}</Text>
        </View>
        <ScrollView style={styles.scrollableContent}>
          {props.children}
        </ScrollView>
        {props.bottomArea ? <View>{props.bottomArea}</View> : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  scrollableContent: {
    maxHeight: 300,
    marginBottom: 20,
  },

  content: {
    backgroundColor: 'rgb(25, 33, 44)',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  h2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },

  aboveHeadingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'normal',
  },
});
