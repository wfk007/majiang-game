// 数字牌：0-9，每个四张
export const digitalCard = ['餅', '萬', '條'] as const;

// 字牌
export const wordCard = ['中', '發', '白', '東', '南', '西', '北'] as const;

// 其他牌
export const additionalCard = ['春', '夏', '秋', '冬'] as const;

export const cardConfig = [
    { type: digitalCard, typeNumber: 9, amount: 4 },
    { type: wordCard, typeNumber: 1, amount: 4 },
    { type: additionalCard, typeNumber: 1, amount: 2 }
] as const;