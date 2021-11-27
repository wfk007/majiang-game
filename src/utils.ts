// 生成麻将
import { cardConfig, digitalCard, wordCard, additionalCard } from './const';

export interface IMahjong {
    type: typeof digitalCard[number] | typeof wordCard[number] | typeof additionalCard[number];
    value: number;
    index: number;
    show: boolean; // 展示正面还是背面
    cleared: boolean; // 是否被消除
}

// 生成麻将牌
export const generateMahjong: () => IMahjong[] = () => {
    const result = [];
    // 先处理数字牌
    for (let i = 0; i < cardConfig.length; i++) {
        const { type, typeNumber, amount } = cardConfig[i];
        for (let j = 0; j < type.length; j++) {
            for (let m = 1; m <= typeNumber; m++) {
                for (let n = 1; n <= amount; n++) {
                    result.push({
                        type: type[j],
                        value: m,
                        index: n,
                        show: false,
                        cleared: false,
                    });
                }
            }
        }
    }
    return result;
};

export const shuffle = (mahjong: any[]) => {
    mahjong.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
};
