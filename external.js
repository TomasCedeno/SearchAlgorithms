import {HashAlgorithm, HashMod, HashSquare, HashTrunc, HashFolding} from "./internal_algorithms/hash_algorithms.js"
import { ExternalSequentialSearch, ExternalBinarySearch, IndexedSearch } from "./external_algorithms/external_sequential_binary.js"
import { ExpandableStructure } from "./external_algorithms/expandable_structure.js"

const btnCreateStructure = document.getElementById("btnCreateStructure")

const externalAlgorithmSelect = document.getElementById("externalAlgorithmSelect")
const externalHashFunctionSelect = document.getElementById("externalHashFunction")
const externalRangeInput = document.getElementById("externalRangeInput")
const externalNumRegisterInput = document.getElementById("externalNumRegisterInput")


const insertInput = document.getElementById("insertInput")
const btnInsert = document.getElementById("btnInsert")
const searchInput = document.getElementById("searchInput")
const btnSeacrh = document.getElementById("btnSearch")

let structure = null
let structureDimension = 1


externalAlgorithmSelect.addEventListener("change", () => {
    if (externalAlgorithmSelect.value == "totalExpansion" || externalAlgorithmSelect.value == "partialExpansion"){
        document.getElementById("lblExternalNumRegisterInput").style = "display: block;"
        document.getElementById("externalNumRegisterInput").style = "display: block;"
        document.getElementById("lblExternalRangeInput").innerHTML = "Ingrese el número de cubetas"
        //document.getElementById("btnDelete").style = "display: block;"
        document.getElementById("lblExternalHashFunction").style.display = "block"
        externalHashFunctionSelect.style.display = "block"

    } else {
        document.getElementById("lblExternalNumRegisterInput").style = "display: none;"
        document.getElementById("externalNumRegisterInput").style = "display: none;"
        document.getElementById("lblExternalRangeInput").innerHTML = "Ingrese el rango"
        //document.getElementById("btnDelete").style = "display: none;"
        document.getElementById("lblExternalHashFunction").style.display = "none"
        externalHashFunctionSelect.style.display = "none"
    }

})


const createStructure = () => {
    const algorithm = externalAlgorithmSelect.value
    const hash = externalHashFunctionSelect.value
    const range = Number(externalRangeInput.value)
    const numRegister = Number(externalNumRegisterInput.value)

    if (algorithm == "binary"){
        structure = new ExternalBinarySearch(range)
        structureDimension = 1;

    } else if (algorithm == "sequential"){
        structure = new ExternalSequentialSearch(range)
        structureDimension = 1

    } else if (algorithm == "totalExpansion" || algorithm == "partialExpansion"){
        let hashFunction = null
        if (hash == "hashMod"){
            hashFunction = new HashMod(range, null)
        } else if (hash == "hashSquare"){
            hashFunction = new HashSquare(range, null)   
        } else if (hash == "hashTrunc"){
            hashFunction = new HashTrunc(range, null)  
        } else if (hash == "hashFolding"){
            hashFunction = new HashFolding(range, cnull)
        }

        let expansionOD = Number(prompt("Ingrese la densidad de ocupación para expansión (ej. 75): ")) / 100
        let reductionOD = Number(prompt("Ingrese la densidad de ocupación para reducción (ej. 120): ")) / 100

        if (algorithm == "totalExpansion"){
            structure = new ExpandableStructure(hashFunction, range, numRegister, "total", expansionOD, reductionOD)
            structureDimension = 2

        } else if (algorithm == "partialExpansion"){
            structure = new ExpandableStructure(hashFunction, range, numRegister, "partial", expansionOD, reductionOD)
            structureDimension = 2
        }

    } else if (algorithm == "indices"){
        structure = new IndexedSearch(range)
    }

    drawStructure()
}

btnCreateStructure.addEventListener("click", createStructure)



const insert = () => {
    const numDigits = document.getElementById("numDigits").value
    
    if (insertInput.value.length != numDigits){
        alert(`La clave debe ser de ${numDigits} digitos.`)
        return
    }

    const key = Number(insertInput.value)

    if (structure.search(key) != -1) {
        alert("Esta clave ya fue insertada en la estructura.")
        return
    }

    const position = structure.insert(key)

    if (position == null) {
        insertInput.value = ""
        drawStructure()
        return
    }

    if (position !== false) {
        alert(`Se insertó la clave ${key} en la posición ${position+1}.`)

    } else {
        alert(`No se pudo insertar la clave ${key}.`)
    }

    insertInput.value = ""
    drawStructure()
}

btnInsert.addEventListener("click", insert)


const deleteKey = () => {
    const numDigits = document.getElementById("numDigits").value

    if (searchInput.value.length != numDigits){
        alert(`La clave debe ser de ${numDigits} digitos.`)
        return
    }

    const key = Number(searchInput.value)

    structure.delete(key)

    searchInput.value = ""
    drawStructure()
}

document.getElementById("btnDelete").addEventListener("click", deleteKey)


const search = async () => {
    const numDigits = document.getElementById("numDigits").value

    if (searchInput.value.length != numDigits){
        alert(`La clave debe ser de ${numDigits} digitos.`)
        return
    }

    const key = Number(searchInput.value)
    const position = structure.search(key)

    if (position == null) {
        //searchInput.value = ""
        return
    }

    if (externalAlgorithmSelect.value == "sequential" || externalAlgorithmSelect.value == "binary"){
        await structure.interactiveSearch(key)
    }

    if (position != -1) {
        alert(`Se encontró la clave ${key} en la posición ${position+1}`)

    } else {
        alert(`No se encontró la clave ${key} en la estructura.`)
    }

    //searchInput.value = ""
    drawStructure()
}

