import { SequentialSearch, BinarySearch } from "./internal_algorithms/sequential_binary.js"
import {HashAlgorithm, HashMod, HashSquare, HashTrunc, HashFolding} from "./internal_algorithms/hash_algorithms.js"
import { CollisionFixer, LinearCollision, SquareCollision, HashCollision, NestedArrays, LinkedLists } from "./internal_algorithms/collisions_solvers.js"

const algorithmSelect = document.getElementById("algorithmSelect")
const collisionSolverSelect = document.getElementById("collisionSelect")
const rangeInput = document.getElementById("rangeInput")
const btnCreateStructure = document.getElementById("btnCreateStructure")


const insertInput = document.getElementById("insertInput")
const btnInsert = document.getElementById("btnInsert")
const searchInput = document.getElementById("searchInput")
const btnSeacrh = document.getElementById("btnSearch")

const nameInput = document.getElementById("nameInput")
const lastNameInput = document.getElementById("lastNameInput")


let structure = null
let structureDimension = 1


algorithmSelect.addEventListener("change", () => {
    const algorithm = algorithmSelect.value

    if (algorithm == "sequential" || algorithm == "binary"){
        document.getElementById("lblCollisionSelect").style.display = "none"
        collisionSolverSelect.style.display = "none"
        document.getElementById("nameInput").style.display = "block"
        document.getElementById("lastNameInput").style.display = "block"

    } else {
        document.getElementById("lblCollisionSelect").style.display = "block"
        collisionSolverSelect.style.display = "block"
        document.getElementById("nameInput").style.display = "none"
        document.getElementById("lastNameInput").style.display = "none"
        
    }
})


const createStructure = () => {
    const algorithm = algorithmSelect.value
    const collisionSolver = collisionSolverSelect.value
    const range = Number(rangeInput.value)

    let collisionFixer = null

    if (collisionSolver == "linear"){
        collisionFixer = new LinearCollision()
        structureDimension = 1

    } else if (collisionSolver == "square"){
        collisionFixer = new SquareCollision()
        structureDimension = 1

    } else if (collisionSolver == "hash"){
        collisionFixer = new HashCollision()
        collisionFixer.setRange(range)
        structureDimension = 1

    } else if (collisionSolver == "nestedArrays"){
        let hashFunction = null
        if (algorithm == "hashMod"){
            hashFunction = new HashMod(range, collisionFixer)
        } else if (algorithm == "hashSquare"){
            hashFunction = new HashSquare(range, collisionFixer)   
        } else if (algorithm == "hashTrunc"){
            hashFunction = new HashTrunc(range, collisionFixer)  
        } else if (algorithm == "hashFolding"){
            hashFunction = new HashFolding(range, collisionFixer)
        }

        structure = new NestedArrays(hashFunction, range)
        structureDimension = 2
        drawStructure()
        return

    } else if (collisionSolver == "linkedLists"){
        let hashFunction = null
        if (algorithm == "hashMod"){
            hashFunction = new HashMod(range, collisionFixer)
        } else if (algorithm == "hashSquare"){
            hashFunction = new HashSquare(range, collisionFixer)   
        } else if (algorithm == "hashTrunc"){
            hashFunction = new HashTrunc(range, collisionFixer)  
        } else if (algorithm == "hashFolding"){
            hashFunction = new HashFolding(range, collisionFixer)
        }

        structure = new LinkedLists(hashFunction, range)
        structureDimension = 2
        drawStructure()
        return

    }


    if (algorithm == "sequential"){
        structure = new SequentialSearch(range)
        structureDimension = 1

    } else if (algorithm == "binary"){
        structure = new BinarySearch(range)
        structureDimension = 1

    } else if (algorithm == "hashMod"){
        structure = new HashMod(range, collisionFixer)

    } else if (algorithm == "hashSquare"){
        structure = new HashSquare(range, collisionFixer)

    } else if (algorithm == "hashTrunc"){
        structure = new HashTrunc(range, collisionFixer)

    } else if (algorithm == "hashFolding"){
        structure = new HashFolding(range, collisionFixer)

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

    if (algorithmSelect.value == "sequential" || algorithmSelect.value == "sequential"){
        if ( nameInput.value == "" || lastNameInput.value == ""){
            alert("Ingresa la información para el registro.")
            return
        }
    }  

    const key = Number(insertInput.value)

    if (structure.search(key) != -1) {
        alert("Esta clave ya fue insertada en la estructura.")
        return
    }

    let position;
    if (algorithmSelect.value == "sequential" || algorithmSelect.value == "binary")
        position = structure.insert(key, nameInput.value, lastNameInput.value) 
    else
        position = structure.insert(key)

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
    nameInput.value = ""
    lastNameInput.value = ""
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

    if (algorithmSelect.value == "sequential" || algorithmSelect.value == "binary"){
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


const drawStructure = () => {
    const divStructure = document.getElementById("structure")
    divStructure.style.flexDirection = "column"
    divStructure.innerHTML = ""

    if (structureDimension == 1){
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
            
            if (algorithmSelect.value == "sequential" || algorithmSelect.value == "binary"){
                const {name, lastName} = structure.data.find(record => record.key == position)
                
                const divName = document.createElement("div")
                divName.classList.add("position")
                const hName = document.createElement("h5")
                hName.innerHTML = name
                divName.appendChild(hName)
                
                const divLastName = document.createElement("div")
                divLastName.classList.add("position")
                const hLastName = document.createElement("h5")
                hLastName.innerHTML = lastName
                divLastName.appendChild(hLastName)

                const divData = document.createElement("div")
                divData.classList.add("recordData")
                divData.append(divName, divLastName)
                positionContainer.appendChild(divData)
            }
            
            divStructure.appendChild(positionContainer)
        });

    } else if (structureDimension == 2){
        structure.array.forEach((tray, index) => {
            const positionContainer = document.createElement("div")
            positionContainer.classList.add("positionContainer")
            positionContainer.style = `
            display: flex;
            flex-direction: row;
            gap: 20px;
        `

            const number = document.createElement("h3")
            number.innerHTML = index + 1

            const divTray = document.createElement("div")
            divTray.style.flexDirection = "row"
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

            positionContainer.append(number, divTray)
            divStructure.appendChild(positionContainer)
        });

    }
}