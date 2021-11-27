<template>
    <div class="mahjong-game">
        <div class="game-panel">
            <div v-for="(item, index) in mahjong" :key="index" class="mahjong" :ref="setMahjongRefs">
                <template v-if="!item.cleared">
                    <template v-if="item.show">
                        <img
                            v-if="digitalCard.includes(item.type)"
                            :src="`/${item.type}/${item.value}.jpg`"
                            :style="{ width: '80%' }"
                        />
                        <img v-else :src="`/${item.type}.jpg`" :style="{ width: '80%' }" />
                    </template>
                    <img
                        v-else-if="canClick(index)"
                        src="/back.jpg"
                        class="mahjong-item-bg"
                        @click="mahjongClick(item, index)"
                    />
                    <div v-else class="mahjong-item-bg" />
                </template>
            </div>
        </div>
        <div class="score-panel">
            <h1 style="text-align: center">{{ playInfos[turnsIndex].name }} 玩家轮次</h1>
            <h2 v-for="player in playInfos" :key="player.name" class="score">
                {{ player.name }}：{{ player.score }} 分
            </h2>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onBeforeUpdate } from 'vue';
import { generateMahjong, shuffle, IMahjong } from './utils';
import { digitalCard } from './const';

const mapChineseToName = {
    中: 'zhong'
};

let shiningTimer: any;
let isShining = false;
const bgColors = ['#ff5000', '#fff'];

// 所有麻将
export default defineComponent({
    setup() {
        const mahjong = reactive(generateMahjong());
        shuffle(mahjong);
        let mahjongRefs: any[] = [];

        const setMahjongRefs = (el: any) => {
            if (el) {
                mahjongRefs.push(el);
            }
        };

        onBeforeUpdate(() => {
            mahjongRefs = [];
        });

        const playInfos = reactive([
            { name: 'A', score: 0 },
            { name: 'B', score: 0 }
        ]);
        const turnsIndex = ref(0);

        const canClick = (index: number) => {
            // 四边
            if (index < 12 || index >= 12 * 11) {
                return true;
            }
            // 只要上/下，有一个 clear 为 false 就不行
            let blocked = false;
            let nextIndex = index - 12;
            while (nextIndex >= 0) {
                if (!mahjong[nextIndex].cleared) {
                    blocked = true;
                    break;
                }
                nextIndex -= 12;
            }
            if (!blocked) {
                return true;
            }
            blocked = false;
            nextIndex = index + 12;
            while (nextIndex < 12 * 12) {
                if (!mahjong[nextIndex].cleared) {
                    blocked = true;
                    break;
                }
                nextIndex += 12;
            }
            return !blocked;
        };

        const mahjongClick = async (item: IMahjong, index: number) => {
            if (!canClick(index) || isShining) {
                return;
            }
            item.show = true;
            // 检查能否消除
            for (let i = 0; i < mahjong.length; i++) {
                if (
                    i !== index &&
                    mahjong[i].type === item.type &&
                    mahjong[i].value === item.value &&
                    mahjong[i].show &&
                    !mahjong[i].cleared
                ) {
                    // 闪烁
                    await new Promise((resolve) => {
                        let bgIdx = 0;
                        shiningTimer = setInterval(() => {
                            isShining = true;
                            bgIdx = (bgIdx + 1) % 2;
                            mahjongRefs[index].style.backgroundColor = bgColors[bgIdx];
                            mahjongRefs[i].style.backgroundColor = bgColors[bgIdx];
                        }, 300);
                        setTimeout(() => {
                            // 清除计时器
                            clearInterval(shiningTimer);
                            mahjongRefs[index].style.backgroundColor = '#fff';
                            mahjongRefs[i].style.backgroundColor = '#fff';
                            isShining = false;
                            resolve(true);
                        }, 1800);
                    });
                    // 设置状态
                    mahjong[i].cleared = true;
                    item.cleared = true;
                    // 计算分数
                    let score = 0;
                    if (digitalCard.includes(item.type as any)) {
                        score += item.value;
                    } else {
                        score += 10;
                    }
                    // 设置分数
                    playInfos[turnsIndex.value].score += score;
                    break;
                }
            }
            // 更新轮次
            turnsIndex.value = (turnsIndex.value + 1) % 2;
        };

        return {
            mapChineseToName,
            mahjongRefs,
            mahjong,
            digitalCard,
            playInfos,
            turnsIndex,
            mahjongClick,
            canClick,
            setMahjongRefs
        };
    }
});
</script>

<style scoped>
.mahjong-game {
    display: flex;
}

.game-panel {
    display: grid;
    height: calc(100vh - 16px);
    grid-template-columns: repeat(12, 95px);
    grid-template-rows: repeat(12, 95px);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
}
.mahjong {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    transition: 0.6s background ease;
}

.mahjong-item-bg {
    background: gray;
    width: 100%;
    height: 100%;
}

.score-panel {
    flex: 1;
}

.score {
    text-align: center;
}
</style>
