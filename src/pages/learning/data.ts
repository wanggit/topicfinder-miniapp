export interface Version {
  id: number
  name: string
}

export interface KpNode {
  id: number
  name: string
}

export interface Subject {
  id: number
  name: string
  knowledgePoints: KpNode[]
}

export interface Grade {
  id: number
  name: string
  subjects: Subject[]
}

export function normalizeVersions(data: unknown): Version[] {
  return Array.isArray(data) ? data as Version[] : []
}

export function normalizeTree(data: unknown): Grade[] {
  return Array.isArray(data) ? data as Grade[] : []
}
