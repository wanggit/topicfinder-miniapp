import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { authenticatedFetch } from '../../utils/auth'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>({})

  useEffect(() => {
    authenticatedFetch('/api/profile')
      .then(r => r.json()).then(setProfile).catch(() => {})
  }, [])

  return (
    <View className='page'>
      <Text className='page-title'>学习仪表盘</Text>
      <View style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <StatCard label='今日做题' value={profile.today_questions || 0} />
        <StatCard label='今日正确' value={profile.today_correct || 0} color='#52c41a' />
      </View>
      <View style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
        <Text style={{ fontWeight: 600, marginBottom: 12, display: 'block' }}>学习状态</Text>
        <Text style={{ color: '#666' }}>试用至 {profile.trial_expires_at ? new Date(profile.trial_expires_at).toLocaleDateString() : '加载中...'}</Text>
      </View>
    </View>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <View style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: 700, color: color || '#764ba2' }}>{value}</Text>
      <Text style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{label}</Text>
    </View>
  )
}
