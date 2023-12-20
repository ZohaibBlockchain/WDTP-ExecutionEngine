

let garbage = ["BO", "FU", "_SPOT", "CFD", "FX", "CRYPTO", "CASH", "EQ", "INDEX", "COMMODITY", "deliverable", "leveraged"];



// export function getNames(dataArr) {
//     let Data = parse(dataArr, '^').Body;
//     if (checkInstrument(Data.Symbol)) {
//         return { Name: 'LEVERAGED.' + Data.Symbol, Symbol: Data.Symbol, type: 'LEVERAGED', fullInfo: Data };
//     } else {
//         return { Name: 'DELIVERABLE' + Data.Symbol, Symbol: Data.Symbol, type: 'DELIVERABLE', fullInfo: Data };
//     }
// }




function checkInstrument(symbol) {
    let _type = symbol.split(".")
    for (let i = 0; i < _type.length; i++) {

        if (_type[i] == 'CFD' || _type[i] == 'FX' || _type[i] == 'FU') {
            return true;
        }
    }
    return false;
}





export function createSymbol(symbol, side) {
    let symbolArr = symbol.split(".");
    if (symbolArr[0] == 'deliverable') {
        const newSymbolArray = symbolArr.filter(_str => !garbage.includes(_str));
        if (countStringLengths(newSymbolArray) <= 8) {
            symbol = newSymbolArray[0] + "." + newSymbolArray.slice(1).join(""); //Now <=9 digits here string
            if (symbol.slice(-1) === ".") {
                return symbol.toUpperCase() + 'X';
            } else {
                return symbol.toUpperCase() + '.X';
            }
        }
        else {
            symbol = newSymbolArray[0] + ".";
            if (symbol.length <= 9) {
                if (symbol.slice(-1) === ".") {
                    return symbol.toUpperCase() + 'X';
                } else {
                    return symbol.toUpperCase() + '.X';
                }
            }
            else {
                symbol = symbol.slice(0, 9);
                if (symbol.slice(-1) === ".") {
                    return symbol.toUpperCase() + 'X';
                } else {
                    return symbol.toUpperCase() + '.X';
                }
            }
        }
    }
    else {
        const newSymbolArray = symbolArr.filter(_str => !garbage.includes(_str));
        if (countStringLengths(newSymbolArray) <= 6) {
            symbol = newSymbolArray[0] + "." + newSymbolArray.slice(1).join("");//Now <=7 digits here string
            if (symbol.slice(-1) === ".") {
                return symbol.toUpperCase() + side + '.X';
            } else {
                return symbol.toUpperCase() + '.' + side + '.X';
            }
        }
        else {
            symbol = newSymbolArray[0] + ".";
            symbol = symbol.slice(0, 7);
            if (symbol.slice(-1) === ".") {
                return symbol.toUpperCase() + side + '.X';
            } else {
                return symbol.toUpperCase() + '.' + side + '.X';
            }
        }
    }
}


export function countStringLengths(arr) {
    let totalLength = 0;
    for (let i = 0; i < arr.length; i++) {
        totalLength += arr[i].length;
    }
    return totalLength;
}



export function createDeliverableSymbol(symbol) {
    let symbolArr = symbol.split(".");
        const newSymbolArray = symbolArr.filter(_str => !garbage.includes(_str));
        if (countStringLengths(newSymbolArray) <= 8) {
            symbol = newSymbolArray[0] + "." + newSymbolArray.slice(1).join(""); //Now <=9 digits here string
            if (symbol.slice(-1) === ".") {
                return symbol.toUpperCase() + 'X';
            } else {
                return symbol.toUpperCase() + '.X';
            }
        }
        else {
            symbol = newSymbolArray[0] + ".";
            if (symbol.length <= 9) {
                if (symbol.slice(-1) === ".") {
                    return symbol.toUpperCase() + 'X';
                } else {
                    return symbol.toUpperCase() + '.X';
                }
            }
            else {
                symbol = symbol.slice(0, 9);
                if (symbol.slice(-1) === ".") {
                    return symbol.toUpperCase() + 'X';
                } else {
                    return symbol.toUpperCase() + '.X';
                }
            }
        }
}