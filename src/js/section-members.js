/// РАЗДЕЛ "УЧАСТНИКИ" ///

import {
    PopupWithMessage
} from "./popup-with-message.js";
import {
    selectors
} from "./constants.js";
import {
    Member
} from "./Member.js";
import {
    members
} from "./members.js";
import {
    Notification
} from "./Notification.js";

const {
    popupsSelectors: {
        popupMessageSelector,
    },

    membersSelectors: {
        eventNameSelector,
        addMemberButtonSelector,
        memberSelector,
        memberPairSelector,
        validationMessageMemberSelector,
        templateMember
    },

    mainSelectors: {

        displayNoneClass
    },
} = selectors;

// Подтверждение удаления участника попап
const confirmDeletePopup = new PopupWithMessage(
    popupMessageSelector,

    () => { // по клику на "да" (сабмит)              
        members.deleteMemberFromList(confirmDeletePopup._cardElement.id);

        sectionMembers.clearMembers();
        sectionMembers.renderMembers();
        confirmDeletePopup.close();
    },

    () => { // по клику на "отмена"
        confirmDeletePopup.close();
    }
);


// создание карточек участников
const createMember = (id, name) => {
    return new Member(templateMember, id, name, {

        deleteHandler(evt) {
            evt.preventDefault();
            confirmDeletePopup._cardElement = this;
            confirmDeletePopup.open('Удалить', 'Вы уверены?', 'да', 'отмена');
        },

        changeInputHandler() {
            const membersNodes = document.querySelectorAll(memberSelector);
            const input = membersNodes[(this.id - 1)].querySelector(`#member-name-${this.id}`);
            members.membersList[this.id - 1].name = input.value;
            sectionMembers.setOptions();

            const validationMessage = membersNodes[(this.id - 1)].querySelector(validationMessageMemberSelector);
            validationMessage.textContent = '';
            membersNodes.forEach((item, i) => {
                if (item.querySelector(`#member-name-${i + 1}`).value == input.value &&
                    (i + 1) !== this.id) {
                    validationMessage.textContent = 'Такое имя уже есть'
                }
            })

            if (input.value == '') {
                validationMessage.textContent = 'Введите имя'
            }
        },

        changeSelectHandler() {

            const membersNodes = document.querySelectorAll(memberSelector);
            const select = membersNodes[(this.id - 1)].querySelector(`#member-pair-${this.id}`);
            const selectValue = select.options[select.selectedIndex].value;

            const setPairSelect = () => {
                membersNodes.forEach((itemNode, idNode) => {
                    const currentSelect = itemNode.querySelector(`#member-pair-${idNode+1}`);

                    if (this.id == currentSelect.options[currentSelect.selectedIndex].value) {
                        currentSelect.options.selectedIndex = 0;
                        members.membersList[idNode].pair = 0;

                    } // проверка если сам участник уже в паре

                    if (selectValue == currentSelect.options[currentSelect.selectedIndex].value &&
                        idNode !== (this.id - 1)) {
                        currentSelect.options.selectedIndex = 0;
                        members.membersList[idNode].pair = 0;
                    } // проверка если тот кого выбираем уже в паре
                })

                const pairSelect = membersNodes[(selectValue - 1)].querySelector(`#member-pair-${selectValue}`);
                const pairIndex = [...pairSelect.options].findIndex(option => option.value == this.id);
                pairSelect.options.selectedIndex = pairIndex;

                members.membersList[this.id - 1].pair = parseInt(selectValue, 10); // записываем пару 
                members.membersList[selectValue - 1].pair = this.id // записываем пару выбранному (выбираемого)
            }

            const clearPairSelect = () => {
                membersNodes.forEach((itemNode, idNode) => {
                    const currentSelect = itemNode.querySelector(`#member-pair-${idNode+1}`);

                    if (currentSelect.options[currentSelect.selectedIndex].value == this.id) {
                        currentSelect.options.selectedIndex = 0;
                    }
                })

                const currentMember = members.membersList[this.id - 1];
                members.membersList[currentMember.pair - 1].pair = 0; // чистим пару ему
                currentMember.pair = 0; // чистим пару себе

            }

            selectValue == 'no' ? clearPairSelect() : setPairSelect();
        }

    }).configureMember();
};


