import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'

export default function Leaderboard() {
  const [list, setList] = useState<any[]>([])
  const BASE = 'http://localhost:3001'

  useEffect(() => {
    fetch(`${BASE}/api/leaderboard`).then(r => r.json()).then(setList).catch(() => {})
  }, [])

  return (
    <View className='page'>
      <Text className='page-title'>排行榜</Text>
      {list.map((item, idx) => (
        <View key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 8, marginBottom: 8 }}>
          <View style={{ display: 'flex', gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: idx < 3 ? '#faad14' : '#999' }}>#{idx + 1}</Text>
            <Text style={{ fontSize: 15 }}>学生{item.openid?.slice(-4)}</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#764ba2' }}>正确 {item.correct || 0}/{item.total || 0}</Text>
        </View>
      ))}
      {list.length === 0 && <Text style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>暂无数据</Text>}
    </View>
  )
}