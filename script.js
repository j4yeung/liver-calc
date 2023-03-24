$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

document.getElementById("age").addEventListener("input", Check);
document.getElementById("albumin").addEventListener("input", Check);
document.getElementById("mre").addEventListener("input", Check);
document.getElementById("platelet").addEventListener("input", Check);
document.getElementById("ast").addEventListener("input", Check);

var age = 0;
var alb = 0;
var mre = 0;
var pla = 0;
var ast = 0;
var ThYpercent = 0;
var FiYpercent = 0;
var StackedBar;

function Check() {
    age = parseInt(document.getElementById("age").value);
    alb = parseInt(document.getElementById("albumin").value);
    mre = parseInt(document.getElementById("mre").value);
    pla = parseInt(document.getElementById("platelet").value);
    ast = parseInt(document.getElementById("ast").value);
}
const form = document.getElementById("calc-column");
form.addEventListener("change", () => {
    document.getElementById("calbutton").disabled = !form.checkValidity()
});

//Calculate risk score and Chart JS
function Calc() {
  var idvscore = (0.024 * age) + (0.949 * Math.log(mre)) - (0.122 * Math.pow(alb,2)) + (0.734 *Math.log(ast))- (0.016*pla);
  var ThYear = 1 - Math.pow(0.9681,Math.pow(Math.E, idvscore - 0.059));
  var FiYear = 1 - Math.pow(0.9490,Math.pow(Math.E, idvscore - 0.059));

  ThYpercent = ThYear * 100;
  FiYpercent = FiYear * 100;

  document.getElementById("3Y").textContent = ThYpercent.toPrecision(3) + "%";
  document.getElementById("5Y").textContent = FiYpercent.toPrecision(3) + "%";

  drawChart();
}

function drawChart() {
    //Chart JS


var ctx = document.getElementById("chart");

if (StackedBar != undefined) {
    var y = [ThYpercent, FiYpercent];
    StackedBar.data.datasets[0].data[0] = y[0];
    StackedBar.data.datasets[1].data[0] = y[1];
    StackedBar.update();
} 

else {
StackedBar = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Risk Percentage'],
        datasets: [
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
                max:100
            },
            x: {
                stacked: true
            }
        },
        responsive: true,
        aspectRatio: 1 / 1,
        resizeDelay: 20
        
    }
}); 

document.getElementById("output1").style.display = "flex";
document.getElementById("output2").style.display = "flex";
}

}




