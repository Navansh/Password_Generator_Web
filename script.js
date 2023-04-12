const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-message]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
//set starting color of circle of password strength to grey
setIndicator("#ccc");
handleSlider();

//sets the password length(passwordLength)
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    //set background size of slider such that it fills percentage of the lineat gradient applied and doesn't shrinks it
    //ye karo 
    // inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
    // use this function to get slider to light up as you move it, if you are using a still color(w/o gradient)
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
};


function getRandomInt(min, max){
   return Math.floor(Math.random() * (max-min)) + min
    //this random function * (max-min) will generate random int from 0 to (max-min) and this is possible that this may come 
    //as floating bhi aa sakti hai so we do round off or floor value
    // and then add min, so the final range becomes min to (max) where max is EXCLUDED(exclusive)
}

function generateRandomNumber() {
    return getRandomInt(0,9);
}

function generateLowerCase() { 
    return String.fromCharCode(getRandomInt(97,123));
    //97 -> a and 123 -> z in ASCII 
}

function generateUpperCase() { 
    return String.fromCharCode(getRandomInt(65,91));
    //65 -> A and 91 -> Z in ASCII 
}
function generateSymbol() { 
    //yahaan par hamne pehle hi ek symbol ki string bana li and then ham ek random no choose karte and uss 
    //index ka symbol return kar dete hai
    const randNum = getRandomInt(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) { 
        hasUpper = true;
    }
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasLower && hasUpper &&(hasNum||hasSym) && passwordLength>=8) { 
        setIndicator("#0f0");
    } else if ((hasLower||hasUpper)&& (hasNum||hasSym) && passwordLength>=6) {
        setIndicator("#ff0");
    }
    else setIndicator("#f00")
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value); 
        //it return a promise and that's why we use await ki jab promise resolve ho tabhi aage wala lines execute ho
        copyMsg.innerText = "Copied";
    } catch (err) {
        copyMsg.innerText = "Failed"
    }
    //to make copied wala text visible
    copyMsg.classList.add("active");
    
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    //e.target.value se slider ki value nikaal sakte hain hum
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value) {
        //means ki agar passwordDisplay mein koi value hai toh copy kardo otherwise don't 
        //ye ek truth statement tabhi banegi jab ki value hogi other null hogi jo ek falsy statement hai
        copyContent();
    }
})

function shufflePassword(array){
    //fow shuffling we have fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((element) => (str += element));
    return str;
}


function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    // console.log(checkCount)
    //also if your password length is smaller than no checkboxes then it is an edge condition, so make it atleast equal
    if(passwordLength<checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

generateBtn.addEventListener('click',()=>{
    //null condition -> none of the checkbox are ticked 
    if(checkCount<=0) return;

    //special case
    if(passwordLength <= checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the journey to find new password
    //so first remove old password
    password = "";

    //first fulfilling the checked conditions then remaining spaces mein apne hisaab se randomly daal denge
    // if(upperCaseCheck.checked){
    //     password += generateUpperCase;
    // }
    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase;
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber;
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol;
    // }

    //we'll use diff method

    let funcArr = [];

    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInt(0,funcArr.length);
        //maanlo 4 functions pushed hai to 0 to 3 ke beech ke kisi bhi index ko choose karke uss respective function 
        // ko call kardo
        // console.log(randIndex);
        password += funcArr[randIndex]();
    }

    //now shuffling the generated password 
    //kyunki warna toh capital letter then lower case then number then symbol(if they are selected ) se hi start hoga 
    //exactly issi order mein 

    password = shufflePassword(Array.from(password));

    //showing the password
    passwordDisplay.value = password;
    //display the strength now
    calcStrength();
})






