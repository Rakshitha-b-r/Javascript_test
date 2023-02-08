// This codebase is a simple modification of the looker example visualization.


looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "looker_table",
  label: "Test-Table",
  options: {
    font_size: {
      type: "number",
      label: "Font Size (px)",
      default: 11
    }
  },
  // Set up the initial state of the visualization
  create: function(element, config) {
    console.log(config);
    // Insert a <style> tag with some styles we'll use later.
    // Let's just use bootstrap. Can't figure out how to get looker styles into this.
    element.innerHTML = `

      <style>
        .test-table
            font-size: ${config.font_size}px;
            font-family: "Open Sans","Noto Sans JP","Noto Sans","Noto Sans CJK KR",Helvetica,Arial,sans-serif;
        }
        .test-table-cell {
            border-bottom-color: rgba(0, 0, 0, 0.1);
            border-bottom-style: solid;
            border-bottom-width: 1px;
            }
        .test-table-header {
            border-right-color: rgba(0, 0, 0, 0.1);
            border-right-style: solid;
            border-width: 1px;
            padding-bottom: 5px;
            padding-right: 10px;
            text-align: right;
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
        .test-table, .test-table-cell, .test-table-header{
            font-size: ${config.font_size}px;
            font-family: "Open Sans","Noto Sans JP","Noto Sans","Noto Sans CJK KR",Helvetica,Arial,sans-serif;
        }
        .test-table-cell, .test-table-header {
            border-bottom-color: rgba(0, 0, 0, 0.1);
            border-bottom-style: solid;
            border-bottom-width: 1px;
            }
        .test-table-header {
            border-right-color: rgba(0, 0, 0, 0.1);
            border-right-style: solid;
            border-width: 1px;
            padding-bottom: 5px;
            padding-right: 10px;
            text-align: right;
        }

      </style>
    `
    generatedHTML += "<table class='test-table'>"

    // Loop through the different types of column types looker exposes
    for (row_type of ["dimension_like", "measure_like", "table_calculations"])
    {

        // Look through each field (i.e. row of data)
        generatedHTML += '<tr>';
        for (field of queryResponse.fields[row_type])
        {

            // First column is the label
            generatedHTML += `<th class='test-table-header'>${field.label_short}</th>`;
          for(col of data)
            {
                generatedHTML += '<tr>';
                generatedHTML += `<td class='test-table-cell'>${LookerCharts.Utils.htmlForCell(col[field.name])}</td>`
                 generatedHTML += '</tr>';
            }
        }
            generatedHTML += '</tr>';
      // Next columns are the data
      for (field of queryResponse.fields[row_type]){
            
      }
    }
    generatedHTML += '</table>';

    // Insert the data into the page
    this._container.innerHTML = generatedHTML

    // We are done rendering! Let Looker know.
    done()
  }
});
