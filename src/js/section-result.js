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

import {
    canvas
} from "./canvas.js"

const {
    resultSelectors: {
        resultCardSelector,
        resultCopySelector,
        resultCopyButtonSelector,
        resultTextLinkSelector,
        resultCopyLinkButtonSelector,
        resultStatsSelector,
        resultStatsBodySelector,
        resultStatsHeaderSelector,
        resultStatsTotalSelector,
        arrowIconSelector,
        templateResult,
        domain
    },
} = selectors;

const resultTextLink = document.querySelector(resultTextLinkSelector);
const resultStats = document.querySelector(resultStatsSelector);
const resultStatsBody = document.querySelector(resultStatsBodySelector);
const resultStatsTotal = document.querySelector(resultStatsTotalSelector);
const arrowIcon = document.querySelector(arrowIconSelector);

export const sectionResult = {
    resultCopyButton: document.querySelector(resultCopyButtonSelector),
    resultCopyLinkButton: document.querySelector(resultCopyLinkButtonSelector),
    resultStatsButton: document.querySelector(resultStatsHeaderSelector),

    calculateResult() {
        result.total = 0;

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
            result.membersList[iMember].sumOfCostPerUser = sumOfCostPerUser
            // result.total += parseInt(sumOfCostPerUser, 10);
            result.total += Math.round(sumOfCostPerUser);

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
            item.balanceForStats = item.balance * (-1);
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

        result.membersList.forEach((item) => { // повторный прогон на тот случай если остался участник с положительным балансом
            let member = item;
            let summ = 0;
            while (member.balance > 0) {
                creditor = result.membersList.find(findCreditor);
                if (!creditor) { // выход из цикла, если из-за округления не нашелся кредитор, чтобы не падало в ошибку 
                    break
                }
                summ = Math.min(member.balance, Math.abs(creditor.balance));

                resultCopyLink.before(createResultCard(false, false, Math.round(summ), creditor.name, member.name).getResultCard()); // рисуем карточку результата

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


        // вывод общих затрат (total)
        resultStatsTotal.innerHTML = '';
        const totalText = document.createElement('p');
        totalText.innerHTML = `Общие затраты (итого): <b>${result.total} ₽</b>`
        resultStatsTotal.append(totalText);

        // вывод итоговых затрат на каждого участника
        canvas.canvasSumOfCostPerUser(result.membersList);

        // вывод balance
        canvas.canvasBalance(result.membersList)

    },

    makeLinkToCalculation(currentCalculationId) {
        resultTextLink.value = `${domain}#/${currentCalculationId}`
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
        });

        this.resultCopyLinkButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            let textLink = resultTextLink.value;
            navigator.clipboard.writeText(textLink);
            successCopyingNotif.open('ссылка скопирована!', 3000);
        });

        this.resultStatsButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            if (resultStatsBody.classList.contains('result__stats-body--closed')) {
                resultStatsBody.classList.remove('result__stats-body--closed');
                resultStatsBody.classList.add('result__stats-body--opened');
                arrowIcon.classList.remove('arrow-icon--closed');
                arrowIcon.classList.add('arrow-icon--opened');
            } else {
                resultStatsBody.classList.remove('result__stats-body--opened');
                resultStatsBody.classList.add('result__stats-body--closed');
                arrowIcon.classList.remove('arrow-icon--opened');
                arrowIcon.classList.add('arrow-icon--closed');
            }

        });


        resultTextLink.addEventListener('click', () => { // выделение текста ссылки по клику
            resultTextLink.select();
        });

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