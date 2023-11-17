import { IndexedStrcuture, MultilevelIndexedStrcuture } from "./indices/indexed_structure.js"

const indexTypeSelect = document.getElementById("indexTypeSelect")
const recordsInput = document.getElementById("recordsInput")
const recordLengthInput = document.getElementById("recordLengthInput")
const indexLengthInput = document.getElementById("indexLengthInput")
const blockCapacityInput = document.getElementById("blockCapacityInput")


let structure = null

const createStructure = () => {
    const type = indexTypeSelect.value
    const totalRecords = Number(recordsInput.value)
    const recordLength = Number(recordLengthInput.value)
    const indexLength = Number(indexLengthInput.value)
    const blockCapacity = Number(blockCapacityInput.value)

    if (type == "primary" || type == "secondary"){
        structure = new IndexedStrcuture(type, totalRecords, recordLength, indexLength, blockCapacity)
        drawStructure()

    } else if (type == "multilevelOnPrimary" || type == "multilevelOnSecondary"){
        structure = new MultilevelIndexedStrcuture(type, totalRecords, recordLength, indexLength, blockCapacity)
        drawMultilevelStructure()
    }
    
}

document.getElementById("btnCreateIndexStructure").addEventListener("click", createStructure)


const selectRecord = async (index) => {
    const type = indexTypeSelect.value
    const divData = document.getElementById("divData")


    if (type == "primary" || type == "multilevelOnPrimary"){
        const block = divData.children[index]
        block.style.border = "solid red 4px"
        block.scrollIntoView({ behavior: "smooth" });
        await new Promise(resolve => setTimeout(resolve, 2000));
        block.style.border = ""

    } else if (type == "secondary" || type == "multilevelOnSecondary"){
        const blockIndex = Math.ceil(index / structure.recordsPerBlock)
        const block = divData.children[blockIndex]
        block.style.border = "solid red 4px"
        block.scrollIntoView({ behavior: "smooth" });
        await new Promise(resolve => setTimeout(resolve, 2000));
        block.style.border = ""

    }
}

const selectMultilevelRecord = async (index, currentLevel) => {
    const divMultilevelIndices = document.getElementById("multilevelIndices")

    console.log(divMultilevelIndices.children[currentLevel+1].children[index].lastChild);
    const block = divMultilevelIndices.children[currentLevel+1].children[index].lastChild
    block.style.border = "solid red 4px"
    block.scrollIntoView({ behavior: "smooth" });
    await new Promise(resolve => setTimeout(resolve, 2000));
    block.style.border = ""
}


const drawStructure = () => {
    const divStructure = document.getElementById("indexStructure")
    divStructure.innerHTML = ""

    const divIndices = document.createElement("div")
    divIndices.id = "divIndices"
    structure.indices.forEach((block, index) => {
        const divBlock = document.createElement("div")
        divBlock.classList.add("block")

        const blockNumber = document.createElement("h3")
        blockNumber.innerHTML = index + 1

        const divRecords = document.createElement("div")
        divRecords.classList.add("records")
        divRecords.style.height = (structure.indicesPerBlock<100) ? "100px": `${structure.indicesPerBlock}px`
        divRecords.style.width = `100px`

        const firstIndex = document.createElement("div")
        firstIndex.classList.add("record")
        firstIndex.style.cursor = "pointer"
        firstIndex.innerHTML = block.firstIndex
        firstIndex.addEventListener("click", () => selectRecord(block.firstIndex-1))

        const lastIndex = document.createElement("div")
        lastIndex.classList.add("record")
        lastIndex.style.cursor = "pointer"
        lastIndex.innerHTML = block.lastIndex
        lastIndex.addEventListener("click", () => selectRecord(block.lastIndex-1))

        divRecords.append(firstIndex, lastIndex)
        divBlock.append(blockNumber, divRecords)
        divIndices.appendChild(divBlock)
    });


    const divData = document.createElement("div")
    divData.id = "divData"
    structure.data.forEach((block, index) => {
        const divBlock = document.createElement("div")
        divBlock.classList.add("block")

        const blockNumber = document.createElement("h3")
        blockNumber.innerHTML = index + 1

        const divRecords = document.createElement("div")
        divRecords.classList.add("records")
        divRecords.style.height = `${structure.recordsPerBlock*2}px`
        divRecords.style.width = `300px`

        const firstIndex = document.createElement("div")
        firstIndex.classList.add("record")
        firstIndex.innerHTML = block.firstIndex

        const lastIndex = document.createElement("div")
        lastIndex.classList.add("record")
        lastIndex.innerHTML = block.lastIndex

        divRecords.append(firstIndex, lastIndex)
        divBlock.append(blockNumber, divRecords)
        divData.appendChild(divBlock)
    });

    divStructure.append(divIndices, divData)

}



const drawMultilevelStructure = () => {
    const divStructure = document.getElementById("indexStructure")
    divStructure.innerHTML = ""

    console.log(structure.indices);

    const divIndices = document.createElement("div")
    divIndices.innerHTML = ""
    divIndices.id = "multilevelIndices"

    structure.indices.forEach((indexStructure, level) => {
        const divIndexStructure = document.createElement("div")
        divIndexStructure.classList.add("indexStructure")

        indexStructure.forEach((block, index) => {
            const divBlock = document.createElement("div")
            divBlock.classList.add("block")
    
            const blockNumber = document.createElement("h3")
            blockNumber.innerHTML = index + 1
    
            const divRecords = document.createElement("div")
            divRecords.classList.add("records")
            divRecords.style.height = (structure.indicesPerBlock<100) ? "100px": `${structure.indicesPerBlock}px`
            divRecords.style.width = `100px`
    
            const firstIndex = document.createElement("div")
            firstIndex.classList.add("record")
            firstIndex.style.cursor = "pointer"
            firstIndex.innerHTML = block.firstIndex
            console.log(level < structure.indices.length-1);
            if (level < structure.indices.length-1) firstIndex.addEventListener("click", () => selectMultilevelRecord(block.firstIndex-1, level))
            else firstIndex.addEventListener("click", () => selectRecord(block.firstIndex-1))
    
            const lastIndex = document.createElement("div")
            lastIndex.classList.add("record")
            lastIndex.style.cursor = "pointer"
            lastIndex.innerHTML = block.lastIndex
            if (level < structure.indices.length-1) lastIndex.addEventListener("click", () => selectMultilevelRecord(block.lastIndex-1, level))
            else lastIndex.addEventListener("click", () => selectRecord(block.lastIndex-1))
    
            divRecords.append(firstIndex, lastIndex)
            divBlock.append(blockNumber, divRecords)
            divIndexStructure.appendChild(divBlock)
        });

        divIndices.appendChild(divIndexStructure)
    })


    const divData = document.createElement("div")
    divData.id = "divData"
    structure.data.forEach((block, index) => {
        const divBlock = document.createElement("div")
        divBlock.classList.add("block")

        const blockNumber = document.createElement("h3")
        blockNumber.innerHTML = index + 1

        const divRecords = document.createElement("div")
        divRecords.classList.add("records")
        divRecords.style.height = `${structure.recordsPerBlock*2}px`
        divRecords.style.width = `300px`

        const firstIndex = document.createElement("div")
        firstIndex.classList.add("record")
        firstIndex.innerHTML = block.firstIndex

        const lastIndex = document.createElement("div")
        lastIndex.classList.add("record")
        lastIndex.innerHTML = block.lastIndex

        divRecords.append(firstIndex, lastIndex)
        divBlock.append(blockNumber, divRecords)
        divData.appendChild(divBlock)
    });

    divStructure.append(divIndices, divData)
}