// Todo: 
// input valildation before calculating 
// display errors
// reseting to normal state after an error 
// all done 
// pending -> handle keydown events so that you can enter from keyboard. 
const allOperand = document.querySelectorAll('.operand');
const allOperator = document.querySelectorAll('.operator');
const equals = document.querySelector('.equalsTo');
const textBox = document.getElementById('text-box');
const clearBtn = document.getElementById('btn-C');
const backspaceBtn = document.getElementById('btn-backspace');
let enteredOnce = false;
let sol = 0;
clearBtn.addEventListener('click',function(){
    calculatorState.currentInput = '';
    calculatorState.cd = '';
    calculatorState.op = null;
    calculatorState.num1 = null;
    calculatorState.num2 = null;
    enteredOnce = false;
    updateDisplay();
    sol = 0;
});
backspaceBtn.addEventListener('click',function(){
    handleBackspace();
});




const calculatorState = {
    cd: '',
    currentInput: "",
    num1: null,
    num2: null,
    op: null
}

const updateDisplay = () => {
    textBox.textContent = calculatorState.cd;
};

function isOperatorPresent(str){
const operators = /[+\-×÷*/]/;
    if(operators.test(str)){
        return true;
    }
    else{
        return false;
    }
}
function numOfOperatorsPresent(str){
    let countOfOperators = 0;
    for(let i=0; i<str.length; i++){
        if(isOperatorPresent(str[i])){
            countOfOperators++;
        }
    }
    return countOfOperators;
}

allOperand.forEach((operand)=>{
    operand.addEventListener('click',function(){
        handleOperandInput(this.textContent);
    });
});

allOperator.forEach((operator)=>{
    operator.addEventListener('click',function(){
        handleOperatorInput(this.textContent);
    });
});

equals.addEventListener('click',function(){
    if(calculateResult()){
        showResult();
    };  
});
document.addEventListener('keydown',function(e){
    handleKeydownEvent(e);
});
const handleKeydownEvent = (e) => {
    if (isOperatorPresent(e.key)){
        handleOperatorInput(e.key);
    }
    else if (e.key >= '0' && e.key <= '9'){
        handleOperandInput(e.key);
    }
    else if (e.key === '='){
        if(calculateResult()){
            showResult();
        }
    }
    else if (e.key === 'Backspace'){
        handleBackspace();
    } 
};

function handleOperandInput(digit){
    const str = calculatorState.cd.toString();
    if(str.includes('Error')){
        resetAfterError();
    }

    if( !(enteredOnce) && typeof (calculatorState.cd) === 'number'){
        showNewData(digit);
    }
    else{
        if(str[0] === '-' && str.length === 1){
            calculatorState.currentInput = calculatorState.cd;
        }
        calculatorState.cd += digit;
        calculatorState.currentInput += digit;    
        updateDisplay();
    }
}
function handleOperatorInput(operator){
    // handling keydown text events (*, /)
    if (operator === '*'){
        operator = '×'
    }
    else if (operator === '/'){
        operator = '÷';
    }
    const str = calculatorState.cd.toString();
    if(str.includes('Error')){
        resetAfterError();
    }
    const lastChar = str[str.length-1];

    if(isOperatorPresent(lastChar) && isOperatorPresent(operator)){
        calculatorState.cd = updateLastOperator(str, operator);
        updateDisplay();
        calculatorState.op = operator;
    }
    else if((!isOperatorPresent(lastChar))){
        if(str[0] !== '-' && isOperatorPresent(calculatorState.cd)){
            calculatePreviousNums(operator);
        }
        else if(str[0] === '-' && isOperatorPresent(calculatorState.cd) && (numOfOperatorsPresent(calculatorState.cd)>=2)){
            calculatePreviousNums(operator);
        }
        else{
            enteredOnce = false;
            calculatorState.num1 = parseFloat(calculatorState.currentInput);
            calculatorState.op = operator;
            calculatorState.currentInput = '';
            calculatorState.cd += operator;
            updateDisplay();
        }
    }
}
function calculatePreviousNums(operator){
    calculateResult();
    calculatorState.cd = `${sol}${operator}`;
    updateDisplay();
    calculatorState.currentInput = '';
    calculatorState.num1 = sol;
    calculatorState.op = operator;
}
function calculateResult() {
    calculatorState.num2 = parseFloat(calculatorState.currentInput);
    if(validValues(calculatorState.num1,calculatorState.op, calculatorState.num2)){
        sol = operate(calculatorState.num1, calculatorState.op, calculatorState.num2);
        if(!isFinite(sol)){
            showError("Math Error");
            return 0;
        }
    }
    else{
        showError("syntax Error");
        return 0;
    }
    return 1;
}
function showResult(){
    calculatorState.cd = sol;
    calculatorState.currentInput = sol;
    calculatorState.op = null;
    calculatorState.num2 = null;
    updateDisplay();
}
function showNewData(data){
    calculatorState.currentInput = data;
    calculatorState.cd = data;
    updateDisplay();
    enteredOnce = true;
}
function updateLastOperator(str, newOperator){
    return str.substring(0,str.length-1) + newOperator;
}
const validValues = (num1, op, num2) => {
    if(num1 === null || num1 === undefined || op === '' || num2 === null || num2 === undefined  || isNaN(num1) || isNaN(num2)){
        return false;
    }
    return true;
}
const handleBackspace = () => {
    if(!calculatorState.cd.toString().includes('Error')){
        calculatorState.cd = clearLastCharacter(calculatorState.cd);
        if(isOperatorPresent(calculatorState.cd)){
            str = calculatorState.cd;
            if(calculatorState.cd[0] === '-' && !isOperatorPresent(str.slice(1))){
                calculatorState.currentInput = calculatorState.cd;
            }
            else{
                const index = findIndexOfOperators(calculatorState.cd.toString());
                calculatorState.currentInput = calculatorState.cd.slice(index+1);
            }
        }
        else{
            calculatorState.currentInput = calculatorState.cd;
        }
        updateDisplay();
    }
    else{
        alert('clear the screen with C button');
    }
};

const showError = (message) => {
    calculatorState.cd = message;
    updateDisplay();
}
const resetAfterError = () => {
    calculatorState.cd = '';
    calculatorState.currentInput = '';
    updateDisplay();
}
const clearLastCharacter = (str) => {
    str = str.toString();
    // check if str is empty
    str = str.slice(0,str.length-1);
    return str;
};

const add = (num1, num2)=>{return num1 + num2};
const subtract = (num1, num2)=>{return num1 - num2};
const multiply = (num1, num2)=>{return num1 * num2};
const divide = (num1, num2)=>{return num1 / num2};

function operate(num1, operation, num2){
    switch(operation){
        case '+': return add(num1, num2); break;
        case '-': return subtract(num1, num2); break;
        case '×': return multiply(num1, num2); break;
        case '÷': return divide(num1, num2); break;
    }
}
const findIndexOfOperators = (str) => {
    for(let i = str.length; i >= 0; i--){
        if(isOperatorPresent(str[i])){
            return i;
        }
    }
};