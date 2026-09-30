import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography } from '../../src/components/ui/Typography';
import { Card } from '../../src/components/ui/Card';
import { AttendanceRing } from '../../src/components/features/AttendanceRing';
import { LoadingState, EmptyState, ErrorState } from '../../src/components/ui/StateViews';
import { attendanceService } from '../../src/services/attendance.service';
import { AttendanceSummary, AttendancePlan } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';

type Tab = 'overview' | 'planner';

export default function AttendanceScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [plans, setPlans] = useState<AttendancePlan[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([
        attendanceService.getSummary(),
        attendanceService.getAttendancePlans(),
      ]);
      setSummary(s);
      setPlans(p);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (status === 'loading' && !summary) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <LoadingState message="Loading attendance..." />
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
        <ErrorState
          title="Attendance unavailable"
          message="Attendance data couldn't be loaded right now."
          onRetry={load}
        />
      </SafeAreaView>
    );
  }

  const s = summary!;
  const overallStatus =
    s.overall >= 80 ? 'safe' : s.overall >= 75 ? 'warning' : 'critical';
  const overallColor =
    overallStatus === 'safe' ? colors.successDefault :
    overallStatus === 'warning' ? colors.warningDefault :
    colors.errorDefault;
  const overallBg =
    overallStatus === 'safe' ? colors.successSubtle :
    overallStatus === 'warning' ? colors.warningSubtle :
    colors.errorSubtle;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h3" color="primary">Attendance</Typography>
      </View>

      {/* Overall Summary Card */}
      <View style={styles.overallWrap}>
        <Card style={[styles.overallCard, { backgroundColor: overallBg, borderColor: overallColor }]}>
          <View style={styles.overallRow}>
            <View>
              <Typography variant="h1" style={{ color: overallColor }}>
                {s.overall}%
              </Typography>
              <Typography variant="body" color="secondary">Overall attendance</Typography>
              {overallStatus !== 'safe' && (
                <View style={[styles.alertPill, { backgroundColor: overallBg }]}>
                  <Typography variant="caption" style={{ color: overallColor }}>
                    {overallStatus === 'warning'
                      ? '⚠️ Attendance needs attention'
                      : '🔴 Below required threshold'}
                  </Typography>
                </View>
              )}
              {overallStatus === 'safe' && (
                <Typography variant="caption" color="success">✓ Above 75% requirement</Typography>
              )}
            </View>
            <View style={[styles.bigRing, { borderColor: overallColor, backgroundColor: overallBg }]}>
              <Typography variant="h3" style={{ color: overallColor }}>{s.overall}%</Typography>
            </View>
          </View>
        </Card>
      </View>

      {/* Tab Switcher */}
      <View style={[styles.tabBar, { borderBottomColor: colors.borderDefault }]}>
        {(['overview', 'planner'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: colors.brandDefault, borderBottomWidth: 2 },
            ]}
            hitSlop={{ top: 8, bottom: 8 }}
          >
            <Typography
              variant="label"
              color={activeTab === tab ? 'brand' : 'secondary'}
            >
              {tab === 'overview' ? 'By Subject' : 'Attendance Plan'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brandDefault} />
        }
      >
        {activeTab === 'overview' ? (
          s.subjects.length === 0 ? (
            <EmptyState
              emoji="📊"
              title="No attendance data"
              subtitle="Attendance data isn't available yet."
            />
          ) : (
            s.subjects.map((sub) => (
              <Card key={sub.subjectCode} style={styles.subjectCard}>
                <AttendanceRing subject={sub} />
              </Card>
            ))
          )
        ) : (
          plans.map((plan) => (
            <PlanCard key={plan.subjectCode} plan={plan} colors={colors} />
          ))
        )}
        <View style={{ height: Spacing[8] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, colors }: { plan: AttendancePlan; colors: any }) {
  const statusColor =
    plan.status === 'safe' ? colors.successDefault :
    plan.status === 'warning' ? colors.warningDefault :
    colors.errorDefault;
  const statusBg =
    plan.status === 'safe' ? colors.successSubtle :
    plan.status === 'warning' ? colors.warningSubtle :
    colors.errorSubtle;

  return (
    <Card style={styles.planCard}>
      {/* Subject header */}
      <View style={styles.planHeader}>
        <View style={{ flex: 1 }}>
          <Typography variant="label" color="primary" numberOfLines={1}>
            {plan.subjectName}
          </Typography>
          <Typography variant="caption" color="secondary">
            {plan.subjectCode} · {plan.attended}/{plan.total} attended
          </Typography>
        </View>
        <View style={[styles.pctBadge, { backgroundColor: statusBg }]}>
          <Typography variant="label" style={{ color: statusColor }}>
            {plan.currentPercentage}%
          </Typography>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.borderDefault }]} />

      {/* Plan details */}
      {plan.status === 'safe' ? (
        <View style={styles.planRow}>
          <Typography variant="caption" color="success">
            ✓ You can safely miss {plan.classesCanMiss} more class{plan.classesCanMiss !== 1 ? 'es' : ''} and stay above 75%.
          </Typography>
        </View>
      ) : plan.classesNeededFor75 > 0 ? (
        <View style={styles.planRow}>
          <Typography variant="caption" style={{ color: statusColor }}>
            You need to attend the next {plan.classesNeededFor75} class{plan.classesNeededFor75 !== 1 ? 'es' : ''} to reach 75%.
          </Typography>
        </View>
      ) : (
        <View style={styles.planRow}>
          <Typography variant="caption" color="secondary">Attendance is on track.</Typography>
        </View>
      )}

      <Typography variant="caption" color="tertiary">
        If you attend all remaining classes: {plan.projectedPercentageIfAllAttended}%
      </Typography>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },
  overallWrap: {
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  overallCard: {
    borderWidth: 1.5,
    padding: Spacing[4],
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertPill: {
    marginTop: Spacing[2],
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  bigRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[2],
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing[3],
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  list: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    gap: Spacing[3],
  },
  subjectCard: {
    padding: Spacing[4],
  },
  planCard: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
  },
  pctBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  divider: {
    height: 1,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
