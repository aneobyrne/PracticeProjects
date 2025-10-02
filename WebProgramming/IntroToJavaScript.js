// WEB CONSOLE
/* A web console is a feature in your browser that can run JavaScript code. The console.log() method tells the web console to output a message.
 The message we want to display should be inside parentheses ( ) and surrounded by quotes. */
console.log("👋 Hello!");
console.log('👋 Hello!');
// JavaScript runs one line of code at a time.

//VARIABLES
// Used for storing data values that can be used later in the program. Each variable has a name and they hold a value.
/* To create or declare a variable, we need a let or const keyword:
      let is used for variables where the value will change.
      const is used for variables where the value will stay constant. */
keyword name = value;
console.log(name); // can pritn multiple separated by ,'s

//DATA TYPES
/* A number can be any integer or decimal number. It can be used to represent whole numbers, fractions or precise measurements.
   A string is used for storing text or sequence of characters. Strings are wrapped in double quotes " " or single quotes ' '.
   A Boolean data type, or bool, stores a value that can only be either true or false. In JavaScript, it's lowercased true or false.
   Any variable that is declared but hasn't yet received a value is undefined. */
let num = 2;
const name = "Ane";
let active = true;
let year;

//OPERATORS

//ARITHMETIC OPERATORS
/*JavaScript has the following arithmetic operators:
+ Addition
- Subtraction
* Multiplication
/ Division
% Modulo (returns the remainder)
** Exponent (covered in the next exercise) */

//COMPARISON OPERATORS
/*Usually, we are comparing two values in a condition. To do so, we use comparison operators:
=== strict equal
!== strict not equal
> greater than
>= greater than or equal
< less than
<= less than or equal*/

//LOGICAL OPERATORS: 
/*Also known as Boolean operators, combine and evaluate two conditions. They are &&, ||, and ! operators:
The AND logical operator && returns true if both conditions are true, and returns false otherwise.
The OR logical operator || returns true if at least one of the conditions is true, and false otherwise.
The NOT logical operator ! returns true if the condition is false, and vice versa. */

//CONTROL FLOW: we want our program to do different things based on different conditions
//IF STATEMENT: tests a condition for truth and executes the code if it is true
if (condition) {
  // Do something
}
//An else clause can be optionally added to the end of an if statement.
if (condition) {
  // Do something
} else {
  // Do something else 
}
//You can add an else if section between the if and else in your control flow! This gives your program more conditions to evaluate, besides just two.
if (conditionA) {
  // Do this
} else if (conditionB) {
  // Do this, instead
} else {
  // Do this if none of the above are true
}

//In JavaScript, the Math.random() method returns a random decimal number between 0 and 1.
console.log(Math.random());
//To get a random integer between 0 to 9. Then rounding it down to the nearest integer with Math.floor().
Math.floor(Math.random() * 10);

//ROCK PAPER SCISSORS:
// Write code below 💖
let playerNum = Math.floor(Math.random() * 3); //0,1,2
let computerNum = Math.floor(Math.random() * 3);
let playerMove;
let computerMove;

if (playerNum == 0){
  playerMove = "Rock";
}
else if (playerNum == 1){
  playerMove = "Paper";
}
else if (playerNum == 2){
  playerMove = "Scissors";
}

if (computerNum == 0){
  computerMove = "Rock";
}
else if (computerNum == 1){
  computerMove = "Paper";
}
else if (computerNum == 2){
  computerMove = "Scissors";
}

console.log("Player picked:      ", playerMove);
console.log("Computer picked:    ", computerMove);

if (playerNum == computerNum){
  console.log("Tie!");
}
else if (playerNum == 0 && computerNum == 1){
  console.log("The computer won!");
}
else if (playerNum == 1 && computerNum == 2){
  console.log("The computer won!");
}
else if (playerNum == 2 && computerNum == 0){
  console.log("The computer won!");
}
else {
  console.log("The player won!");
}

//LOOPS
//Used to repeat a block of code based on a certain condition.
//1. WHILE LOOP: The while loop uses a condition that is either true or false. 
while (condition) {
  // Code here
}
//Iterators: updated a variable within our loops.
let i = initialValue;

while (condition) {
  // Update the i iterator variable
}
//As long as the condition is true, the code in the while loop will run. Otherwise, the loop ends when the condition becomes false.
let randomNumber = Math.floor(Math.random() * 10);
while (randomNumber !== 7) {
  console.log("Duck 🦆");
  randomNumber = Math.floor(Math.random() * 10);
}
console.log("Goose! 🦢");
//2. FOR LOOP: we can determine how many times we want it to run.
for (let i = initialValue; condition; updateIterator) {
  // Code here
}
//3. CONTINUE: If a given condition is true, the continue keyword ends the current iteration in a given for or while loop and we go to the next one.
for (let i = 0; i < 5; i++) {
  if (i == 1) {
    continue;
  }
  console.log(i);
}
//4. BREAK: If a given condition in a loop is true, this keyword ends the loop altogether and the program resumes on the line immediately after the closing curly bracket of the loop.
for (let i = 0; i < 5; i++) {
  if (i == 3) {
    break;
  }
  console.log(i);
}

//Note: Odd values of i -> i % 2 == 1, Even values of i -> i % 2 == 0

// EXAMPLE:
const myNumber = 8;
let binary = "";

// With for loop
for (let i = myNumber; i > 0 ; i = Math.floor(i/2)) {
  if (i % 2 == 0) {
    binary = "0" + binary;
  } else {
    binary = "1" + binary;
  }
}
console.log(binary);

// With while loop
let i = myNumber;
binary = "";
while (i >= 1) {
  if (i % 2 == 0) {
    binary = "0" + binary;
  } else {
    binary = "1" + binary;
  }
  i = Math.floor(i/2);
}

console.log(binary);
