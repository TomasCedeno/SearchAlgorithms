class HashAlgorithm {
    constructor(range, fixer) {
        this.array = new Array(range).fill(0);
        this.range = range;
        this.fixer = fixer;
    }

    hashFunction(key) {
        throw new Error('hashFunction must be implemented by subclasses');
    }

    insert(key) {
        let position = this.hashFunction(key);
        let iterations = 0;

        this.fixer.restartI();
        this.fixer.setInitialDirection(position);

        while (iterations < this.array.length) {
            if (position >= this.array.length) position = 0;

            if (this.array[position] === 0) {
                this.array[position] = key;
                return position;
            } else {
                alert(`Se presenta colisión en la posición ${position + 1} se aplicará solución de colisiones ${this.fixer.getName()}`);
                position = this.fixer.fixCollision(position);
                iterations++;
            }
        }

        return false;
    }

    delete(key){
        let position = this.search(key)

        if (position != -1){
            this.array.splice(this.array.indexOf(key), 1)
            alert(`Se eliminó la clave ${key} encontrada en la posición ${position+1}.`)
            return
        }

        alert(`No se encontró la clave ${key} en la estructura.`)
    }

    search(key) {
        let position = this.hashFunction(key);
        let iterations = 0;

        this.fixer.restartI();
        this.fixer.setInitialDirection(position);

        while (iterations < this.array.length) {
            if (position >= this.array.length) position = 0;

            if (this.array[position] === key) {
                return position;
            } else {
                position = this.fixer.fixCollision(position);
                iterations++;
            }
        }

        return -1;
    }

    setRange(range){
        this.range = range
    }

}


class HashFolding extends HashAlgorithm {
    constructor(range, fixer) {
        super(range, fixer);
    }

    hashFunction(key) {
        const numDigits = 2;
        const keyStr = String(key);
        let sum = 0;

        for (let i = 0; i < keyStr.length; i += numDigits) {
            const endIndex = Math.min(i + numDigits, keyStr.length);
            const part = keyStr.substring(i, endIndex);
            sum += parseInt(part);
        }

        return sum % this.range;
    }
}



class HashMod extends HashAlgorithm {
    constructor(range, fixer) {
        super(range, fixer);
    }

    hashFunction(key) {
        return key % this.range;
    }
}


class HashSquare extends HashAlgorithm {
    constructor(range, fixer) {
        super(range, fixer);
    }

    hashFunction(key) {
        const rangeStr = String(this.range);
        const numDigits = [...rangeStr].filter(ch => ch === '0').length;
        const numberStr = String(Math.pow(key, 2));
        const length = numberStr.length;

        if (length === 1 || length === 2) {
            return parseInt(numberStr.charAt(0));
        }

        const startIndex = Math.floor((length - numDigits) / 2);
        const middleDigitsStr = numberStr.substring(startIndex, startIndex + numDigits);
        return parseInt(middleDigitsStr);
    }
}



class HashTrunc extends HashAlgorithm {
    constructor(range, fixer) {
        super(range, fixer);
    }

    hashFunction(key) {
        const keyStr = String(key);
        if (keyStr.length >= 3) {
            const firstDigit = keyStr.charAt(0);
            const thirdDigit = keyStr.charAt(2);
            const sum = parseInt(firstDigit) * 10 + parseInt(thirdDigit);
            return sum % this.range;
        }
        return -1;
    }
}


export {HashAlgorithm, HashMod, HashSquare, HashTrunc, HashFolding};