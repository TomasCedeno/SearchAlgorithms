
class IndexedStrcuture {
    constructor(type, totalRecords, recordLength, indexLength, blockCapacity) {
        this.type = type
        this.totalRecords = totalRecords
        this.recordLength = recordLength
        this.indexLength = indexLength
        this.blockCapacity = blockCapacity

        this.recordsPerBlock = Math.floor(this.blockCapacity / this.recordLength)
        this.numberOfBlocks = Math.ceil(this.totalRecords / this.recordsPerBlock)
        this.indicesPerBlock = Math.floor(this.blockCapacity / this.indexLength)

        switch (type) {
            case "primary":
                this.numberOfBlockIndices = Math.ceil(this.numberOfBlocks / this.indicesPerBlock)
                this.indices = new Array(this.numberOfBlockIndices).fill(null).map(() => this.indicesPerBlock)
                break;

            case "secondary":
                this.numberOfBlockIndices = Math.ceil(this.totalRecords / this.indicesPerBlock)
                this.indices = new Array(this.numberOfBlockIndices).fill(null).map(() => this.indicesPerBlock)      
                break;
        
            default:
                alert("El tipo de indices no es válido.")
                break;
        }

        let number = 0
        this.indices.forEach((block, i) => {
            number++;
            this.indices[i] = {
                firstIndex: number,
                lastIndex: (i+1) * this.indicesPerBlock
            }
            number = (i+1) * this.indicesPerBlock
        })

        this.data = new Array(this.numberOfBlocks).fill(null).map(() => this.recordsPerBlock)

        number = 0
        this.data.forEach((block, i) => {
            number++;
            this.data[i] = {
                firstIndex: number,
                lastIndex: (i+1) * this.recordsPerBlock
            }
            number = (i+1) * this.recordsPerBlock
        })

    }


}



class MultilevelIndexedStrcuture {
    constructor(type, totalRecords, recordLength, indexLength, blockCapacity) {
        this.type = type
        this.totalRecords = totalRecords
        this.recordLength = recordLength
        this.indexLength = indexLength
        this.blockCapacity = blockCapacity

        this.recordsPerBlock = Math.floor(this.blockCapacity / this.recordLength)
        this.numberOfBlocks = Math.ceil(this.totalRecords / this.recordsPerBlock)
        this.indicesPerBlock = Math.floor(this.blockCapacity / this.indexLength)
        

        switch (type) {
            case "multilevelOnPrimary":
                this.numberOfBlockIndices = Math.ceil(this.numberOfBlocks / this.indicesPerBlock)
                this.numberOfLevels = Math.ceil(Math.log(this.numberOfBlocks) / Math.log(this.indicesPerBlock));
                this.indices = []
                break;

            case "multilevelOnSecondary":
                this.numberOfBlockIndices = Math.ceil(this.totalRecords / this.indicesPerBlock)
                this.numberOfLevels = Math.ceil(Math.log(this.totalRecords) / Math.log(this.indicesPerBlock));
                this.indices = []
                break;
        
            default:
                alert("El tipo de indices no es válido.")
                break;
        }

        //Crea estructuras indices
        let numOfIndexBlocks = this.numberOfBlockIndices;
        
        for (let level=0; level<this.numberOfLevels; level++){
            this.indices.push(new Array(numOfIndexBlocks).fill(null).map(() => this.indicesPerBlock))

            let number = 0
            this.indices[level].forEach((block, i) => {
                number++;
                this.indices[level][i] = {
                    firstIndex: number,
                    lastIndex: (i+1) * this.indicesPerBlock
                }
                number = (i+1) * this.indicesPerBlock
            })

            numOfIndexBlocks = Math.ceil(numOfIndexBlocks/this.indicesPerBlock)
        }
        this.indices.reverse()


        //Crea estructura principal
        this.data = new Array(this.numberOfBlocks).fill(null).map(() => this.recordsPerBlock)

        let number = 0
        this.data.forEach((block, i) => {
            number++;
            this.data[i] = {
                firstIndex: number,
                lastIndex: (i+1) * this.recordsPerBlock
            }
            number = (i+1) * this.recordsPerBlock
        })

    }

}


export {IndexedStrcuture, MultilevelIndexedStrcuture}