export const sectionMembers = {

    eventNameInput: document.querySelector(eventNameSelector),

    _addMemberButton: document.querySelector(addMemberButtonSelector),

    setListeners() {
        // слушатель изменения названия мероприятия
        this.eventNameInput.addEventListener('change', () => {
            members.eventName = this.eventNameInput.value;
        });

        // добавление участника по клику
        this._addMemberButton.addEventListener('click', (evt) => {
            evt.preventDefault();

            let isEmptyFields = false;
            const membersNodes = document.querySelectorAll(memberSelector);
            let numberOfEmpyFields = 0;

            membersNodes.forEach((item, i) => {
                let validationMessage = item.querySelector(validationMessageMemberSelector);
                if (!item.querySelector(`#member-name-${i + 1}`).validity.valid) {
                    numberOfEmpyFields++;
                    validationMessage.textContent = 'Введите имя'
                }
            })

            numberOfEmpyFields > 0 ? isEmptyFields = false : isEmptyFields = true;

            if (isEmptyFields) {
                members.addMemberToList();
                this._addMemberButton.before(createMember(members.membersList.length, '').getMember());
                if (members.membersList.length == 3) {
                    this._removeDisplayNoneFromMemberPairs();

                    const hintAboutPairsNotif = new Notification();
                    hintAboutPairsNotif.open('Если желаете, укажите, кто состоит <b>в&nbsp;паре</b> и имеет общий бюджет.<br/><br/> Например, это могут быть муж и жена — SplitCost учтет это, и один из супругов разом рассчитается за свою пару.<br/><br/> Кроме того, будет показано как произвести взаиморасчет внутри пары, если это необходимо.', 15000);
                }

                this.setOptions();
            }

            const confirmEmptyFieldsPopup = new PopupWithMessage(
                popupMessageSelector,
                () => {
                    confirmEmptyFieldsPopup.close();
                },
                () => {
                    confirmEmptyFieldsPopup.close();
                }
            );
            if (!isEmptyFields) {
                confirmEmptyFieldsPopup.open('Пустые поля', `Заполните пропущенные имена участников`, 'OK', 'no cancel button');

            }
        });

    },

    //добавление циклом карточек участников из массива
    renderMembers() {
        members.membersList.forEach((item) => {
            this._addMemberButton.before(createMember(item.id, item.name).getMember());
        })
        if (members.membersList.length > 2) {
            this._removeDisplayNoneFromMemberPairs();
        }
        this.setOptions();
    },

    // удаление display-none с блока пар
    _removeDisplayNoneFromMemberPairs() {
        let memberPairs = document.querySelectorAll(memberPairSelector);
        memberPairs.forEach((item) => {
            item.classList.remove(displayNoneClass)
        })
    },

    // очистка участников
    clearMembers() {
        const membersNodes = document.querySelectorAll(memberSelector);

        membersNodes.forEach((itemNode) => {
            itemNode.remove();
        })
    },

    // назначение опшинов у селектов участников
    setOptions() {
        const memberNodes = document.querySelectorAll(memberSelector);

        memberNodes.forEach((itemNode, idNode) => {
            let selectNode = itemNode.querySelector(`#member-pair-${idNode+1}`);

            // генерируем опшины
            selectNode.length = 0;
            selectNode.append(new Option('—', 'no'));

            members.membersList.forEach((item) => {
                if ((idNode + 1) !== item.id) {

                    item.name ? selectNode.append(new Option(item.name, item.id)) :
                        selectNode.append(new Option(`Введите имя участника № ${item.id}`, item.id));
                }
            })

            // назначаем выбранный опшин
            const selectNodeIndex = [...selectNode.options].findIndex(option => option.value == members.membersList[idNode].pair);

            if (selectNodeIndex > 0) {
                selectNode.options.selectedIndex = selectNodeIndex;
            }
        })
    }
}

sectionMembers.setListeners();