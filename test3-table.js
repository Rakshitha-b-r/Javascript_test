looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "looker_table",
  label: "Table",
  options: {
    font_size: {
      type: "number",
      label: "Font Size (px)",
      default: 11
    },
    merge_cell: {
      type: "number",
      label: "Merge Cell",
      default: 0
    }
  },
  // Set up the initial state of the visualization
  create: function(element, config) {
    console.log(config);
    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .table {
          font-size: ${config.font_size}px;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-header {
          font-weight: bold;
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    this._container = element.appendChild(document.createElement("div"));

  },

  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {
    console.log(config);
    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
      return;
    }

    /* Code to generate table
     * In keeping with the spirit of this little visualization plugin,
     * it's done in a quick and dirty way: piece together HTML strings.
     */
    var generatedHTML = `
      <style>
        .table {
          font-size: ${config.font_size}px;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-header {
          font-weight: bold;
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
          border: 1px solid black;
          border-collapse: collapse;
        }
         .table-row {
          border: 1px solid black;
          border-collapse: collapse;
        }
      </style>
    `;
    generatedHTML += "<table class='table'>";

    // First row is the header
    generatedHTML += "<tr class='table-header'>";
    for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
      generatedHTML += `<th class='table-header'>${field.label_short}</th>`;
    }
    generatedHTML += "</tr>";

    // Next rows are the data
    for (row of data) {
      generatedHTML += "<tr class='table-row'>";
      for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
        generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`;
      }
      generatedHTML += "</tr>";
    }
    generatedHTML += "</table>";

    this._container.innerHTML = generatedHTML;
    // Select the table element
    var table = d3.select("#looker_table");

    // Define the row and column numbers to be merged
    var rowNum = 3;
    var colNum = 1;

    // Merge the cells
table.selectAll("tr")
  .filter(function(d, i) { return i === rowNum; })
  .selectAll("td")
  .filter(function(d, i) { return i === colNum; })
  .attr("colspan", 2)
  .next().remove();

    done();
  }
});
