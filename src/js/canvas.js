import {
    selectors
} from "./constants.js";

const {
        canvasSelectors: {
        canvasSumOfCostPerUserSelector,
        canvasBalanceSelector
    },
} = selectors;

const canvasSumOfCostPerUserNode = document.querySelector(canvasSumOfCostPerUserSelector);
const canvasBalanceNode = document.querySelector(canvasBalanceSelector);

const GAP = 10;
const FONT_GAP = 16;
const HISTOGRAM_HEIGHT = 150;
const BAR_HEIGHT = HISTOGRAM_HEIGHT - FONT_GAP - GAP - GAP - FONT_GAP - GAP;
const BAR_WIDTH = 40;
const BAR_GAP = 40;

const MIDDLE_GAP = 160;
const TEXT_GAP = 25;
const GREEN_COLOR = '#9ed4a1';
const RED_COLOR = '#f1a692';
const ANY_SYMBOL = 8;
const MINUS_SYMBOL = 6;
const RUB_SYMBOL = 12;

export const canvas = {
    _findMaxValue(arr, property, isAbsCompare) {
        let maxValue = isAbsCompare ? Math.abs(arr[0][property]) : arr[0][property];

        for (var i = 0; i < arr.length; i++) {

            const comparableValue = isAbsCompare ? Math.abs(arr[i][property]) : arr[i][property]
            if (comparableValue > maxValue) {
                maxValue = comparableValue
            }
        }
        return maxValue;
    },

    canvasSumOfCostPerUser(resultArr) { // вывод итоговых затрат на каждого участника
        // const canvas = document.getElementById("canvas");
        canvasSumOfCostPerUserNode.width = BAR_WIDTH * resultArr.length + BAR_GAP * (resultArr.length - 1) + GAP * 4;
        canvasSumOfCostPerUserNode.height = HISTOGRAM_HEIGHT + GAP;
        const ctx = canvasSumOfCostPerUserNode.getContext("2d");

        ctx.font = '14px PT Sans';

        const maxValue = this._findMaxValue(resultArr, 'sumOfCostPerUser', false);

        resultArr.forEach((itemMember, iMember) => {
            const value = itemMember.sumOfCostPerUser;

            ctx.fillStyle = '#000';
            ctx.fillText(itemMember.name.length > 9 ? itemMember.name.slice(0, 9) + '…' : itemMember.name,
                GAP + (BAR_WIDTH + BAR_GAP) * iMember,
                HISTOGRAM_HEIGHT);

            Math.round(value) > 99999 ? ctx.font = '12px PT Sans' : ctx.font = '14px PT Sans';
            ctx.fillText(Math.round(value) + ' ₽',
                GAP + (BAR_WIDTH + BAR_GAP) * iMember,
                FONT_GAP + GAP + BAR_HEIGHT - (BAR_HEIGHT * value) / maxValue);
            ctx.font = '14px PT Sans';

            ctx.fillStyle = '#8d77d8';

            ctx.fillRect(GAP + (BAR_WIDTH + BAR_GAP) * iMember,
                HISTOGRAM_HEIGHT - FONT_GAP - GAP,
                BAR_WIDTH,
                -(BAR_HEIGHT * value) / maxValue);

        });
    },

    canvasBalance(resultArr) {
        // const canvas2 = document.getElementById("canvas2");
        canvasBalanceNode.width = MIDDLE_GAP * 2;
        canvasBalanceNode.height = BAR_WIDTH * resultArr.length + BAR_GAP * (resultArr.length - 1);
        const ctx = canvasBalanceNode.getContext("2d");

        ctx.font = '14px PT Sans';

        const maxAbsValue = this._findMaxValue(resultArr, 'balanceForStats', true);

        resultArr.forEach((itemMember, iMember) => {
            const value = itemMember.balanceForStats;
            const name = itemMember.name.length > 9 ? itemMember.name.slice(0, 9) + '…' : itemMember.name
            const isPositiveValue = value > 0 ? true : false;

            ctx.fillStyle = isPositiveValue ? GREEN_COLOR : RED_COLOR;

            ctx.fillRect(

                MIDDLE_GAP,

                (BAR_WIDTH + BAR_GAP) * iMember,

                isPositiveValue ? (MIDDLE_GAP * Math.abs(value)) / maxAbsValue : ((MIDDLE_GAP * Math.abs(value)) / maxAbsValue) * (-1),

                BAR_WIDTH);


            ctx.fillStyle = '#000';

            ctx.fillText(name,

                isPositiveValue ?
                MIDDLE_GAP - name.length * ANY_SYMBOL - GAP :
                GAP + MIDDLE_GAP,

                TEXT_GAP + (BAR_WIDTH + BAR_GAP) * iMember);


            Math.round(value) > 99999 ? ctx.font = '12px PT Sans' : ctx.font = '14px PT Sans';
            ctx.fillText(isPositiveValue ? '+ ' + Math.round(value) + ' ₽' : Math.round(value) + ' ₽',

                isPositiveValue ?
                GAP + MIDDLE_GAP :
                MIDDLE_GAP - Math.round(value).toString().length * ANY_SYMBOL - MINUS_SYMBOL - RUB_SYMBOL - GAP,

                TEXT_GAP + (BAR_WIDTH + BAR_GAP) * iMember);
            ctx.font = '14px PT Sans';

        });
    }

}