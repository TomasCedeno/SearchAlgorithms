import {HashAlgorithm} from "./hash_algorithms.js";

class CollisionFixer {
    constructor() {
        this.initialDirection = 0;
        this.i = 0;
        this.range = 0;
        this.name = '';
    }

    setInitialDirection(initialDirection) {
        this.initialDirection = initialDirection;
    }

    getName() {
        return this.name;
    }

    restartI() {
        this.i = 0;
    }

    setRange(range) {
        this.range = range;
    }

    fixCollision(direction) {
        throw new Error('fixCollision must be implemented by subclasses');
    }
}



class HashCollision extends CollisionFixer {
    constructor() {
        super();
        this.name = 'Hash';
    }

    fixCollision(direction) {
        console.log(this.range);
        return ((direction + 1) % this.range) + 1;
    }
}



class LinearCollision extends CollisionFixer {
    constructor() {
        super();
        this.name = 'Lineal';
    }

    fixCollision(direction) {
        return direction + 1;
    }
}



class SquareCollision extends CollisionFixer {
    constructor() {
        super();
        this.name = 'Cuadratica';
    }

    fixCollision(direction) {
        this.i++;
        return this.initialDirection + Math.pow(this.i, 2);
    }
}



class LinkedLists extends HashAlgorithm {
    constructor(hashFunction, range) {
        super(range, null);
        this.hashFunction = hashFunction;
        this.range = range;
        this.array = new Array(range).fill(null).map(() => [0]);
    }

    insert(key) {
        const position = this.hashFunction.hashFunction(key);

        if (this.array[position][0] === 0) {
            this.array[position].length = 0; // Clear the array
            this.array[position].push(key);
            alert(`Se insertó la clave ${key} en la posición ${position + 1} en el registro ${1}`);
            return position;
        }

        this.array[position].push(key);
        const record = this.array[position].indexOf(key);
        alert(`Se insertó la clave ${key} en la posición ${position + 1} en el registro ${record + 1}`);
        return position;
    }

    search(key) {
        const position = this.hashFunction.hashFunction(key);
        const record = this.array[position].indexOf(key);

        if (record === -1) {
            return -1;
        }

        alert(`Se encontró la clave ${key} en la posición ${position + 1} en el registro ${record + 1}`);
        return position;
    }

    hashFunction(key) {
        throw new Error('hashFunction must be implemented by subclasses');
    }
}



class NestedArrays extends HashAlgorithm {
    constructor(hashFunction, range) {
        super(range, null);
        this.hashFunction = hashFunction;
        this.range = range;
        this.array = new Array(range).fill(null).map(() => new Array(range).fill(0));
    }

    insert(key) {
        const position = this.hashFunction.hashFunction(key);

        for (let i = 0; i < this.range; i++) {
            if (this.array[position][i] === 0) {
                this.array[position][i] = key;
                return position;
            } else {
                alert(`Se presenta colisión en la posición ${position + 1} se intenta insertar en el siguiente registro.`);
            }
        }

        return false;
    }

    search(key) {
        const position = this.hashFunction.hashFunction(key);

        for (let i = 0; i < this.range; i++) {
            if (this.array[position][i] === 0) {
                return -1;
            } else {
                if (this.array[position][i] === key) {
                    alert(`Se encontró la clave ${key} en la posición ${position + 1} en el registro ${i + 1}`);
                    return position;
                }
            }
        }

        console.log('No se encontró la clave.');
        return false;
    }

    hashFunction(key) {
        throw new Error('hashFunction must be implemented by subclasses');
    }
}


export {CollisionFixer, LinearCollision, SquareCollision, HashCollision, NestedArrays, LinkedLists};