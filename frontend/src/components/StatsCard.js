import { View, Text, StyleSheet } from 'react-native';

export function StatsCard({ stats }) {
  const completionRate = stats.total > 0 
    ? Math.round((stats.done / stats.total) * 100) 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.card, styles.cardTotal]}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>📋</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>{stats.total}</Text>
            <Text style={styles.cardLabel}>Total de Tarefas</Text>
          </View>
        </View>

        <View style={[styles.card, styles.cardProgress]}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressValue}>{completionRate}%</Text>
          </View>
          <Text style={styles.progressLabel}>Progresso</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.cardPending]}>
          <View style={styles.cardHeader}>
            <View style={[styles.dot, styles.dotPending]} />
            <Text style={styles.cardLabelSmall}>Pendentes</Text>
          </View>
          <Text style={[styles.cardValueLarge, styles.textPending]}>{stats.pending}</Text>
        </View>

        <View style={[styles.card, styles.cardDone]}>
          <View style={styles.cardHeader}>
            <View style={[styles.dot, styles.dotDone]} />
            <Text style={styles.cardLabelSmall}>Concluídas</Text>
          </View>
          <Text style={[styles.cardValueLarge, styles.textDone]}>{stats.done}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    gap: 12
  },
  row: {
    flexDirection: 'row',
    gap: 12
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1
  },
  cardTotal: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  iconText: {
    fontSize: 22
  },
  cardContent: {
    flex: 1
  },
  cardValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff'
  },
  cardLabel: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2
  },
  cardProgress: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(233, 69, 96, 0.08)',
    borderColor: 'rgba(233, 69, 96, 0.2)'
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderWidth: 3,
    borderColor: '#e94560',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  progressValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 14,
    fontWeight: '700',
    color: '#e94560'
  },
  progressLabel: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  cardPending: {
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
    borderColor: 'rgba(255, 193, 7, 0.2)'
  },
  cardDone: {
    backgroundColor: 'rgba(0, 217, 165, 0.08)',
    borderColor: 'rgba(0, 217, 165, 0.2)'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  dotPending: {
    backgroundColor: '#ffc107'
  },
  dotDone: {
    backgroundColor: '#00d9a5'
  },
  cardLabelSmall: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)'
  },
  cardValueLarge: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 32,
    fontWeight: '700'
  },
  textPending: {
    color: '#ffc107'
  },
  textDone: {
    color: '#00d9a5'
  }
});

export default StatsCard;
