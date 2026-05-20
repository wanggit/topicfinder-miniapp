import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'

interface Question {
  id: number; type: string; difficulty: string; stem: string
  options: string; answer: string; explanation: string
}

export default function Answer() {
  const router = useRouter()
  const { kpId, kpName, free } = router.params as { kpId?: string; kpName?: string; free?: string }

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  const BASE = 'https://api.topicfinder.example.com'

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const body: any = { count: 10 }
      if (kpId) body.knowledgePointId = Number(kpId)
      if (free) body.freeDescription = decodeURIComponent(free)

      // In production, get token from storage
      const token = Taro.getStorageSync('token')
      const res = await fetch(`${BASE}/api/questions/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch (e) {
      console.error('Failed to load questions', e)
    } finally {
      setLoading(false)
    }
  }

  const q = questions[currentIdx]
  if (loading) return <View className='page'><Text>加载中...</Text></View>
  if (!q) return <View className='page'><Text>暂无题目</Text></View>

  const options = q.options ? JSON.parse(q.options) : []
  const selected = answers[q.id]

  const selectOption = (opt: string) => {
    setAnswers(prev => ({ ...prev, [q.id]: opt }))
  }

  const submitAnswer = () => {
    // Placeholder — grading will be wired in #26 (Grading API) + #29 (Result display)
    Taro.showToast({ title: '已提交', icon: 'success' })
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  return (
    <View className='page'>
      {/* Progress */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, color: '#999' }}>第 {currentIdx + 1}/{questions.length} 题</Text>
        <View style={{ height: 4, background: '#eee', borderRadius: 2, marginTop: 4 }}>
          <View style={{ height: 4, background: '#764ba2', borderRadius: 2, width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </View>
      </View>

      {/* Question stem */}
      <View style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, lineHeight: 1.6 }}>{q.stem}</Text>
      </View>

      {/* Answer area */}
      {q.type === 'choice' && (
        <View>
          {options.map((opt: string, i: number) => (
            <View key={i} onClick={() => selectOption(opt)}
              style={{
                padding: '14px 16px', marginBottom: 8, borderRadius: 8, border: '2px solid',
                borderColor: selected === opt ? '#764ba2' : '#eee',
                background: selected === opt ? '#f0e6ff' : '#fff',
              }}>
              <Text style={{ fontSize: 15 }}>{String.fromCharCode(65 + i)}. {opt}</Text>
            </View>
          ))}
        </View>
      )}

      {q.type === 'fill' && (
        <View style={{ marginTop: 8 }}>
          <input placeholder='请输入答案' value={answers[q.id] || ''}
            onInput={e => setAnswers(prev => ({ ...prev, [q.id]: e.detail.value }))}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, width: '100%', fontSize: 15 }} />
        </View>
      )}

      {q.type === 'essay' && (
        <View style={{ marginTop: 8 }}>
          <View style={{ marginBottom: 12 }}>
            <Button size='mini' onClick={() => Taro.chooseImage({ count: 1, success: res => {
              setAnswers(prev => ({ ...prev, [q.id]: '[photo]' }))
              Taro.showToast({ title: '照片已上传', icon: 'success' })
            }})}>📷 拍照上传</Button>
          </View>
          <input placeholder='或输入答案' value={answers[q.id] || ''}
            onInput={e => setAnswers(prev => ({ ...prev, [q.id]: e.detail.value }))}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, width: '100%', fontSize: 15 }} />
        </View>
      )}

      {/* Submit */}
      <View style={{ marginTop: 24 }}>
        <Button onClick={submitAnswer}
          style={{ background: '#764ba2', color: '#fff', borderRadius: 8 }}
          disabled={!answers[q.id]}>
          {currentIdx < questions.length - 1 ? '下一题' : '提交'}
        </Button>
      </View>
    </View>
  )
}
