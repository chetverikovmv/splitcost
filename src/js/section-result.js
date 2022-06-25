/// РАЗДЕЛ "РЕЗУЛЬТАТ" ///

import {
    selectors
} from "./constants.js";
import {
    members
} from "./members.js";
import {
    costs
} from "./costs.js";
import {
    result
} from "./result.js";
import {
    ResultCard
} from "./Result-card.js";
import {
    Notification
} from "./Notification.js";

const {
    resultSelectors: {
        resultCardSelector,
        resultCopySelector,
        resultCopyButtonSelector,
        templateResult
    },
} = selectors;

export const sectionResult = {
    resultCopyButton: document.querySelector(resultCopyButtonSelector),

    calculateResult() {


        costs.costsList.forEach((item, i) => { // заполняем расходы и подсчитываем costPerUser
            result.costsList[i] = item; // перенос значения из исходного массива

            let countOfUsers = 0;
            for (let key in item.users) {
                if (item.users[key] == true) {
                    countOfUsers++
                }
            }

            result.costsList[i].costPerUser = item.value / countOfUsers;
        })

        members.membersList.forEach((itemMember, iMember) => { // заполняем участников и подсчитываем balance
            result.membersList[iMember] = itemMember; // перенос значения из исходного массива

            let sumOfCostPerUser = 0;
            let sumOfPayments = 0;
            result.costsList.forEach((itemCost) => {
                let keys = Object.keys(itemCost.users);
                let key = keys.find(itemKey =>
                    itemKey == `costuser${itemMember.id}`
                );

                if (itemCost.users[key]) {

                    sumOfCostPerUser += itemCost.costPerUser;
                }

                if (itemMember.id == itemCost.payer) {
                    sumOfPayments += parseInt(itemCost.value, 10)
                }
            })

            result.membersList[iMember].balance = sumOfCostPerUser - sumOfPayments;
            result.membersList[iMember].isPair = false; // отметка о наличии пары
            result.membersList[iMember].isPaymentWithinPair = false; // отметка о факте перевода внутри пары
        })

        // рендеринг
        const createResultCard = (isPair, isPaymentWithinPair, summ, creditor, name1, name2) => {
            return new ResultCard(templateResult, isPair, isPaymentWithinPair, summ, creditor, name1, name2).configureResultCard();
        };

        const resultCopyLink = document.querySelector(resultCopySelector); // нода перед которой вставляются карточки

        // расчёт
        let creditor = {};

        result.membersList.sort(function (a, b) {
            return b.pair.length - a.pair.length
        }) // сортировка массива участников чтоб в начале были с парами

        let resultPayementsWithinPairs = [];

        result.membersList.forEach((item) => {
            let member = item;
            let summ = 0;
            let memberPair = result.membersList[member.pair - 1];

            while (member.balance > 0) {
                if (member.pair > 0 && !member.isPair) {
                    creditor = result.membersList.find(findPair, member);
                    summ = member.balance;
                    memberPair.isPair = true; // отметка о наличии пары
                    memberPair.isPaymentWithinPair = true; // отметка о факте перевода внутри пары


                    resultPayementsWithinPairs.push({
                        summ: Math.round(summ),
                        creditor: creditor.name,
                        name: member.name
                    });

                } else {
                    creditor = result.membersList.find(findCreditor);
                    if (!creditor) { // выход из цикла, если из-за округления не нашелся кредитор, чтобы не падало в ошибку 
                        break
                    }
                    summ = Math.min(member.balance, Math.abs(creditor.balance));

                    if (member.pair > 0) {
                        resultCopyLink.before(createResultCard(true, false, Math.round(summ), creditor.name, member.name, memberPair.name).getResultCard()); // рисуем карточку результата

                    } else {

                        resultCopyLink.before(createResultCard(false, false, Math.round(summ), creditor.name, member.name).getResultCard()); // рисуем карточку результата
                    }
                }

                member.balance -= summ;
                creditor.balance += summ;
            }
        })

        //рендеринг карточек платежей внутри пар
        resultPayementsWithinPairs.forEach((item) => { // 
            resultCopyLink.before(createResultCard(false, true, item.summ, item.creditor, item.name).getResultCard()); // рисуем карточку результата
        })

        function findCreditor(member) {
            return member.balance < 0;
        }

        function findPair(member) {
            return member.id == this.pair;
        }
    },

    setListeners() {
        const successCopyingNotif = new Notification();

        this.resultCopyButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            let textResults = ''; // очистка на случай повторного нажатия кнопки "скопировать текст"
            const resultCards = document.querySelectorAll(resultCardSelector);
            resultCards.forEach((item) => {
                textResults += item.textContent + '\n' + '\n';
            })
            navigator.clipboard.writeText(textResults);
            successCopyingNotif.open('скопировано!', 3000);
        })
    },

    // очистка реультатов
    clearResults() {
        const resultCards = document.querySelectorAll(resultCardSelector);
        resultCards.forEach((itemNode) => {
            itemNode.remove();
        })
    }
}

sectionResult.setListeners();