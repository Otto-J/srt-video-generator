export interface Dialogue {
  id: number;
  role: 'xinbao' | 'Smart' | 'xiaoyu';
  startTime: number;
  endTime: number;
  text: string;
}

export const conversation: Dialogue[] = [
  {
    id: 1,
    role: 'xinbao',
    startTime: 0,
    endTime: 3,
    text: '大家好，欢迎来到我们的节目。今天我们来聊聊“裸辞”这个话题。',
  },
  {
    id: 2,
    role: 'Smart',
    startTime: 3.5,
    endTime: 6,
    text: '是的，现在很多年轻人都在考虑这个问题，这确实是一个热门话题。',
  },
  {
    id: 3,
    role: 'xiaoyu',
    startTime: 6.5,
    endTime: 10,
    text: '我最近就“裸辞”了，我觉得这是一个需要很大勇气的决定。',
  },
  {
    id: 4,
    role: 'xinbao',
    startTime: 10.5,
    endTime: 14,
    text: '哦？能和我们分享一下你的心路历程吗？是什么让你做出了这个决定？',
  },
  {
    id: 5,
    role: 'xiaoyu',
    startTime: 14.5,
    endTime: 19,
    text: '当然。最主要的原因还是工作压力太大，感觉自己的身心都达到了一个极限。',
  },
  {
    id: 6,
    role: 'Smart',
    startTime: 19.5,
    endTime: 23,
    text: '我理解。在职场中，我们常常会遇���各种各样的压力，学会自我调节很重要。',
  },
  {
    id: 7,
    role: 'xinbao',
    startTime: 23.5,
    endTime: 27,
    text: '那么，你“裸辞”之后有什么计划吗？是打算休息一段时间，还是马上寻找新的工作？',
  },
  {
    id: 8,
    role: 'xiaoyu',
    startTime: 27.5,
    endTime: 31,
    text: '我打算先给自己放个假，好好调整一下状态，然后再去寻找更适合自己的工作。',
  },
  {
    id: 9,
    role: 'Smart',
    startTime: 31.5,
    endTime: 35,
    text: '这是一个明智的选择。在职业生涯中，有时候“停下来”是为了更好地“出发”。',
  },
];
