import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

const { width } = Dimensions.get('window');

interface FlashSaleCountdownProps {
  endTime: Date | string;
  onExpire?: () => void;
  label?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeLeft(endTime: Date): TimeLeft {
  const diff = endTime.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

export function FlashSaleCountdown({
  endTime,
  onExpire,
  label = 'Flash Sale Ends In',
  compact = false,
}: FlashSaleCountdownProps) {
  const { colors } = useTheme();
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(end));
  const expiredCalled = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft(end);
      setTimeLeft(tl);
      if (tl.expired && !expiredCalled.current) {
        expiredCalled.current = true;
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [end, onExpire]);

  if (timeLeft.expired) {
    return (
      <View style={[styles.expiredContainer, { backgroundColor: colors.error + '15' }]}>
        <Text style={[styles.expiredText, { color: colors.error }]}>Sale Ended</Text>
      </View>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={[styles.compactLabel, { color: colors.error }]}>⏱ </Text>
        <Text style={[styles.compactTime, { color: colors.error }]}>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.error + '10', borderColor: colors.error }]}
      accessibilityRole="timer"
      accessibilityLabel={`${label}: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
    >
      <Text style={[styles.label, { color: colors.error }]}>{label}</Text>
      <View style={styles.timeRow}>
        {timeLeft.days > 0 && (
          <>
            <View style={[styles.timeBlock, { backgroundColor: colors.error }]}>
              <Text style={styles.timeValue}>{pad(timeLeft.days)}</Text>
              <Text style={styles.timeUnit}>DAYS</Text>
            </View>
            <Text style={[styles.separator, { color: colors.error }]}>:</Text>
          </>
        )}
        <View style={[styles.timeBlock, { backgroundColor: colors.error }]}>
          <Text style={styles.timeValue}>{pad(timeLeft.hours)}</Text>
          <Text style={styles.timeUnit}>HRS</Text>
        </View>
        <Text style={[styles.separator, { color: colors.error }]}>:</Text>
        <View style={[styles.timeBlock, { backgroundColor: colors.error }]}>
          <Text style={styles.timeValue}>{pad(timeLeft.minutes)}</Text>
          <Text style={styles.timeUnit}>MIN</Text>
        </View>
        <Text style={[styles.separator, { color: colors.error }]}>:</Text>
        <View style={[styles.timeBlock, { backgroundColor: colors.error }]}>
          <Text style={styles.timeValue}>{pad(timeLeft.seconds)}</Text>
          <Text style={styles.timeUnit}>SEC</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeBlock: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 44,
  },
  timeValue: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  timeUnit: { color: '#ffffff', fontSize: 9, fontWeight: '600', marginTop: 2 },
  separator: { fontSize: 18, fontWeight: 'bold' },
  expiredContainer: {
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  expiredText: { fontSize: 13, fontWeight: '600' },
  compactContainer: { flexDirection: 'row', alignItems: 'center' },
  compactLabel: { fontSize: 12 },
  compactTime: { fontSize: 12, fontWeight: 'bold' },
});