btnSeacrh.addEventListener("click", search)



const keyInputHandler = (e) => {
    const numDigits = document.getElementById("numDigits").value

    e.target.value = e.target.value.replace(/\D/g, '');

    if (e.target.value.length > numDigits) {
        e.target.value = e.target.value.slice(0, numDigits);
    }
}

insertInput.addEventListener("input", keyInputHandler)
searchInput.addEventListener("input", keyInputHandler)


const enterInputHandler = (event) => {
    if (event.key === "Enter") {
        event.preventDefault()
        
        if (event.target.id == "insertInput") insert()
        else if (event.target.id == "searchInput") search()
    }
}

insertInput.addEventListener("keypress", enterInputHandler)
searchInput.addEventListener("keypress", enterInputHandler)


export const drawStructure = () => {
    const divStructure = document.getElementById("structure")
    divStructure.innerHTML = ""

    if (externalAlgorithmSelect.value == "indices") {
        drawIndexStructure()

    } else if (structureDimension == 1){
        divStructure.style.flexDirection = "column"

        structure.array.forEach((position, index) => {
            const positionContainer = document.createElement("div")
            positionContainer.classList.add("positionContainer")

            const number = document.createElement("h3")
            number.innerHTML = index + 1

            const divPosition = document.createElement("div")
            divPosition.classList.add("position")
            divPosition.style = `width: ${document.getElementById("numDigits").value*30}px;`;
    
            const key = document.createElement("h3")
            key.innerHTML = (position == 0) ? '' : position
    
            divPosition.appendChild(key)
            positionContainer.append(number, divPosition)
            divStructure.appendChild(positionContainer)

            if (((index+1) % structure.blockSize) == 0 ){
                const blockSeparator = document.createElement("div")
                blockSeparator.classList.add("blockSeparator")
                blockSeparator.innerHTML = `Bloque  ${Math.floor((index+1)/structure.blockSize)}`
                divStructure.appendChild(blockSeparator)
            }
        });

    } else if (structureDimension == 2){
        divStructure.style.flexDirection = "row"
        divStructure.style.alignItems = "flex-start"
        const positionContainer = document.createElement("div")
        positionContainer.classList.add("positionContainer")
        positionContainer.style = `
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: center;
            gap: 0px; 
        `
        positionContainer.appendChild(document.createElement("h3"))

        for (let i = 0; i < structure.registers; i++) {
            const number = document.createElement("h3")
            number.innerHTML = i + 1
            positionContainer.appendChild(number)
        }
        divStructure.appendChild(positionContainer)

        structure.array.forEach((tray, index) => {
            const positionContainer = document.createElement("div")
            positionContainer.classList.add("positionContainer")
            positionContainer.style = `
            display: flex;
            flex-direction: column;
            text-align: center;
            gap: 0px;
            `

            const number = document.createElement("h3")
            number.innerHTML = index

            const divTray = document.createElement("div")
            divTray.classList.add("tray")

            tray.forEach((register) => {
                const divRegister = document.createElement("div")
                divRegister.classList.add("position")
                divRegister.style = `width: ${document.getElementById("numDigits").value*30}px;`;

                const key = document.createElement("h3")
                key.innerHTML = (register == 0) ? '' : register

                divRegister.appendChild(key)
                divTray.appendChild(divRegister)
            })


            //Colisiones
            structure.collisionArea[index].forEach((register) => {
                const divRegister = document.createElement("div")
                divRegister.classList.add("position")
                divRegister.style = `width: ${document.getElementById("numDigits").value*30}px;`;

                const key = document.createElement("h3")
                key.innerHTML = (register == 0) ? '' : register

                divRegister.appendChild(key) 
                divTray.appendChild(divRegister)
            })

            positionContainer.append(number, divTray)
            divStructure.appendChild(positionContainer)
        });

    }
}


const drawIndexStructure = () => {
    const divStructure = document.getElementById("structure")
    divStructure.innerHTML = ""

    const divIndices = document.createElement("div")
    divIndices.style = "margin-right: 60px;"
    const divData = document.createElement("div")

    structure.indices.forEach((position, index) => {
        const positionContainer = document.createElement("div")
        positionContainer.classList.add("positionContainer")

        const number = document.createElement("h3")
        number.innerHTML = index + 1

        const divPosition = document.createElement("div")
        divPosition.classList.add("position")
        divPosition.style = `width: ${document.getElementById("numDigits").value*30}px;`;

        const key = document.createElement("h3")
        key.innerHTML = (position == 0) ? '' : position

        divPosition.appendChild(key)
        positionContainer.append(number, divPosition)
        divIndices.appendChild(positionContainer)
    })

    structure.array.forEach((position, index) => {
        const positionContainer = document.createElement("div")
        positionContainer.classList.add("positionContainer")

        const number = document.createElement("h3")
        number.innerHTML = index + 1

        const divPosition = document.createElement("div")
        divPosition.classList.add("position")
        divPosition.style = `width: ${document.getElementById("numDigits").value*30}px;`;

        const key = document.createElement("h3")
        key.innerHTML = (position == 0) ? '' : position

        divPosition.appendChild(key)
        positionContainer.append(number, divPosition)
        divData.appendChild(positionContainer)

        if (((index+1) % structure.blockSize) == 0 ){
            const blockSeparator = document.createElement("div")
            blockSeparator.classList.add("blockSeparator")
            blockSeparator.innerHTML = `Bloque  ${Math.floor((index+1)/structure.blockSize)}`
            divData.appendChild(blockSeparator)
        }
    });

    divStructure.append(divIndices, divData)
    divStructure.style = "display: flex; flex-direction: row;"
}