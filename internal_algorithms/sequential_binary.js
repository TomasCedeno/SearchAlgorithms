const selectPosition = (position) => {
    position.style.border = "solid red 5px"
    return new Promise(resolve => setTimeout(resolve, 1000));
}


class SequentialSearch {
    constructor(range) {
        this.array = new Array(range).fill(0);
        this.range = range;
        this.data = [{key: 0, name: "", lastName: ""}]
    }


    insert(key, name, lastName) {
        if (this.search(key) != -1) return false

        for (let i=0; i<this.array.length; i++){
            if (this.array[i] == 0){
                this.array[i] = key
                this.data.push({key, name, lastName})
                this.array.sort((a, b) => (a === 0 ? 1 : b === 0 ? -1 : a - b))
                return i
            }
        }

        alert('Estructura llena, no se puede insertar la clave.')
        return false
    }


    delete(key) {
        const index = this.array.indexOf(key)

        if (index != -1){
            this.array[index] = 0
            alert(`Se eliminó la clave ${key} encontrada en la posición ${index+1}.`);

        } else{
            alert(`No se encontró la clave ${key} en la estructura.`);
        }
    }

    async interactiveSearch(key){
        const structure = document.getElementById("structure")

        for (let i=0; i<this.array.length; i++){
            const position = structure.childNodes[i].childNodes[1]
            
            await selectPosition(position)

            if (this.array[i] == key){
                return i
            }

            position.style.border = "solid black 1px"
        }
        
    }

    search(key) {
        return this.array.indexOf(key)
    }

}


class BinarySearch {
    constructor(range) {
        this.array = new Array(range).fill(0);
        this.range = range;
        this.data = [{key: 0, name: "", lastName: ""}]
    }


    insert(key, name, lastName) {
        if (this.search(key) != -1) return false

        for (let i=0; i<this.array.length; i++){
            if (this.array[i] == 0){
                this.array[i] = key
                this.data.push({key, name, lastName})
                this.array.sort((a, b) => (a === 0 ? 1 : b === 0 ? -1 : a - b))
                return this.array.indexOf(key)
            }
        }

        alert('Estructura llena, no se puede insertar la clave.')
        return false
    }

    search(key) {
        return this.array.indexOf(key)
    }

    delete(key) {
        const index = this.array.indexOf(key)

        if (index != -1){
            this.array[index] = 0
            alert(`Se eliminó la clave ${key} encontrada en la posición ${index+1}.`);

        } else{
            alert(`No se encontró la clave ${key} en la estructura.`);
        }
    }

    async interactiveSearch(key){
        const structure = document.getElementById("structure")

        let left = 0;
        let right = this.array.length - 1;

        while (left <= right) {
            const middle = Math.floor((left + right) / 2);
            const middleValue = this.array[middle];

            const position = structure.childNodes[middle].childNodes[1]
            await selectPosition(position)

            if (middleValue == key) {
                return middle;
            } else if (middleValue < key) {
                left = middle + 1; // El elemento está a la derecha de la mitad
            } else {
                right = middle - 1; // El elemento está a la izquierda de la mitad
            }

            position.style.border = "solid black 1px"
        }

        return -1; // El elemento no se encontró en el arreglo     
    }

}


export {SequentialSearch, BinarySearch}