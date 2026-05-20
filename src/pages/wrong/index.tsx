import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { authenticatedFetch } from '../../utils/auth'

export default function Wrong() {
  const [items, setItems] = useState<any[]>([])
  const BASE = 'http://localhost:3001'

  useEffect(() => {
    authenticatedFetch('/api/wrong-notes')
      .then(r => r.json()).then(setItems).catch(() => {})
  }, [])

  const retryQuestion = (q: any) => {
    Taro.navigateTo({ url: `/pages/learning/answer?kpId=${q.knowledge_point_id}&kpName=${q.kp_name}` })
  }

  return (
    <View className='page'>
      <Text className='page-title'>错题本</Text>
      {items.length === 0 ? (
        <Text style={{ color: '#999', marginTop: 40, textAlign: 'center' }}>暂无错题，继续加油！</Text>
      ) : (
        items.map(item => (
          <View key={item.id} onClick={() => retryQuestion(item)}
            style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, border: '1px solid #eee' }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: '#764ba2' }}>{item.kp_name}</Text>
              <Text style={{ fontSize: 12, color: '#999' }}>已正确 {item.consecutive_correct}/3 次</Text>
            </View>
            <Text style={{ fontSize: 15, lineHeight: 1.5 }}>{item.stem}</Text>
          </View>
        ))
      )}
    </View>
  )
}
