import demo from './demo.json'

export interface Dialogue {
  id: number
  role: 'xinbao' | 'Smart' | 'xiaoyu'
  startTime: number
  endTime: number
  text: string
}

interface DemoWord {
  bt: number
  et: number
  text: string
}

interface DemoSpeaker {
  speaker: string
  words: DemoWord[]
}

// 角色映射表
type SpeakerMap = {
  [key: string]: 'xinbao' | 'Smart' | 'xiaoyu'
}
const speakerMap: SpeakerMap = {
  c2: 'xinbao',
  c3: 'Smart',
  c4: 'xiaoyu',
}

// 生成 conversation
export const conversation: Dialogue[] = (demo as DemoSpeaker[])
  .flatMap((item) => {
    const role = speakerMap[item.speaker]
    if (!role) return []
    return item.words.map((w) => ({
      id: 0, // 占位，后面统一编号
      role,
      startTime: w.bt / 1000,
      endTime: w.et / 1000,
      text: w.text,
    }))
  })
  .map((d, i) => ({ ...d, id: i + 1 }))
