/// РАЗДЕЛ "РАСХОДЫ" ///

import {
    PopupWithMessage
} from "./popup-with-message.js";
import {
    selectors
} from "./constants.js";
import {
    PopupWithForm
} from "./popup-with-form.js";
import {
    members
} from "./members.js";
import {
    Cost
} from "./Cost.js";
import {
    costs
} from "./costs.js";
import {
    Notification
} from "./Notification.js";



const {
    popupsSelectors: {
        popupMessageSelector,
        popupAddCostSelector
    },

    costsSelectors: {
        addCostButtonSelector,
        costSelector,
        checkboxSelector,
        FiftyFiftySelector,
        validationMessageCostSelector,
        costsTextSelector,
        templateCost,
        templateCostUser
    },

    mainSelectors: {
        displayNoneClass
    },

    popupWithFormSelectors: {
        userListSelector,
        formSelector
    },

    modalCostSelectors: {
        selectSelector
    },

} = selectors;

const costPopup = new PopupWithForm(popupAddCostSelector,
    (evt) => { // по нажатию на "добавить"
        if (evt) {
            evt.preventDefault();
        }

        if (sectionCosts.checkCostValidity()) {
            let costProperties = [
                costPopup.getInputValues().name,
                costPopup.getInputValues().payer, // здесь id пэйера
                costPopup.getInputValues().sum,
                costPopup.getSelectValues(checkboxSelector)
            ];
            costs.addCostToList(...costProperties);

            costProperties[1] = sectionCosts.findNameById(costPopup.getInputValues().payer); // переписываем id пэйера в имя
            sectionCosts.addCostButton.before(createCost(costs.costsList.length, ...costProperties).getCost()); // рисуем карточку расхода

            costPopup.close();
        }
    },
    'сохранить');

// Подтверждение удаления расхода попап
const confirmDeleteCostPopup = new PopupWithMessage(
    popupMessageSelector,

    () => { // по клику на "да" (сабмит)
        costs.deleteCostFromList(confirmDeleteCostPopup._cardElement.costId);
        sectionCosts.clearCosts();
        sectionCosts.renderCosts();

        confirmDeleteCostPopup.close();
    },

    () => { // по клику на "отмена"
        confirmDeleteCostPopup.close();
    }
);

// изменение расхода (попап)
const costPopupEdit = new PopupWithForm(popupAddCostSelector,
    (evt) => { // по нажатию на "сохранить"
        if (evt) {
            evt.preventDefault();
        }

        if (sectionCosts.checkCostValidity()) {
            let costProperties = [
                costPopupEdit.getInputValues().name,

                costPopupEdit.getInputValues().payer, // здесь id пэйера
                costPopupEdit.getInputValues().sum,
                costPopupEdit.getSelectValues(checkboxSelector)
            ];

            costs.changeCostInList(costPopupEdit._cardElement.costId, ...costProperties);

            costPopupEdit._cardElement.costName = costProperties[0];
            costProperties[1] = sectionCosts.findNameById(costPopupEdit.getInputValues().payer); // переписываем id пэйера в имя
            costPopupEdit._cardElement.costPayer = costProperties[1];
            costPopupEdit._cardElement.costValue = costProperties[2];

            sectionCosts.clearCosts();
            sectionCosts.renderCosts();

            costPopupEdit.close();
        }
    },
    'сохранить');


// создание карточек раходов
const createCost = (costId, costName, costPayer, costValue) => {
    return new Cost(templateCost, costId, costName, costPayer, costValue, {

        clickHandler(evt) {
            evt.preventDefault();
            costPopupEdit._cardElement = this;

            if (!evt.target.classList.contains('costs__delete-pic')) { // если не попали на крестик

                costPopupEdit.open(`Расход №${this.costId}`,
                    members.membersList,
                    selectSelector,
                    sectionCosts.costUsersNodes(),
                    userListSelector);

                sectionCosts.validationMessages.forEach((item) => {
                    item.textContent = '';
                });

                const inputName = document.querySelector('input[name="name"]');
                const inputSum = document.querySelector('input[name="sum"]');
                const inputPayer = document.querySelector('select[name="payer"]');
                inputName.value = this.costName;
                inputSum.value = this.costValue;

                const selectNodeIndex = [...inputPayer.options].findIndex(option => option.textContent == this.costPayer); // находим в селекте индекс по имени


                inputPayer.options.selectedIndex = selectNodeIndex; // назначаем правильного пэйера
                costPopupEdit.setSelectValues(checkboxSelector, this.costId, costs.costsList) // назначаем чекбоксы 
                sectionCosts.manageFiftyFiftyCheckbox();
            };
        },

        deleteHandler(evt) {
            evt.preventDefault();
            confirmDeleteCostPopup._cardElement = this;
            confirmDeleteCostPopup.open('Удалить', 'Вы уверены?', 'да', 'отмена');
        }
    }).configureCost();
}

