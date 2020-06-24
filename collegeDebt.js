// --- much code derived from Quinn Friebe's work at http://webp.svsu.edu/~qefriebe/cis255/as06/as06.html

// ===== GLOBAL VARIABLES =====

// default values
let loans = [
    { loan_year: 2020, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2021, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2022, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2023, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2024, loan_amount: 10000.00, loan_int_rate: 0.0453 }
]; 
let loanWithInterest = 0;
let int = 0;
let payments;

// ===== FUNCTIONS =====

// ----- Plain JavaScript -----

// -------------------------------------------------------
function toComma(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// -------------------------------------------------------
let toMoney = (value) => {
  return `\$${toComma(value.toFixed(2))}`; //Use toComma to get comma separated amounts, and set it to 2 decimal values.
}

// -------------------------------------------------------
let saveForm = () => {
  localStorage.setItem(`as06`, JSON.stringify(loans)); //save form to local storage
}

// -------------------------------------------------------
let loadForm = () => {
  if(localStorage.getItem(`as06`) != null){ //check if there is saved data in local Storage
     loans = JSON.parse(localStorage.getItem(`as06`)); 
     updateForm(); //if there is saved data, update the form
  } else {
     alert(`Error: no saved values`);
  }
}

// ----- JQUERY -----

// -------------------------------------------------------
// display the entry form
function loadDoc() {
    
  // pre-fill defaults for first loan year
  var defaultYear = loans[0].loan_year; //get defaultYear from the loans array
  $("#loan_year0" + 1).val(defaultYear++); //use Jquery to set the first year in the table
  var defaultLoanAmount = loans[0].loan_amount; //get default Loan Amount from loans array
  $("#loan_amt0" + 1).val(defaultLoanAmount.toFixed(2)); //use Jquery to set the loaned amount for year 1
  var defaultInterestRate = loans[0].loan_int_rate; //get the interest rate from the loans array
  $("#loan_int0" + 1).val(defaultInterestRate); //put the interest rate in the table
  var loanWithInterest  
    = loans[0].loan_amount * (1 + loans[0].loan_int_rate); //calculate the total loans with interest added in
  $("#loan_bal0" + 1).text(toMoney(loanWithInterest)); //put in table not in text field
    
  // pre-fill defaults for other loan years
  for(var i=2; i<6; i++) { //loop through rows 2-5 inclusive
    $(`#loan_year0${i}`).val(defaultYear++); //take defaultYear and add 1 and set it to the current loan year
    $(`#loan_year0${i}`).attr("disabled","true"); //set all defaultYear(s) to be read-only
    $(`#loan_year0${i}`).css({
      "backgroundColor":"grey","color":"white"
    }); //set background color to grey/white
    $(`#loan_amt0${i}`).val(defaultLoanAmount.toFixed(2)); //set loan amount numeral to be 2 decimal places
    $(`#loan_int0${i}`).val(defaultInterestRate); //get loan interest rate and insert
    $(`#loan_int0${i}`).attr("disabled","true"); //set loan rate to readonly
    $(`#loan_int0${i}`).css({
      "backgroundColor":"grey","color":"white"
    }); //make read only cells greyed out
    loanWithInterest 
      = (loanWithInterest + defaultLoanAmount) 
      * (1 + defaultInterestRate); //calculate loans with interest
    $("#loan_bal0" + i).text(toMoney(loanWithInterest)); //place in non-text field
  } // end: "for" loop
    
  // all input fields: select contents on focus
  $("input[type=text]").focus(function() { 
    $(this).select();
    $(this).css("background-color", "yellow"); //set background to yellow when cell is focused
  }); 
  $("input[type=text]").blur(function() {
    $(this).css("background-color", "white"); //when not focused turn to white
    updateLoansArray();
  });
    
  // set focus to first year
  $("#loan_year01").focus();

} // end: function loadDoc()

// -------------------------------------------------------
// update loans data with user-entered values
// regex tester web site: https://www.regexpal.com/
function updateLoansArray() {
  let valid = true;
  // yearP enforces rule: 4 numerical digits starting with 19 or 20
  let yearP = /^(19|20)\d{2}$/; 
  //amtP enforces rule: starts with a number 1-9, then after that first digit can be any number. after the decimal there can be 1 or 2 decimal places if desired.
  let amtP = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/; 
  //intP enforces rule: starts with "0." and then asks for any decimals up to 5 decimal places.
  let intP = /^(0|)+(.[0-9]{1,5})?$/;

  // if year is not valid, set valid to false, and set background red
  if(!yearP.test($(`#loan_year01`).val())){
    valid = false;
    $(`#loan_year01`).css("background-color", "red");
  }
  
  //if loan amount is not valid, set valid to false, and set the background to red
  for (i = 1; i < 6; i++) {
    if(!amtP.test($(`#loan_amt0${i}`).val())) {
      valid = false;
      $(`#loan_amt0${i}`).css("background-color", "red");
    } 
  }


	//if interest percentage is not valid, set valid to false and turn background red
  if(!intP.test($(`#loan_int01`).val())) {
    valid = false;
    $(`#loan_int01`).css("background-color", "red");
  }

  // if all user-entered data is okay, then update loans variable and form
  if(valid) {
    loans[0].loan_year = parseInt($("#loan_year01").val());
    for(var i=1; i<5; i++) {
      loans[i].loan_year = loans[0].loan_year + i;
    }
    for(i = 1; i<6; i++){
      let amt = parseFloat($(`#loan_amt0${i}`).val()).toFixed(2);
      loans[i-1].loan_amount = amt;
    }
    let rate = parseFloat($("#loan_int01").val());
    for(i=0; i<5; i++){
      loans[i].loan_int_rate = rate;
    }
    updateForm();
  } // end: if
  
} // end: function updateLoansArray()

// -------------------------------------------------------
// display the data entry form with updated user-entered values
let updateForm = () => {
  loanWithInterest = 0;
  let totalAmt = 0;
  for(i = 1; i < 6; i++) {
    $(`#loan_year0${i}`).val(loans[i - 1].loan_year);
    let amt = loans[i - 1].loan_amount;
    $(`#loan_amt0${i}`).val(amt);
    totalAmt += parseFloat(amt);
    $(`#loan_int0${i}`).val(loans[i - 1].loan_int_rate);
    loanWithInterest 
      = (loanWithInterest + parseFloat(amt)) 
      * (1 + loans[0].loan_int_rate);
    $("#loan_bal0" + i).text(toMoney(loanWithInterest));
  }
  int = loanWithInterest - totalAmt;
  $(`#loan_int_accrued`).text(toMoney(int));
  
} // end: function updateForm()
  

// ----- ANGULAR -----
//create app
var app = angular.module('myApp', []);

//create controller 
app.controller('myCtrl', function($scope) {
  $scope.payments =[]; //connects controller to the html
  $scope.populate = function () { //
    updateForm();
    let total = loanWithInterest; //set total to current total with interest after 5 years of college
    let iRate = loans[0].loan_int_rate;//set the interest rate equal to the inputted field
    let r = iRate / 12; //set the rate percentage per month
    let n = 11;
    //loan payment formula
    //https://www.thebalance.com/loan-payment-calculations-315564
    let pay = 12 * (total / ((((1+r)**(n*12))-1)/(r *(1+r)**(n*12)))); //set a payment equal to an even payment every year when accounting for interest.
    for (let i = 0; i < 10; i++) { //loop through the years, making payments every year
      total -= pay //subtract the paid amount
      let int = total * (iRate); //get the amount of payment needed
      $scope.payments[i] = {
        "year":loans[4].loan_year + i + 1, //display the year of the payment
        "payment": toMoney(pay), //toMoney the amount needed to be paid
        "amt": toMoney(int), //set intamount equal to the amount of interest generated 
        "ye": toMoney(total += int) //get year end balance
      }
    }
    $scope.payments[10] = {
      "year":loans[4].loan_year + 11, //set last year of payment
      "payment": toMoney(total), //format the total remaining balance
      "amt": toMoney(0), //no more interest to be paid
      "ye":toMoney(0) //no more balance total to be paid
    }
    payments = $scope.payments;
  }
});