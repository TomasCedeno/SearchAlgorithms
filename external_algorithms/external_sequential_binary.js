const selectPosition = (position) => {
    position.style.border = "solid red 5px"
    return new Promise(resolve => setTimeout(resolve, 1000));
}


class ExternalSequentialSearch {
    constructor(range) {
        this.range = range;
        this.blockSize = Math.floor(Math.sqrt(range))
        this.array = new Array(range%this.blockSize==0 ? range : range + (this.blockSize - (range%this.blockSize))).fill(0);
        alert(`Se tomarán bloques de ${this.blockSize} registros.`);
    }


    insert(key) {
        if (this.search(key) != -1) return false

        for (let i=0; i<this.array.length; i++){
            if (this.array[i] == 0){
                this.array[i] = key
                this.array.sort((a, b) => (a === 0 ? 1 : b === 0 ? -1 : a - b))
                return this.array.indexOf(key)
            }
        }

        return false
    }

    search(key) {
        return this.array.indexOf(key)
    }

    delete(key){
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

        for (let i=this.blockSize-1; i<this.array.length+Math.floor(this.range/this.blockSize); i+=this.blockSize+1){
            const position = structure.childNodes[i].childNodes[1]
            await selectPosition(position)
            position.style.border = "solid black 1px"


            if (key <= this.array[Number(structure.childNodes[i].firstChild.innerHTML)-1]){
                for (let j=i-(this.blockSize-1); j<=i; j++){
                    const position = structure.childNodes[j].childNodes[1]
                    await selectPosition(position)

                    if (key == this.array[Number(structure.childNodes[j].firstChild.innerHTML)-1]) {
                        alert(`Se encontró la clave ${key} en el bloque ${Math.floor(j/this.blockSize) + 1}`);
                        position.style.border = "solid black 1px"
                        return
                    }

                    position.style.border = "solid black 1px"
                }

                return
            }
        }

        return -1;
    }

}


class ExternalBinarySearch {
    constructor(range) {
        this.range = range;
        this.blockSize = Math.floor(Math.sqrt(range))
        this.array = new Array(range%this.blockSize==0 ? range : range + (this.blockSize - (range%this.blockSize))).fill(0);
        alert(`Se tomarán bloques de ${this.blockSize} registros.`);
    }


    insert(key) {
        if (this.search(key) != -1) return false

        for (let i=0; i<this.array.length; i++){
            if (this.array[i] == 0){
                this.array[i] = key
                this.array.sort((a, b) => (a === 0 ? 1 : b === 0 ? -1 : a - b))
                return this.array.indexOf(key)
            }
        }

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

        for (let i=this.blockSize-1; i<this.array.length+Math.floor(this.range/this.blockSize); i+=this.blockSize+1){
            const position = structure.childNodes[i].childNodes[1]
            await selectPosition(position)
            position.style.border = "solid black 1px"


            if (key <= this.array[Number(structure.childNodes[i].firstChild.innerHTML)-1]){
                let left = 0;
                let right = Number(structure.childNodes[i].firstChild.innerHTML)-1;

                while (left <= right) {
                    const middle = Math.floor((left + right) / 2);
                    const middleValue = this.array[middle];

                    const position = structure.childNodes[middle].childNodes[1]
                    await selectPosition(position)

                    if (middleValue == key) {
                        alert(`Se encontró la clave ${key} en el bloque ${Math.floor(this.array.indexOf(key)/this.blockSize) + 1}`);
                        return
                    } else if (middleValue < key) {
                        left = middle + 1; // El elemento está a la derecha de la mitad
                    } else {
                        right = middle - 1; // El elemento está a la izquierda de la mitad
                    }

                    position.style.border = "solid black 1px"
                }

                return
            }
        }

        return -1;
    }

}


class IndexedSearch {
    constructor(range) {
        this.range = range;
        this.blockSize = Math.floor(Math.sqrt(range))
        this.array = new Array(range%this.blockSize==0 ? range : range + (this.blockSize - (range%this.blockSize))).fill(0);
        this.indices = new Array(Math.ceil(this.range/this.blockSize)).fill(0)
        alert(`Se tomarán bloques de ${this.blockSize} registros.`);
    }

    updateIndices(){
        this.array.forEach((element, index) => {
            if ((index+1) % this.blockSize == 0){
                this.indices[Math.trunc(index/this.blockSize)] = element
            }
        })
    }

    insert(key) {
        if (this.search(key) != -1) return false

        for (let i=0; i<this.array.length; i++){
            if (this.array[i] == 0){
                this.array[i] = key

                this.array.sort((a, b) => (a === 0 ? 1 : b === 0 ? -1 : a - b))
                this.updateIndices()

                return this.array.indexOf(key)
            }
        }

        return false
    }

    search(key) {
        let position = this.array.indexOf(key)

        if (position != -1){
            alert(`Se encontró la clave ${key} en el bloque ${Math.floor(position/this.blockSize) + 1}`);
        }

        return position
    }

    delete(key) {
        const index = this.array.indexOf(key)

        if (index != -1){
            this.array[index] = 0
            
            if (this.indices.indexOf(key) != -1) this.indices[this.indices.indexOf(key)] = 0
            this.updateIndices()

            alert(`Se eliminó la clave ${key} encontrada en la posición ${index+1}.`);

        } else{
            alert(`No se encontró la clave ${key} en la estructura.`);
        }
    }

}


export {ExternalBinarySearch, ExternalSequentialSearch, IndexedSearch}