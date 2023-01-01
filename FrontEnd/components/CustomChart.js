export default {
    template: `<div>
        <canvas
            id="myChart"
            width="500"
            height="300"
            aria-label="chart"
            role="img"
            ref="myid"
        ></canvas>
    </div>`,
    props: ['alllogs', 'tracker_name', 'charttype', 'settingsval'],

    mounted() {
        var ctx = this.$refs.myid.getContext("2d");
        //Preparing Data and Values
        let datalevels = null
        let datavalues = null
        let valobj = {}
        if (this.charttype == 'line'){
          datalevels = this.alllogs.map(function (el) { return el.timestamp; })
          datavalues = this.alllogs.map(function (el) { return el.value; })
        } else {
          for (const val of this.settingsval) {
            valobj[val] = 0
          }
          for (const logobj of this.alllogs) {
            const mykey = logobj.value
            valobj[mykey] = valobj[mykey] + 1
          }
          datalevels = Object.keys(valobj)
          datavalues = Object.values(valobj)
        }

        // Creating Chart Class Object
        let myChart = new Chart(ctx, {
          type: this.charttype, // Type of Chart - bar, line, pie, doughnut
          // The data for our dataset
          data: {
            labels: datalevels, // Data Labels //["Python", "JavaScript", "PHP", "Java", "C#", "C++"],
            datasets: [
              {
                label: this.tracker_name + " Chart",  //  Chart Label
                data: datavalues, // Actual Data //[13, 15, 5, 10, 9, 10]
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1.3,   // Border Width
              },
            ],
          },
          options: {            
            responsive: true, // When Its True(default) Canvas Width Height won't work
            animation: {
              duration: 1500,
              easing: "easeInOutBounce",
            },
        
          },
        });
    },

}
