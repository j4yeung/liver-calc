$(document).ready(function () { //sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

var form = document.getElementById("calc-column");
//listens and updates form inputs to global variables once user done with input ("input" for dynamic inputs while in box)
form.addEventListener("change", Check);

// global variables 
var age = 0;
var alb = 0;
var mre = 0;
var pla = 0;
var ast = 0;
var ThYpercent = 0; //3-Year Risk Percentage 
var FiYpercent = 0; //5-Year Risk Percentage 
var StackedBar; //Bar Chart 

function Check() { //set form inputs to global variables
    age = parseFloat(document.getElementById("age").value);
    alb = parseFloat(document.getElementById("albumin").value);
    mre = parseFloat(document.getElementById("mre").value);
    pla = parseFloat(document.getElementById("platelet").value);
    ast = parseFloat(document.getElementById("ast").value);
    if(StackedBar!=undefined){ //update values if chart rendered 
        ValidForm();
    }
}

function screeninput(inputID) { //check input matches min-max or is entered
    const input = document.getElementById(inputID);
    const validityState = input.validity;

    if (validityState.valueMissing) {
        document.getElementById("result").style.display="none";
        input.setCustomValidity("Please fill out this field");
    }
    else if (validityState.rangeUnderflow) {
        document.getElementById("result").style.display = "none";
        input.setCustomValidity("Value very low; double-check");
    }
    else if(validityState.rangeOverflow) {
        document.getElementById("result").style.display = "none";
        input.setCustomValidity("Value very high; double-check");
    }
    else {
        input.setCustomValidity("");
    }
    input.reportValidity(); 
}


//checks if form filled, will trigger chart and risk-percentages upon all entries filled 
form.addEventListener("submit", ValidForm);

function ValidForm() {
    event.preventDefault(); //prevents button-submit default to refresh page 
    const inputs = ["age","albumin","mre","platelet","ast"];
    for(let i = 0; i < inputs.length; i++){ //checking indvl error inputs on submit 
        screeninput(inputs[i]);
    }
    if(form.checkValidity()){ //if all inputs in, proceed to calculate score 
        Calc();
    }
}

//Calculate risk score and Chart JS
function Calc() {
  var idvscore = (0.024 * age) + (0.949 * Math.log(mre)) - (0.122 * Math.pow(alb,2)) + (0.734 *Math.log(ast))- (0.016*pla);
  var ThYear = 1 - Math.pow(0.9681,Math.pow(Math.E, idvscore - 0.059)); 
  var FiYear = 1 - Math.pow(0.9490,Math.pow(Math.E, idvscore - 0.059));

  ThYpercent = ThYear * 100;
  FiYpercent = FiYear * 100;

  document.getElementById("3Y").textContent = ThYpercent.toPrecision(3) + "%"; //round result for display 
  document.getElementById("5Y").textContent = FiYpercent.toPrecision(3) + "%";

  drawChart();
    document.getElementById("result").style.display = "initial"; //display results column
}
//ChartJs - draws the bar chart 
function drawChart() { 

var ctx = document.getElementById("chart");

if (StackedBar != undefined) { //if Chart has been generated, will update chart with new values 
    var y = [ThYpercent, FiYpercent]; 
    StackedBar.data.datasets[0].data[0] = y[0];
    StackedBar.data.datasets[1].data[0] = y[1];
    StackedBar.update();
} 
//generates chart for the first time 
else {
StackedBar = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Risk Percentage'],
        datasets: [  //each {} is risk result 
            {
               label:'3-Year Risk',
               data: [ThYpercent],
               backgroundColor: '#FAEBCC' 
            },
            {
                label:'5-Year Risk',
               data: [FiYpercent],
               backgroundColor: '#EBCCD1' 
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                min:0,
                max:50 
            }
        },
        responsive: true, //set sizing chart options 
        maintainAspectRatio: false, //important for chart scaling 
        resizeDelay: 2 //Important for dynamic resizing 
        
    }
}); 

document.getElementById("output1").style.display = "flex"; //display results, default hidden
document.getElementById("output2").style.display = "flex";
}

}
