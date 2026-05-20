import { describe, expect, it } from 'vitest'
import { normalizeTree, normalizeVersions } from '../src/pages/learning/data'

describe('learning page data normalization', () => {
  it('returns version list when response is an array', () => {
    expect(normalizeVersions([{ id: 1, name: '苏教版' }])).toEqual([{ id: 1, name: '苏教版' }])
  })

  it('falls back to empty versions for error payloads', () => {
    expect(normalizeVersions({ error: { code: 'UNAUTHORIZED' } })).toEqual([])
  })

  it('falls back to empty tree for error payloads', () => {
    expect(normalizeTree({ error: { code: 'INTERNAL_ERROR' } })).toEqual([])
  })
})
