import {HashAlgorithm} from "../internal_algorithms/hash_algorithms.js";
import {drawStructure} from "../external.js"

class ExpandableStructure extends HashAlgorithm {
    constructor(hashFunction, range, registers, type, expansionOD, reductionOD) {
        super(range, null);
        this.hashFunction = hashFunction;
        this.range = range;
        this.registers = registers;
        this.array = new Array(range).fill(null).map(() => new Array(registers).fill(0));
        this.keys = []
        this.type = type
        this.expansionOD = expansionOD;
        this.reductionOD = reductionOD;
        this.collisionArea = new Array(range).fill(null).map(() => new Array());
    }


    calculateExpansionOD() {
        let occupiedRegisters = 0
        let availableRegisters = this.range * this.registers

        this.keys.forEach((key) => {
            occupiedRegisters += 1
        })

        return occupiedRegisters / availableRegisters;
    }

    calculateReductionnOD() {
        let occupiedRegisters = 0
        let buckets = this.range

        this.keys.forEach((key) => {
            occupiedRegisters += 1
        })

        return occupiedRegisters / buckets;
    }


    expand() {
        if (this.type == "total"){
            this.range = this.range * 2

        } else if (this.type == "partial"){
            this.range = this.range + Math.floor(this.range * 0.5)
        }

        this.array = new Array(this.range).fill(null).map(() => new Array(this.registers).fill(0));
        this.collisionArea = new Array(this.range).fill(null).map(() => new Array());
        this.hashFunction.setRange(this.range)

        this.keys.forEach((key) => {
            const position = this.hashFunction.hashFunction(key);

            for (let i = 0; i < this.registers; i++) {
                if (this.array[position][i] === 0) {
                    this.array[position][i] = key;
                    return;
                }
            }

            this.collisionArea[position].push(key)
        })
    }

    reduce() {
        if (this.type == "total"){
            this.range = this.range / 2

        } else if (this.type == "partial"){
            this.range = this.range - Math.ceil(this.range * 0.25)
        }

        this.array = new Array(this.range).fill(null).map(() => new Array(this.registers).fill(0));
        this.collisionArea = new Array(this.range).fill(null).map(() => new Array());
        this.hashFunction.setRange(this.range)

        this.keys.forEach((key) => {
            const position = this.hashFunction.hashFunction(key);

            for (let i = 0; i < this.registers; i++) {
                if (this.array[position][i] === 0) {
                    this.array[position][i] = key;
                    return;
                }
            }

            this.collisionArea[position].push(key)
        })
    }


    insert(key) {

        for (let i=0; i<this.range; i++){
            for (let j=0; j<this.registers; j++){
                if (this.array[i][j] == key) return false
            }
        }

        const position = this.hashFunction.hashFunction(key);
        let inserted = false

        for (let i = 0; i < this.registers; i++) {
            if (this.array[position][i] === 0) {
                this.keys.push(key)
                this.array[position][i] = key;

                alert(`Se insertó la clave ${key} en la cubeta ${position} en el registro ${i + 1}`);
                inserted = true 
                break    
            }
        }

        if (!inserted){
            alert(`La clave ${key} entra en colisión en la cubeta ${position}, se dejará en área de colisiones.`);
            this.collisionArea[position].push(key)
            this.keys.push(key)
        }


        if (this.calculateExpansionOD() >= this.expansionOD) {
            setTimeout(() => {
                this.expand()
                alert(`Expansión ${(this.type == "total") ? "Total" : "Parcial"}. Presione Aceptar para continuar.`)
                drawStructure()
            }, 1000)
        }

        return;
    }

    search(key) {
        const position = this.hashFunction.hashFunction(key);
        let found = false

        for (let i = 0; i < this.registers; i++) {
            if (this.array[position][i] === 0) {
                return -1;
            } else {
                if (this.array[position][i] === key) {
                    alert(`Se encontró la clave ${key} en la cubeta ${position} en el registro ${i + 1}`);
                    found = true;
                    return;
                }
            }
        }

        this.collisionArea[position].forEach((element) => {
            if (element == key) {
                alert(`Se encontró la clave ${key} en la cubeta ${position} en el área de colisiones.`);
                found = true
            }
        })

        if (!found) return -1;
    }


    delete(key){
        const position = this.hashFunction.hashFunction(key);
        let deleted = false

        for (let i = 0; i < this.registers; i++) {
            if (this.array[position][i] === key) {
                this.array[position][i] = 0

                let index = this.keys.indexOf(key);
                if (index !== -1) this.keys.splice(index, 1);

                alert(`Se eliminó la clave ${key} encontrada en la cubeta ${position} en el registro ${i + 1}`);
                deleted = true
                break
            }
        }

        let index = this.collisionArea[position].indexOf(key);
        if (index !== -1 && !deleted){
            this.collisionArea[position].splice(index, 1)
            this.keys.splice(this.keys.indexOf(key), 1);
            alert(`Se eliminó la clave ${key} encontrada en la cubeta ${position} en el área de colisiones.`);
            deleted = true
        }

        if (this.calculateReductionnOD() <= this.reductionOD){

            this.reduce()
            if (this.calculateExpansionOD() >= this.expansionOD){
                this.expand()
                alert("Se omitirá la reducción par evitar un bucle de expansiones y reducciones.")
                if (!deleted) alert(`No se encontró la clave ${key} en la estructura.`);
                return
            }
            this.expand()


            setTimeout(() => {
                this.reduce()
                alert(`Reducción ${(this.type == "total") ? "Total" : "Parcial"}. Presione Aceptar para continuar.`)
                drawStructure()
            }, 1000)    
        }

        if (!deleted) alert(`No se encontró la clave ${key} en la estructura.`);
    }

    hashFunction(key) {
        throw new Error('hashFunction must be implemented by subclasses');
    }
}


export {ExpandableStructure};