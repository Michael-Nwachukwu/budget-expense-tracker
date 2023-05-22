// The Calendar
function generate_year_range(start, end) {
  var years = "";
  for (var year = start; year <= end; year++) {
    years += "<option value='" + year + "'>" + year + "</option>";
  }
  return years;
}

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

createYear = generate_year_range(1970, 2050);
/** or
 * createYear = generate_year_range( 1970, currentYear );
 */

document.getElementById("year").innerHTML = createYear;

var calendar = document.getElementById("calendar");
var lang = calendar.getAttribute("data-lang");

var months = "";
var days = "";

var monthDefault = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var dayDefault = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

if (lang == "en") {
  months = monthDefault;
  days = dayDefault;
} else if (lang == "id") {
  months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  days = ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
} else if (lang == "fr") {
  months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  days = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
} else {
  months = monthDefault;
  days = dayDefault;
}

var $dataHead = "<tr>";
for (dhead in days) {
  $dataHead += "<th data-days='" + days[dhead] + "'>" + days[dhead] + "</th>";
}
$dataHead += "</tr>";

//alert($dataHead);
document.getElementById("thead-month").innerHTML = $dataHead;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
  var firstDay = new Date(year, month).getDay();

  tbl = document.getElementById("calendar-body");

  tbl.innerHTML = "";

  monthAndYear.innerHTML = months[month] + " " + year;
  selectYear.value = year;
  selectMonth.value = month;

  // creating all cells
  var date = 1;
  for (var i = 0; i < 6; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        break;
      } else {
        cell = document.createElement("td");
        cell.setAttribute("data-date", date);
        cell.setAttribute("data-month", month + 1);
        cell.setAttribute("data-year", year);
        cell.setAttribute("data-month_name", months[month]);
        cell.className = "date-picker";
        cell.innerHTML = "<span>" + date + "</span>";

        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          cell.className = "date-picker selected";
        }
        row.appendChild(cell);
        date++;
      }
    }

    tbl.appendChild(row);
  }
}

function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

// =======================================================================================================================

// The calculator element
const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator-grid");
const display = calculator.querySelector(".current-operand");
const clearBtn = calculator.querySelector(".clear");
const delBtn = calculator.querySelector(".delete");

clearBtn.addEventListener("click", () => {
  display.textContent = "0";
});

delBtn.addEventListener("click", () => {
  let res = display.textContent.toString().slice(0, -1);

  display.innerHTML = res;
});

keys.addEventListener("click", (event) => {
  //getting the contnet of the button being clicked on
  // console.log(event.target.textContent);
  const key = event.target;

  //displaying keys in output window and overrideing default 0 value
  const keyValue = key.textContent;

  //define displayvalue as original display.textcontent
  const displayValue = display.textContent;
  // console.log(displayValue);

  //setting variable of type in html dataset
  const { type } = key.dataset;

  //setting previouskeytype in calculator.dataset
  const { previousKeyType } = calculator.dataset;

  // setting previouskeytype to be var type which will pass operator/number as d case may be.
  calculator.dataset.previousKeyType = type;

  //replacing the default display value as keycontent for number keys
  //data type is set to number in html so if its number run code

  if (type == "number") {
    if (displayValue == "0") {
      display.textContent = keyValue;
    } else if (previousKeyType == "operator" || previousKeyType == "equals") {
      display.textContent = keyValue;
    } else {
      display.textContent = displayValue + keyValue;
    }
  }

  //hiding the operator buttons when clicked to avoid showing on the display screen

  if (type == "operator") {
    //selecting an active operator key so users will know which operator is active atm
    //getting all operator keys with selectorforall
    const operatorKeys = keys.querySelectorAll('[data-type="operator"]');

    //this allows for one operator btn to be selected at one time
    operatorKeys.forEach((el) => {
      el.dataset.state = "";
    });

    //set the operator key as selected; so as to inherit the css properties
    key.dataset.state = "selected";

    //saving the first number input and the operator of choice to use it in the calculation
    calculator.dataset.firstNumber = displayValue;
    calculator.dataset.operator = keyValue;
  }

  if (type == "equals") {
    //perform a calculation
    //use parseint to convert key values to number
    const firstNumber = parseInt(calculator.dataset.firstNumber);
    const operator = calculator.dataset.operator;
    const secondNumber = parseInt(displayValue); //since the second number comes last so its still d current display number

    console.log(firstNumber, operator, secondNumber);

    let result = "";

    if (operator == "+") result = firstNumber + secondNumber;

    if (operator == "-") result = firstNumber - secondNumber;

    if (operator == "X") result = firstNumber * secondNumber;

    if (operator == "/") result = firstNumber / secondNumber;

    display.textContent = result;

    console.log(result);
  }
});

