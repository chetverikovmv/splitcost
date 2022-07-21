export class Backend {
    addToLocalStorage(data) {
        const allDataFromLocalStorage = JSON.parse(localStorage.getItem('original-objects') || '[]');

        allDataFromLocalStorage.push(data);
        localStorage.setItem('original-objects', JSON.stringify(allDataFromLocalStorage));
    }

    changeInLocalStorage(data) {
        const allDataFromLocalStorage = JSON.parse(localStorage.getItem('original-objects') || '[]');

        const updatedDataForLocalStorage = allDataFromLocalStorage.map(x => (x.id === localStorage.getItem('current') ? data : x));
        localStorage.setItem('original-objects', JSON.stringify(updatedDataForLocalStorage));
    }

    create(data, textLinkCallback) {
        return fetch('https://splitcost-6d61b-default-rtdb.europe-west1.firebasedatabase.app/data.json', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(response => {
                data.id = response.name;
                localStorage.setItem('current', response.name);
                textLinkCallback(response.name);
                window.location.hash = `#/${response.name}`
                return data
            })
            .then((data) => {
                this.addToLocalStorage(data)
            })
            .catch((e) => {
                console.log(e)
            })

    }

    change(data) {
        let key = localStorage.getItem('current');
        let obj = {};
        obj[key] = data; // '-N76p81bnOXMMNtgYgoi': data

        return fetch('https://splitcost-6d61b-default-rtdb.europe-west1.firebasedatabase.app/data.json', {
                method: 'PATCH',
                body: JSON.stringify({
                    ...obj
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(response => {
                data.id = Object.keys(response).join();
                return data
            })
            .then((data) => {
                this.changeInLocalStorage(data)
            })
            .catch((e) => {
                console.log(e)
            })

    }

    read(id) {
        return fetch('https://splitcost-6d61b-default-rtdb.europe-west1.firebasedatabase.app/data.json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())                      
            .then(response => response[id])
    }
}