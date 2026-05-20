import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Grade, normalizeTree, normalizeVersions, Version } from './data'

export default function Learning() {
  const [versions, setVersions] = useState<Version[]>([])
  const [tree, setTree] = useState<Grade[]>([])
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [expandedGrade, setExpandedGrade] = useState<number | null>(null)
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null)
  const [freeInput, setFreeInput] = useState('')

  const BASE = 'http://localhost:3001'

  useEffect(() => {
    fetch(`${BASE}/api/versions`)
      .then(r => r.json())
      .then(data => {
        const list = normalizeVersions(data)
        setVersions(list)
        setSelectedVersion(current => current ?? list[0]?.id ?? null)
      })
      .catch(() => {
        setVersions([])
        setSelectedVersion(null)
      })
  }, [])

  useEffect(() => {
    if (!selectedVersion) {
      setTree([])
      return
    }

    fetch(`${BASE}/api/knowledge/tree?versionId=${selectedVersion}`)
      .then(r => r.json())
      .then(data => setTree(normalizeTree(data)))
      .catch(() => setTree([]))
  }, [selectedVersion])

  const startPractice = (kpId: number, kpName: string) => {
    Taro.navigateTo({ url: `/pages/learning/answer?kpId=${kpId}&kpName=${kpName}` })
  }

  const startFreePractice = async () => {
    if (!freeInput.trim()) return
    Taro.navigateTo({ url: `/pages/learning/answer?free=${encodeURIComponent(freeInput)}` })
  }

  return (
    <View className='page'>
      <Text className='page-title'>选题学习</Text>

      <ScrollView scrollX style={{ whiteSpace: 'nowrap', marginBottom: 16 }}>
        {versions.map(v => (
          <Text key={v.id}
            onClick={() => setSelectedVersion(v.id)}
            style={{
              display: 'inline-block', padding: '8px 16px', marginRight: 8, borderRadius: 16,
              background: selectedVersion === v.id ? '#764ba2' : '#eee',
              color: selectedVersion === v.id ? '#fff' : '#333', fontSize: 14,
            }}
          >{v.name}</Text>
        ))}
      </ScrollView>

      <View style={{ display: 'flex', marginBottom: 16, gap: 8 }}>
        <Input placeholder='描述你想练的内容，如"一元一次方程"' borderless
          value={freeInput} onInput={e => setFreeInput(e.detail.value)}
          style={{ flex: 1, border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 14 }} />
        <Text onClick={startFreePractice}
          style={{ padding: '8px 16px', background: '#764ba2', color: '#fff', borderRadius: 8, fontSize: 14, lineHeight: '36px' }}>
          开始
        </Text>
      </View>

      <View>
        {tree.map(grade => (
          <View key={grade.id} style={{ marginBottom: 12 }}>
            <View onClick={() => setExpandedGrade(expandedGrade === grade.id ? null : grade.id)}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f0e6ff', borderRadius: 8 }}>
              <Text style={{ fontWeight: 600, fontSize: 16 }}>{grade.name}</Text>
              <Text style={{ color: '#764ba2' }}>{expandedGrade === grade.id ? '收起' : '展开'}</Text>
            </View>

            {expandedGrade === grade.id && grade.subjects && grade.subjects.map(subject => (
              <View key={subject.id} style={{ marginLeft: 16, marginTop: 8 }}>
                <View onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f5f5f5', borderRadius: 6 }}>
                  <Text style={{ fontWeight: 500, fontSize: 15 }}>{subject.name}</Text>
                  <Text style={{ color: '#764ba2' }}>{expandedSubject === subject.id ? '收起' : '展开'}</Text>
                </View>

                {expandedSubject === subject.id && subject.knowledgePoints && subject.knowledgePoints.map(kp => (
                  <View key={kp.id} onClick={() => startPractice(kp.id, kp.name)}
                    style={{ marginLeft: 32, marginTop: 4, padding: '10px 14px', background: '#fff', borderRadius: 6, border: '1px solid #eee' }}>
                    <Text style={{ color: '#764ba2', fontSize: 14 }}>{kp.name}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