// ======================================================================================================================

// drag element
// Make the calculator element draggable:
let draggableDiv = document.getElementById('mydiv');
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

draggableDiv.addEventListener('mousedown', function(event) {
  offsetX = event.clientX - draggableDiv.offsetLeft;
  offsetY = event.clientY - draggableDiv.offsetTop;
  isDragging = true;
});

document.addEventListener('mousemove', function(event) {
  if (isDragging) {
    draggableDiv.style.left = (event.clientX - offsetX) + 'px';
    draggableDiv.style.top = (event.clientY - offsetY) + 'px';
  }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
});


// ================================================================================================================================

// The Budget Mechanics

// selecting submit buttons
$("#budget-submit").click(setBudgetElements);
$("#expense-submit").click(setExpenseElements);

// date
const d = new Date();
let day = d.getDate();

const indMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const m = new Date();
let month = indMonths[m.getMonth()];

const y = new Date();
let year = y.getFullYear();

const date = `${day} ${month} ${year}`;


// functon to handle budget button
function setBudgetElements(event) {
  // making the event fire only once
  event.preventDefault();

  // form validation to make sure input isnt empty
  if ($("#budget-input").val()) {
    let budgetValue =
      parseInt($("#budget-amount").text()) + parseInt($("#budget-input").val());

    // passing input value to the budget field
    $("#budget-amount").text(budgetValue);

    // clearing the input field
    $("#budget-input").val("");

    // function to set the balance according tp the budget
    setBalance();

    // editing budget amount on click
    $("#budget-amount").click(function () {

      // setting the budget input field to the budgetvalue
      $("#budget-input").val(budgetValue);

      // resetting budget value to 0
      $("#budget-amount").text(parseInt("0"));

    });
  } else if ($("#budget-input").val(null)) {
    // if input is empty throw alert
    alert("please input value");
  }

  // set bootstrap error message
}

// function to handle expense button
function setExpenseElements(event) {
  // function to make click event fire only once
  event.preventDefault();

  // form validation to make sure form isnt empty
  if ($("#amount-input").val() && $("#expense-input").val()) {

    let expenseValue = parseInt($("#expense-amount").text()) + parseInt($("#amount-input").val());

    // setting expense field to the expense val
    $("#expense-amount").text(expenseValue);

    // setting balance as per the difference between budget and expense
    setBalance();

    // function to display expense particulars to the fields
    setExpenseDetails();

    // function to add values to categories
    addToCategory();

    // setting number of transactions (not)
    let not = parseInt($("#not").text()) + 1;
    $("#not").text(not);


  } else if ($("#amount-input").val(null) || $("#expense-input").val(null)) {
    // if input is empty throw alert
    alert("please input expense details");
  }

  // clearing the input field
  $("#amount-input").val("");
  $("#expense-input").val("");

}

// function to add expense values to respective categories
function addToCategory(){

  if ($("#categories :selected").text() == "Bills") {
      let billTotal = parseInt($("#bill-total").text()) + parseInt($("#amount-input").val());
  
      $("#bill-total").text(billTotal);
      
  }
  
  if ($("#categories :selected").text() == "Education") {
      let educationTotal = parseInt($("#education-total").text()) + parseInt($("#amount-input").val());
  
      $("#education-total").text(educationTotal);
  
  }
  
  if ($("#categories :selected").text() == "Utility") {
      let utilityTotal = parseInt($("#utility-total").text()) + parseInt($("#amount-input").val());
  
      $("#utility-total").text(utilityTotal);
  
  }
  
  if ($("#categories :selected").text() == "Shopping") {
      let shoppingTotal = parseInt($("#shopping-total").text()) + parseInt($("#amount-input").val());
  
      $("#shopping-total").text(shoppingTotal);
  
  }
}

