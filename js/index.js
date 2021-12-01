const apiBaseURL = "https://testapi.agilefi.org/api";

countDown();

function countDown() {
    // Set the date we're counting down to
    var countDownDate = new Date(1638316800000).getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();
        
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
        
      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
      // Output the result in an element with id="demo"
      document.getElementById("countdown").innerHTML = "<div class='days timer-col'><div class='timer-inner-col'><span>" + days + "</span><span>days</span></div></div> " +"<div class='hours timer-col'><div class='timer-inner-col'><span>" + hours + "</span><span>Hours</span></div></div> "
      + "<div class='Minutes timer-col'><div class='timer-inner-col'><span>" + minutes + "</span><span>Minutes</span></div></div>  " + "<div class='Seconds timer-col'><div class='timer-inner-col'><span>" + seconds + "</span><span>Seconds</span></div></div>  ";
        
      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "EXPIRED";
      }
    }, 1000);
}

$(document).ready(function () {
    let markets = null;
    let aglPrice = 0;

    const request = $.ajax({
        url: `${apiBaseURL}/v1/governance/agile`,
        header: "Access-Control-Allow-Origin: *"
    });

    request.done(function (response) {
        console.log(response)
        markets = response?.data?.markets;
        farmTVL = response?.data?.farmTVL;

        $('#markets').text(`${markets.length} MARKETS`)

        let tvl = 0
        let totalSupply = 0;
        if (markets.length > 0) {
            totalSupply = markets.reduce((prev, current) => {
                return prev + Number(current.totalSupplyUsd)
            }, 0);
        }
        tvl = totalSupply + Number(farmTVL);
        $('#tvl').text(`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(tvl)}`);

        if (markets.length > 0) {
            totalSupply = markets.reduce((prev, current) => {
                return prev + Number(current.totalSupplyUsd)
            }, 0);
        }
        $('#total-supply').text(`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(totalSupply)}`);
    });
});