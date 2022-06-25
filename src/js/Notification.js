import {
    selectors
} from "./constants.js";

const {
    notificationSelectors: {
        notificationSelector,
        notificationTextSelector,        
        notificationExitButtonSelector,        
        notificationShowClass,        
    },
} = selectors;

export class Notification {
    constructor(text) {
        this._notif = document.querySelector(notificationSelector);
        this._exitButton = this._notif.querySelector(notificationExitButtonSelector);
        this._notifText = this._notif.querySelector(notificationTextSelector);
        this._animationDuration =
            parseFloat(getComputedStyle(this._notif).transitionDuration) * 1000;
    }

    open(text, delay) {      
        this._notif.classList.add(notificationShowClass);  
        this.setEventListeners(); 
        this._notifText.innerHTML = text; // для переноса строк используется innerHTML
        setTimeout(() => this.close(), delay)
    }

    close() {
        this._notif.classList.remove(notificationShowClass);        
    }

    setEventListeners() {
        this._exitButton.addEventListener("click", () => this.close());        
    }
   
}