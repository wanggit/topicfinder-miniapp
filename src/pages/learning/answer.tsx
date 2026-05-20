import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Button, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { authenticatedFetch } from '../../utils/auth'

interface Question {
  id: number; type: string; difficulty: string; stem: string
  options: string; answer: string; explanation: string
}

interface GradeResult {
  isCorrect: boolean; explanation: string
}

export default function Answer() {
  const router = useRouter()
  const { kpId, kpName, free } = router.params as { kpId?: string; kpName?: string; free?: string }

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [results, setResults] = useState<Record<number, GradeResult>>({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [hintMsg, setHintMsg] = useState('')
  const [hintReply, setHintReply] = useState('')

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const body: any = { count: 10 }
      if (kpId) body.knowledgePointId = Number(kpId)
      if (free) body.freeDescription = decodeURIComponent(free)

      const res = await authenticatedFetch('/api/questions/select', {
        method: 'POST',
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

  const submitAnswer = async () => {
    const q = questions[currentIdx]
    if (!q) return
    const studentAnswer = selected || answers[q.id]
    if (!studentAnswer) return

    setSubmitting(true)
    try {
      const res = await authenticatedFetch('/api/grade', {
        method: 'POST',
        body: JSON.stringify({ questionId: q.id, studentAnswer }),
      })
      const data = await res.json()
      setResults(prev => ({ ...prev, [q.id]: data }))
    } catch (e) {
      console.error('Failed to grade', e)
    } finally {
      setSubmitting(false)
    }
  }

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelected('')
      setShowHint(false)
      setHintReply('')
    } else {
      Taro.navigateBack()
    }
  }

  if (loading) {
    return (
      <View style={{ padding: 24, textAlign: 'center' }}>
        <Text>加载中...</Text>
      </View>
    )
  }

  if (questions.length === 0) {
    return (
      <View style={{ padding: 24, textAlign: 'center' }}>
        <Text>暂无题目</Text>
      </View>
    )
  }

  const q = questions[currentIdx]
  const result = results[q.id]
  let options: string[] = []
  try { options = JSON.parse(q.options) } catch { options = [] }

  return (
    <ScrollView style={{ height: '100vh' }} scrollY>
      <View style={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: '#999' }}>第 {currentIdx + 1}/{questions.length} 题</Text>
          <View style={{ height: 4, background: '#eee', borderRadius: 2, marginTop: 4 }}>
            <View style={{ height: 4, background: '#764ba2', borderRadius: 2, width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </View>
        </View>

        <View style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, lineHeight: 1.6 }}>{q.stem}</Text>
        </View>

        {!result && (
          <>
            {q.type === 'choice' && (
              <View>
                {options.map((opt: string, i: number) => (
                  <View key={i} onClick={() => setSelected(opt)}
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
              <Input placeholder='请输入答案' borderless
                value={answers[q.id] || ''}
                onInput={e => setAnswers(prev => ({ ...prev, [q.id]: e.detail.value }))}
                style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, width: '100%', fontSize: 15 }} />
            )}

            {q.type === 'essay' && (
              <View>
                <Button size='mini' onClick={() => {
                  setAnswers(prev => ({ ...prev, [q.id]: '[photo]' }))
                  Taro.showToast({ title: '照片已上传', icon: 'success' })
                }}>拍照上传</Button>
                <Input placeholder='或输入答案' borderless
                  value={answers[q.id] || ''}
                  onInput={e => setAnswers(prev => ({ ...prev, [q.id]: e.detail.value }))}
                  style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, width: '100%', fontSize: 15, marginTop: 8 }} />
              </View>
            )}
          </>
        )}

        {result && (
          <View style={{ padding: 20, borderRadius: 12, background: result.isCorrect ? '#f6ffed' : '#fff2f0', border: `2px solid ${result.isCorrect ? '#52c41a' : '#ff4d4f'}`, marginBottom: 16 }}>
            <Text style={{ fontSize: 24, display: 'block', textAlign: 'center', marginBottom: 8 }}>{result.isCorrect ? '回答正确！' : '再想想～'}</Text>
            <Text style={{ fontSize: 15, color: '#666', lineHeight: 1.5 }}>{result.explanation}</Text>
            {!result.isCorrect && (
              <View style={{ marginTop: 12, textAlign: 'center' }}>
                <Button size='mini' onClick={() => setShowHint(true)}
                  style={{ background: '#fff', color: '#764ba2', border: '1px solid #764ba2', borderRadius: 8 }}>
                  请求提示
                </Button>
              </View>
            )}
          </View>
        )}

        {showHint && (
          <View style={{ background: '#f9f0ff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>辅导对话</Text>
            {hintReply && (
              <View style={{ background: '#fff', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#333' }}>{hintReply}</Text>
              </View>
            )}
            <View style={{ display: 'flex', gap: 8 }}>
              <Input placeholder='输入你的问题...' borderless
                value={hintMsg}
                onInput={e => setHintMsg(e.detail.value)}
                style={{ flex: 1, border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', fontSize: 14 }} />
              <Button size='mini' onClick={() => { setHintReply('这是一个示例提示回复（需WebSocket对接）'); setHintMsg(''); }}
                style={{ background: '#764ba2', color: '#fff', borderRadius: 8 }}>
                发送
              </Button>
            </View>
          </View>
        )}

        <View style={{ marginTop: 24 }}>
          {!result ? (
            <Button onClick={submitAnswer} loading={submitting}
              style={{ background: '#764ba2', color: '#fff', borderRadius: 8 }}
              disabled={!selected && !answers[q.id]}>
              提交
            </Button>
          ) : (
            <Button onClick={nextQuestion}
              style={{ background: '#764ba2', color: '#fff', borderRadius: 8 }}>
              {currentIdx < questions.length - 1 ? '下一题' : '查看报告'}
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  )
}