// function to set balance
function setBalance() {
  let balance =
    parseInt($("#budget-amount").text()) -
    parseInt($("#expense-amount").text());

  $("#balance-amount").text(balance);

  if (balance < 0) {
    // set balance colors blue, red, black
  }

}

window.addEventListener("load", ()=>{$("#date").text(date)} );

// function to append expense particulars to the dom
function setExpenseDetails() {

  let title = $("#expense-input").val();
  let value = $("#amount-input").val();
  let category = $("#categories :selected").text();

  let template = `
            <div class="expense">
                <div class="bg-slate-50 flex flex-row justify-between content-center items-center px-4 md:px-9 py-4 sm:py-7 rounded-2xl hover:shadow-xl hover:hover:bg-gray-200">

                    <!-- tag and title -->
                    <div class="flex flex-row justify-around items-center">
                        <!-- icon -->
                        <div class="img-container pr-7 hidden md:block">
                            <img src="/image/tag-one-svgrepo-com.svg" class="w-10 h-10  md:w-10 md:h-10" alt="">
                        </div>
                        <!-- title -->
                        <div>
                            <span class="text-black font-light text-xl md:text-2xl expense-name">${title}</span><br>
                            <span  class="text-slate-600 text-sm">${date}</span> <br>
                            <span  class="text-slate-600 text-xs category">${category}</span>
                        </div>
                    </div>

                    <!-- amount, delete and edit -->
                    <div class="flex flex-row space-x-4 sm:space-x-6 content-center items-center">

                        <div class=" flex flex-row items-center text-gray-700 text-xl sm:text-2xl">
                            <span class="font-extrabold">-$</span>
                            <span class="font-bold expense-amount"> ${value}</span>
                        </div>

                        <div class="bg-gray-200 rounded-xl">
                            <a class="edit-button" href="#" data-edit>
                                <i class="fa-solid fa-pen-to-square text-blue-700 px-3 py-2 md:px-5 md:py-4"></i>
                            </a>
                        </div>

                        <!--  -->

                        <div class="bg-gray-200 rounded-xl ml-4">
                            <a class="modif-button" href="#" data-delete-btn>
                                <i class="fa-solid fa-trash-can text-red-700 px-3 py-2 md:px-5 md:py-4"></i>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
    `;

  $("#injectable").prepend(template);

}
// onclick="editExpense(event, ${value}, '${category}')"

// Removing expense from DOM
// $(document).on('click', '.modif-button', function() {
//   $(this).closest('.expense').remove();
// });

function deleteExpenseButtonClick(event) {
  var expenseElement = $(this).closest('.expense');
  expenseElement.remove();
  deleteExpense(event, expenseElement);
}

$(document).on('click', '.modif-button', deleteExpenseButtonClick);


// function to delete expense
function deleteExpense(event, expenseElement) {

  var expenseAmount = expenseElement.find('.expense-amount').text();
  var expenseCategory = expenseElement.find('.category').text();

  console.log(expenseAmount);

  // resetting the budget balance amount by adding back the deleteed expense to the balance
  $("#balance-amount").text(
    parseInt($("#balance-amount").text()) + parseInt(expenseAmount)
  );

  // resetting the budget balance amount by adding back the deleteed expense to the balance
  $("#expense-amount").text(
    parseInt($("#expense-amount").text()) - parseInt(expenseAmount)
  );

  //   subtracting number of transactions with each deleted expense
  let not = parseInt($("#not").text()) - 1;
  $("#not").text(not);

  //   subtracting deleted expense from the appropriate category it was added
  if (expenseCategory == "Bills") {
    $("#bill-total").text(parseInt($("#bill-total").text()) - expenseAmount);
  }

  if (expenseCategory == "Education") {
    $("#education-total").text(parseInt($("#education-total").text()) - expenseAmount);
  }

  if (expenseCategory == "Utility") {
    $("#utility-total").text(parseInt($("#utility-total").text()) - expenseAmount);
  }

  if (expenseCategory == "Shopping") {
    $("#shopping-total").text(parseInt($("#shopping-total").text()) - expenseAmount);
  }

  return false;
}