export const sectionCosts = {
    inputName: document.querySelector('input[name="name"]'),
    inputSum: document.querySelector('input[name="sum"]'),
    validationMessages: document.querySelector(formSelector).querySelectorAll(validationMessageCostSelector),
    addCostButton: document.querySelector(addCostButtonSelector),
    costsTextHint: document.querySelector(costsTextSelector), // подсказка добавить первый расход

    findNameById(id) { // переписываем id пэйера в имя
        const name = members.membersList[id - 1].name;
        return name;
    },

    setListeners() {
        this.inputName.addEventListener('change', () => {
            this.validationMessages[0].textContent = ''
        });

        this.inputSum.addEventListener('change', () => {
            this.validationMessages[1].textContent = ''
        });

        // добавление расхода по клику на конпку "добавить расход"
        this.addCostButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.addCostButton.blur(); // убираем фокус чтобы корректно отробатывало закрытие окна на "enter"
            this.costsTextHint.classList.add(displayNoneClass);

            costPopup.open(`Расход №${costs.costsList.length + 1}`,
                members.membersList,
                selectSelector,
                this.costUsersNodes(),
                userListSelector);

            this.validationMessages.forEach((item) => {
                item.textContent = '';
            });

            this.manageFiftyFiftyCheckbox();
        });
    },

    checkCostValidity() {
        let isValid = false;

        this.validationMessages.forEach((item) => {
            item.textContent = '';
        });
        if (!this.inputName.value) {
            this.validationMessages[0].textContent = 'Введите название расхода'
        };
        if (!this.inputSum.value) {
            this.validationMessages[1].textContent = 'Введите сумму расхода'
        }

        let numberOfCheckedBoxes = 0;
        const obj = costPopup.getSelectValues(checkboxSelector);

        for (let key in obj) {
            if (obj[key] == true) {
                numberOfCheckedBoxes++
            }
        }

        if (numberOfCheckedBoxes < 1) {
            this.validationMessages[2].textContent = 'Укажите хотя бы 1-го пользователя'
        }

        if (this.inputName.value && this.inputSum.value && numberOfCheckedBoxes > 0) {
            isValid = true
        } else {
            const invalidFieldsOfCostNotif = new Notification();
            invalidFieldsOfCostNotif.open('Заполните необходимые поля!', 3000);
        }
        return isValid
    },

    // создание массива юзеров
    costUsersNodes() {
        const costUsersNodesList = [];

        members.membersList.forEach((item, i) => {
            const userNode = document.querySelector(templateCostUser).content.cloneNode(true);

            userNode.querySelector('.cost-user').dataset.id = item.id;
            userNode.querySelector('.checkbox').htmlFor = `cost-user-${item.id}`;
            userNode.querySelector('.input').id = `cost-user-${item.id}`;
            userNode.querySelector('.input').name = `costuser${item.id}`;
            userNode.querySelector('.checkbox-indicator').textContent = item.name;

            costUsersNodesList[i] = userNode;
        });

        return costUsersNodesList
    },

    // очистка расходов
    clearCosts() {
        const costsNodes = document.querySelectorAll(costSelector);

        costsNodes.forEach((itemNode) => {
            itemNode.remove();
        })
    },

    //добавление циклом карточек участников из массива
    renderCosts() {
        costs.costsList.forEach((item) => {
            this.addCostButton.before(createCost(item.id, item.name, sectionCosts.findNameById(item.payer), item.value, item.users).getCost());
        })
    },

    // логика работы чекбоксов пользователей расхода и общего чекбокса ("Разделить поровну" (fifty-fifty))
    manageFiftyFiftyCheckbox() {
        const CostUsersCheckboxes = document.querySelectorAll(checkboxSelector);
        const FiftyFiftyCheckbox = document.querySelector(FiftyFiftySelector);

        const setFiftyFiftyCheckbox = () => {

            let numberOfCheckedBoxes = 0;
            CostUsersCheckboxes.forEach((item) => {
                if (item.checked) {
                    numberOfCheckedBoxes++
                }
            });


            if (numberOfCheckedBoxes == CostUsersCheckboxes.length) {
                FiftyFiftyCheckbox.checked = true
            };

            if (numberOfCheckedBoxes < CostUsersCheckboxes.length) {
                FiftyFiftyCheckbox.checked = false

            }
        }

        setFiftyFiftyCheckbox();

        CostUsersCheckboxes.forEach((item) => {
            item.addEventListener('change', () => {
                this.validationMessages[2].textContent = ''; // очищаем сообщение о валидации по перечню чекбоксов (пользователи расхода)
                setFiftyFiftyCheckbox();
            })
        })

        FiftyFiftyCheckbox.addEventListener('change', () => {
            if (FiftyFiftyCheckbox.checked) {
                CostUsersCheckboxes.forEach((item) => {
                    item.checked = true
                });
            }

            if (!FiftyFiftyCheckbox.checked) {
                CostUsersCheckboxes.forEach((item) => {
                    item.checked = false
                });
            }
        })
    }

}

sectionCosts.setListeners();