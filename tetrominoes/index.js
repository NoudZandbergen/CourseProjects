/**
 * @typedef {[[number, number, number], [number, number, number], [number, number, number]]} Matrix3Square
 */

/**
 * @typedef {Matrix3Square[]} Matrix3Rotations
 */

// /**
//  * @type {Object.<String, Matrix3Rotations>} Tetrominoes
//  */
// TODO: Find out how to document this type.
const Tetrominoes = {
    S: getRotations([
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ], 0, 2, 4, 6),
    Z: getRotations([
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ], 0, 2, 4, 6),
    L: getRotations([
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ], 0, 2, 4, 6),
    J: getRotations([
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ], 0, 2, 4, 6),
    T: getRotations([
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ], 0, 2, 4, 6),
    O: getRotations([
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1]
    ], 0),
    get random() {
        var values = Object.keys(this);
        let idx = Math.floor(Math.random() * values.length);
        return values[idx];
    }
};

/**
 * @example mod(-3, 5); // returns 2
 * @param {number} val
 * @param {number} length
 * @returns {number} `val` but wrapped between 0 and length
 */
function mod(val, length) {
    return ((val % length) + length) % length;
}

/**
 * @example mod(-15, 5, -12); // returns -10
 * @param {number} val
 * @param {number} length Essentially the number of options that val
 * @param {number} offset 
 * @returns {number} `val` but wrapped between 0 and length
 */
function wrapOffset(val, length, offset = 0) {
    return offset + mod(val - offset, length);
}

/**
 * @param {number} val
 * @param {number} length Essentially the number of options that val
 * @param {number} offset 
 * @returns {number} `val` but wrapped between 0 and length
 */
function wrap(val, min = 0, max = 1) {
    return wrapOffset(val, (max - min), min);
}

/**
 * @type {Matrix3Rotations[]} All the shapes that are in TetrisShapes. Used for easy 
 */
const allShapes = [
    Tetrominoes.O,
    Tetrominoes.S,
    Tetrominoes.Z,
    Tetrominoes.L,
    Tetrominoes.J,
    Tetrominoes.T,
];

/**
 * Rotates the shape by putting the outer ring into an array and shifting the values by the amount of turns, wrapped.
 * @param {Matrix3Square} shape
 * @param {number} turns8 8 turns makes a full rotation.
 * @returns {Matrix3Square}
 */
function rotate(shape, turns8) {
    let r1 = [
        shape[0][0], shape[0][1], shape[0][2], shape[1][2],
        shape[2][2], shape[2][1], shape[2][0], shape[1][0]
    ], r2 = new Array(8);

    for (let i = 0; i < 8; i++)
        r2[wrapOffset(i + turns8, 8)] = r1[i];
    
    return [
        [r2[0],    r2[1],    r2[2]],
        [r2[7], shape[1][1], r2[3]],
        [r2[6],    r2[5],    r2[4]]
    ];
}

/**
 * @param {Matrix3Square} shape
 * @returns {Matrix3Rotations[]}
 */
function getRotations(shape, ...rotations) {
    return rotations.map(r => {
        let rotation = wrapOffset(r, 8);
        return r == 0 ? shape : rotate(shape, rotation);
    });
}

/**
 * @param {Matrix3Square} shape
 * @param {String} blockSize A CSS size value, like 10px
 * @param {HTMLTableElement?} table A table element to reuse. Content will be cleared.
 * @returns {HTMLTableElement} The created table
 */
function displayShape(shape, blockSize, table) {
    if (table == null) {
        table = document.createElement("table");
        document.body.appendChild(table);
    } else {
        while (table.firstChild)
            table.firstChild.remove();
    }

    for (let subarray of shape) {
        let row = document.createElement("tr");
        for (let item of subarray) {
            let cell = document.createElement("td");
            cell.style.width = cell.style.height = blockSize;
            if (item) cell.classList.add('block');
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    return table;
}

/**
 * @param {Matrix3Rotations} shapeRotations
 * @param {Matrix3Square} rotation Used to pick a {@link Matrix3Square} from `shapeRotations`
 * @param {...any} pass These variables will be passed to {@link displayShape}
 * @returns {HTMLTableElement}
 */
function displayShapeRotated(shapeRotations, rotation, ...pass) {
    return displayShape(shapeRotations[wrapOffset(rotation, shapeRotations.length)], ...pass);
}

/** @type {HTMLTableElement?} Allow for reusing the table */
let _table;

/** @type {number} Index for {@link allShapes} */
let _shapeIndex = 0;

/** @type {number} Index for rotation list of the current shape */
let _rotation = 0;

/**
 * Changes the shape and it's rotation, then displays it.
 * @param {number} shapeOffset Changes the shape index. Wraps around.
 * @param {number} rotation Changes the selected shape rotation. Wraps around.
 */
function cycleShape(shapeOffset, rotation) {
    _shapeIndex = wrapOffset(_shapeIndex + shapeOffset, allShapes.length);
    _rotation = wrapOffset(_rotation + rotation, 4);

    _table = displayShapeRotated(allShapes[_shapeIndex], _rotation, "150px", _table)
}

// Make user able to swap between different tetrominoes and their rotations.
addEventListener("keydown", event => {
    switch (event.key.toLowerCase()) {
        case "1": cycleShape(-1, 0); break;
        case "3": cycleShape(+1, 0); break;
        case "q": cycleShape(0, -1); break;
        case "e": cycleShape(0, +1); break;
    }
});

_table = displayShapeRotated(allShapes[_shapeIndex], _rotation, "150px");