$(document).on('click', '.edit-button', function(event, expenseAmount, expenseCategory) {

  var expenseDiv = $(this).closest('.expense');
  $(this).addClass('editing');
  var expenseName = expenseDiv.find('.expense-name').text();
  var expenseAmount = expenseDiv.find('.expense-amount').text();
  var expenseCategory = expenseDiv.find('.category').text();

  // Populate the input fields in the edit modal
  $('#editexpense-input').val(expenseName);
  $('#editamount-input').val(expenseAmount);
  $('#categories :selected').text(expenseCategory);

  // Show the edit modal
  $('.modall').show();

  deleteExpense(event, expenseDiv);
});

$('#openBtn').click(function(event) {
  console.log('see');
  $('#modal').show();
});

// Save the edited expense when the save button is clicked
$('#saveButton').click(function(event) {

  // capture edit input values
  let editedName = $('#editexpense-input').val();
  let editedAmount = $('#editamount-input').val();
  let editedCategory = $('#editcategories').val();

  // Update the expense name and amount in the corresponding div
  let expenseDiv = $('.expense:has(.editing)');
  expenseDiv.find('.expense-name').text(editedName);
  expenseDiv.find('.expense-amount').text(editedAmount);
  expenseDiv.find('.category').text(editedCategory);

  // remove state class of editing from edit-button
  $('[data-edit]').removeClass('editing');

  // Hide the edit modal
  $('.modall').hide();

  // recalculate balances
  // value of transactions
  let expenseValue = parseInt($("#expense-amount").text()) + parseInt($("#editamount-input").val());

  // setting expense field to the expense val
  $("#expense-amount").text(expenseValue);

  // setting balance as per the difference between budget and expense
  setBalance();

  // function to add values to categories
  // addToCategory();

  if ($("#editcategories :selected").text() == "Bills"){
    let billTotal = parseInt($("#bill-total").text()) + parseInt($("#editamount-input").val());
  
    $("#bill-total").text(billTotal);
  }
  
  if ($("#editcategories :selected").text() == "Education"){
    let educationTotal = parseInt($("#education-total").text()) + parseInt($("#editamount-input").val());
  
    $("#education-total").text(educationTotal);
  }
  
  if ($("#editcategories :selected").text() == "Utility"){
    let utilityTotal = parseInt($("#utility-total").text()) + parseInt($("#editamount-input").val());
  
    $("#utility-total").text(utilityTotal);
  }
  
  if ($("#editcategories :selected").text() == "Shopping"){
    let shoppingTotal = parseInt($("#shopping-total").text()) + parseInt($("#editamount-input").val());
  
    $("#shopping-total").text(shoppingTotal);
  }

  // setting number of transactions (not)
  let not = parseInt($("#not").text()) + 1;
  $("#not").text(not);

  return false;
});


// frequent bills popup modal
let frequentBills = document.querySelectorAll("[data-freq]");
frequentBills.forEach((bill) => {
  bill.addEventListener("click", (event) => {
    
    $('#modal').show();
    
    let expenseName = event.target.childNodes[0].data;

    $("#expense-input").val(expenseName);
    
  });
});

$("#hamburgerButton").click(function() {
  $("#sideAside").removeClass("hidden").css("transform", "translateX(0)");
  $("#mainSection").addClass("hidden");
});

$("#exitButton").click(function() {
  $("#sideAside").addClass("hidden").css("transform", "translateX(100%)");
  $("#mainSection").removeClass("hidden");
});

