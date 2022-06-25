import {
    selectors,
    keyCodes
} from "./constants.js";

const {
    membersSelectors: {
        memberSelector,
        memberNameSelector,
        memberPairSelector
    },
    mainSelectors: {
        displayNoneClass
    },

} = selectors;

const {
    enterKeyCode
} = keyCodes;

export class Member {
    constructor(
        templateSelector, id, name, {
            deleteHandler,
            changeInputHandler,
            changeSelectHandler
        }
    ) {
        this._deleteHandler = deleteHandler.bind(this);
        this._changeInputHandler = changeInputHandler.bind(this);
        this._changeSelectHandler = changeSelectHandler.bind(this);
        this.id = id;
        this.name = name;
        this._template = document
            .querySelector(templateSelector)
            .content.querySelector(memberSelector);
    }

    _getTemplate() {
        return this._template.cloneNode(true);
    }

    configureMember() {
        this._member = this._getTemplate();

        this._labelName = this._member.querySelector(memberNameSelector).children[0];
        this._inputName = this._member.querySelector(memberNameSelector).children[1];
        this._deleteButton = this._member.querySelector(memberNameSelector).children[2];
        this._labelPair = this._member.querySelector(memberPairSelector).children[0];
        this._selectPair = this._member.querySelector(memberPairSelector).children[1];
        this._memberPair = this._member.querySelector(memberPairSelector);

        this.setProperties(this.id, this.name);
        this._setListeners();
        return this;
    }

    getMember() {
        return this._member;
    }

    setProperties(id, name) {
        this._labelName.textContent = `Участник\u00A0№${id}:`;
        this._labelName.htmlFor = `member-name-${id}`;
        this._inputName.id = `member-name-${id}`;
        this._inputName.value = name;

        this._deleteButton.dataset.id = id;
        if (this.id === 1 || this.id === 2) {
            this._deleteButton.classList.add(displayNoneClass);
            this._memberPair.classList.add(displayNoneClass);
        };
        this._labelPair.htmlFor = `member-pair-${id}`;
        this._selectPair.id = `member-pair-${id}`;        
        return this;
    }

    _setListeners() {
        this._deleteButton.addEventListener('click', this._deleteHandler);
        this._inputName.addEventListener('change', this._changeInputHandler);
        this._inputName.addEventListener('keydown', (evt) => {
            if (evt.key === enterKeyCode) {
                evt.preventDefault();
                this._inputName.blur(); // по нажатию на enter убираем фокус
            }
        });
        this._selectPair.addEventListener('change', this._changeSelectHandler);
        return this;
    }

}