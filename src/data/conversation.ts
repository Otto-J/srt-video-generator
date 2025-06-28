import config from './config.json'

export interface Dialogue {
  id: number
  role: string
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
  [key: string]: string
}
const speakerMap: SpeakerMap = {
  ...config.speakers.reduce((acc, i) => {
    acc[i.type] = i.name
    return acc
  }, {} as SpeakerMap),
  ...config.guest.reduce((acc, i) => {
    acc[i.type] = i.name
    return acc
  }, {} as SpeakerMap),
}

// 生成 conversation
export async function conversation(): Promise<Dialogue[]> {
  const demo = await import(/* @vite-ignore */ `./${config.srtWords}.json`)
  return (demo.default as DemoSpeaker[])
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
}
