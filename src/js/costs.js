export const costs = {
    costsList: [],

    addCostToList(name, payer, value, users) {
        this.costsList.push({
            id: this.costsList.length + 1,
            name: name,
            payer: payer,
            value: value,
            users: users
        })
    },

    deleteCostFromList(id) {        
        this.costsList.splice(id - 1, 1); // удаляем 

        this.costsList.forEach((item, i) => { // переопределяем номера          
            if ((item.id - 1) !== i) {
                item.id = i + 1
            }
        })
    },

   changeCostInList(id, name, payer, value, users) {
        const cost = this.costsList[id - 1];
        cost.name = name;
        cost.payer = payer;
        cost.value = value;
        cost.users = users;
    },
}