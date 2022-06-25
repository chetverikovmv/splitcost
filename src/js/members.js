export const members = {
    membersList: [ // массив объектов в участников
        {
            id: 1,
            name: "",
            pair: 0,
        },

        {
            id: 2,
            name: "",
            pair: 0,
        },
    ],

    eventName: '',

    addMemberToList() {
        this.membersList.push({
            id: this.membersList.length + 1,
            name: "",
            pair: 0,
        })
    },

    deleteMemberFromList(id) {
        const currentPairOfMember = this.membersList[id - 1];
        const PairOfCurrentPairOfMember = this.membersList[currentPairOfMember.pair - 1];

        if (PairOfCurrentPairOfMember) {
            PairOfCurrentPairOfMember.pair = 0 // удаляем пару при удалении участника
        }

        this.membersList.forEach((item) => { // уменьшаем на 1 значение у пар
            if (item.pair > id) {
                item.pair--
            }           
        })

        this.membersList.splice(id - 1, 1); // удаляем 

        this.membersList.forEach((item, i) => { // переопределяем номера          
            if ((item.id - 1) !== i) {
                item.id = i + 1
            }
        })
    },
}