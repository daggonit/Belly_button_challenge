<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTU Visualization</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
    <div>
        <select id="dropdown-menu" onchange="optionChanged(this.value)"></select>
    </div>
    <div id="sample-metadata"></div>
    <div id="bar"></div>
    <div id="bubble"></div>

    <script>

// Build the metadata panel
function buildMetadata(sample) {
            d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
const metadata = data.metadata;


    // Filter the metadata for the object with the desired sample number
const sampleMetadata = metadata.filter(meta => meta.id == sample)[0];


    // Use d3 to select the panel with id of `#sample-metadata`
const metadataPanel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
metadataPanel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
Object.entries(sampleMetadata).forEach(([key, value]) => {
                    metadataPanel.append("p").text(`${key}: ${value}`);

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      const sampleData = data.samples.filter(d => d.id == sample)[0];

                // Bar chart data
                const otu_ids = sampleData.otu_ids.slice(0, 10).reverse();
                const sample_values = sampleData.sample_values.slice(0, 10).reverse();
                const otu_labels = sampleData.otu_labels.slice(0, 10).reverse();

                // Horizontal bar chart
                const barTrace = {
                    x: sample_values,
                    y: otu_ids.map(id => `OTU ${id}`),
                    text: otu_labels,
                    type: "bar",
                    orientation: "h"
                };
                const barLayout = {
                    title: "Top 10 OTUs",
                    margin: { t: 30, l: 150 }
                };
                Plotly.newPlot("bar", [barTrace], barLayout);

                // Bubble chart data
                const bubbleTrace = {
                    x: sampleData.otu_ids,
                    y: sampleData.sample_values,
                    text: sampleData.otu_labels,
                    mode: "markers",
                    marker: {
                        size: sampleData.sample_values,
                        color: sampleData.otu_ids
                    }
                };
                const bubbleLayout = {
                    title: "OTU Bubble Chart",
                    xaxis: { title: "OTU ID" },
                    yaxis: { title: "Sample Values" },
                    showlegend: false
                };
                Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
            });
        }

    // Get the samples field
    const samples = data.samples;


    // Filter the samples for the object with the desired sample number
     const sampleData = samples.filter(d => d.id == sample)[0];



    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = sampleData.otu_ids;
    const otu_labels = sampleData.otu_labels;
    const sample_values = sampleData.sample_values;


    // Build a Bubble Chart
    const bubbleTrace = {
                    x: otu_ids,
                    y: sample_values,
                    text: otu_labels,
                    mode: "markers",
                    marker: {
                        size: sample_values,
                        color: otu_ids
       }
    };
    const bubbleLayout = {
                    title: "OTU Bubble Chart",
                    xaxis: { title: "OTU ID" },
                    yaxis: { title: "Sample Values" },
                    showlegend: false
    };


    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const top_sample_values = sample_values.slice(0, 10).reverse();
    const top_otu_labels = otu_labels.slice(0, 10).reverse();


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barTrace = {
                    x: top_sample_values,
                    y: yticks,
                    text: top_otu_labels,
                    type: "bar",
                    orientation: "h"
     };
     const barLayout = {
                    title: "Top 10 OTUs",
                    margin: { t: 30, l: 150 }
     };


    // Render the Bar Chart
     Plotly.newPlot("bar", [barTrace], barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      const dropdownMenu = d3.select("#dropdown-menu");
            data.names.forEach(name => {
                dropdownMenu.append("option").text(name).property("value", name);
            });

            const firstSample = data.names[0];
            buildCharts(firstSample);
            buildMetadata(firstSample);

            // Update charts and metadata on dropdown change
            dropdownMenu.on("change", function() {
                const selectedSample = dropdownMenu.property("value");
                buildCharts(selectedSample);
                buildMetadata(selectedSample);
            });
        });
    </script>
</body>
</html>


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
            buildCharts(newSample);
            buildMetadata(newSample);

}

// Initialize the dashboard
function init() {
            d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
                const dropdownMenu = d3.select("#dropdown-menu");
                data.names.forEach(name => {
                    dropdownMenu.append("option").text(name).property("value", name);
                });

                const firstSample = data.names[0];
                buildCharts(firstSample);
                buildMetadata(firstSample);
            });
        }    
init();
</script>