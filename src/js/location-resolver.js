import {
    menu
} from "./main-menu.js";
import {
    mobileMenu
} from "./menu.js";

const locationResolver = (location) => {
    switch (location) {
        case "#/":
            menu.status != 'MainMode' ? menu.enableMainMode() : mobileMenu.closeMobileMenu();
            break;

        case "#/how-to-use":
            menu.enableHowToUseMode();
            break;

        case "#/about":
            menu.enableAboutMode();
            break;
    }
}

window.addEventListener('load', () => {
    const location = window.location.hash;

    if (location) {
        locationResolver(location)
    }
})

window.locationResolver = locationResolver; // чтобы работал onclick в разметке