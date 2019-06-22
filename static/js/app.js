function buildMetadata(sample) {


  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`

  d3.json(url).then(response => {

    
    // get a reference to the table body
    // Use d3 to select the panel with id of `#sample-metadata`
    var table_body = d3.select('#sample-metadata')

        // Use `.html(“”) to clear any existing metadata
    table_body.html('')
         // Use `Object.entries` to add each key and value pair to the panel   
            Object.entries(response).forEach(([key, value])=>{
                var row = table_body.append('tr')
                var cell = row.append('td')
                cell.text(`${key}: ${value}`)
            })

  })

}
 
// @TODO: Build a Bubble Chart using the sample data
 function buildCharts(sample) {
  var url = `/samples/${sample}`

  d3.json(url).then(response => {
    var bubblechart = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: `markers`,
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      },
      showlegend: false
    };
  var data = [bubblechart]
  var layout = {
      title: "Belly Button Bubble Chart",
      xaxis: {
        title: "OTU IDs"
      }
    };

    Plotly.plot("bubble",data,layout);

  })
// @TODO: Build a pie Chart using the sample data
  d3.json(url).then(response => {
    // console.log(response)
    // var pie_chart = d3.select('#pie')
    
    
    // Object.entries(response).forEach(([key, value])=>{
      
      var data = [{
        values: response.sample_values.slice(0,10),
        labels: response.otu_ids.slice(0,10),
        hoverinfo: response.otu_labels.slice(0,10),
        type: "pie"
      }];
    
      var layout = {
        height: 500,
        width: 500
      };
      
      
      Plotly.plot("pie", data, layout);
      
      
    })
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
 

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
