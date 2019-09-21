function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(response) {
      var data = response;

      // Use d3 to select the panel with id of `#sample-metadata`
      // Use `.html("") to clear any existing metadata
      var metadata = d3.select("#sample-metadata").html("");

      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      for (var i = 0; i < 1; i++) {
        Object.entries(data).forEach(([key, value]) => {
        metadata.append("p").text(`${key}: ${value}`);
        });
      }
    });
}
  
function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(function(response) {
      console.log(response);
      var data = response;
    
      // @TODO: Build a Bubble Chart using the sample data
      var x_values = data.otu_ids;
      var y_values = data.sample_values;
      var marker_size = data.sample_values;
      var marker_colors = data.otu_ids;
      var text_values = data.otu_labels;

      var trace1 = {
        x: x_values,
        y: y_values,
        text: text_values,
        mode: "markers",
        marker: {
          color: marker_colors,
          size: marker_size
        }
      };

      var data1 = [trace1];
      
      var layout = {
        height: 600,
        width: 1200
      };

      Plotly.newPlot("bubble", data1, layout);
  
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      var values = data.sample_values;
      var labels = data.otu_ids;
      var hovertext = data.otu_labels;

      var trace2 = {
        values: values.slice(0, 10),
        labels: labels.slice(0, 10),
        hoverinfo: hovertext.slice(0, 10),
        type: "pie"
      };

      var data2 = [trace2];

      var layout2 = {
        height: 600,
        width: 600
      };

      Plotly.newPlot("pie", data2, layout2);
    });
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
    });
}
  
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}
    
  // Initialize the dashboard
  init();