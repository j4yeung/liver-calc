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

  function Check() {
    age = parseInt(document.getElementById("age").value);
    alb = parseInt(document.getElementById("albumin").value);
    mre = parseInt(document.getElementById("mre").value);
    pla = parseInt(document.getElementById("platelet").value);
    ast = parseInt(document.getElementById("ast").value);
    ThY = parseInt(document.getElementById("3Y").value);
    FiY = parseInt(document.getElementById("5Y").value);
}

//Calculate risk score and Chart JS
function Calc() {
  var idvscore = (0.024 * age) + (0.949 * Math.log(mre)) - (0.122 * Math.pow(alb,2)) + (0.734 *Math.log(ast))- (0.016*pla);
  var ThYear = 1 - Math.pow(0.9681,Math.pow(Math.E, idvscore - 0.059));
  var FiYear = 1 - Math.pow(0.9490,Math.pow(Math.E, idvscore - 0.059));

  ThYpercent = ThYear * 100;
  FiYpercent = FiYear * 100;

//Chart JS
var ctx = document.getElementById("chart");

new Chart(ctx, {
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
        }
    }
});

//end Calc fxn 
}



