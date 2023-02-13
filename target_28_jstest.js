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
    }
  },
  // Set up the initial state of the visualization
  create: function (element, config) {
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
  updateAsync: function (data, element, config, queryResponse, details, done) {
    console.log(config);
    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
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

    // creates a <table> element and a <tbody> element
    generatedHTML += "</table>";
      const tbl = document.createElement('table')
      const tblBody = document.createElement('tbody')

      // creating all cells
      for (let i = 0; i < 7; i++) {
        // creates a table row
        const row = document.createElement('tr')

        for (let j = 0; j < 35; j++) {
          // Create a <td> element and a text node, make the text
          // node the contents of the <td>, and put the <td> at
          // the end of the table row
          const cell = document.createElement('th')
          if (i == 0) {
            if (j == 0) {
              cell.setAttribute('colspan', 3)
              //j = j + 2
            }
            if (j == 1) {
              cell.setAttribute('colspan', 15)
              //j = j + 14
            }
            if (j == 2) {
              cell.setAttribute('rowspan', 35)
            }
            if (j == 3) {
              cell.setAttribute('rowspan', 35)
            }
            if (j == 4) {
              cell.setAttribute('colspan', 3)
              cell.setAttribute('rowspan', 5)
            }
            if (j == 5) {
              cell.setAttribute('colspan', 8)
              //j = j + 7
            }
            if (j == 6) {
              cell.setAttribute('rowspan', 35)
            }
            if (j == 7) {
              cell.setAttribute('colspan', 3)
              cell.setAttribute('rowspan', 5)
            }
            if (j > 7) {
              break
            }
          }
          if (i == 1) {
            if (j == 0 || j == 1 || j == 2) {
              cell.setAttribute('rowspan', 6)
              // i = i + 3
            }
            if (j == 4) {
              cell.setAttribute('rowspan', 4)
              cell.setAttribute('colspan', 6)
            }
            if (j == 5 || j == 6) {
              cell.setAttribute('rowspan', 6)
            }
            if (j == 3) {
              cell.setAttribute('colspan', 15)
              cell.setAttribute('rowspan', 2)
            }
            if (j > 6) {
              break
            }
          }
          if (i == 2) {
            if (j == 0) {
              cell.setAttribute('colspan', 15)
            }
            if (j >=0) {
              break
            }
          }
          if (i == 3) {
            if (j == 0) {
              cell.setAttribute('rowspan', 4)
            }
            if (j == 1) {
              cell.setAttribute('rowspan', 2)
            }
            if (j == 2) {
              cell.setAttribute('rowspan', 2)
              cell.setAttribute('colspan', 6)
            }
            if (j == 3) {
              cell.setAttribute('rowspan', 2)
              cell.setAttribute('colspan', 6)
            }
            if (j == 4) {
              cell.setAttribute('rowspan', 4)
            }
            if (j > 4) {
              break
            }
          }

          if (i == 4) {
            if (j >= 0) {
              break
            }
          }
          if (i == 5) {
            if (
              j == 0 ||
              j == 1 ||
              j == 2 ||
              j == 3 ||
              j == 5 ||
              j == 6 ||
              j == 7 ||
              j == 9 ||
              j == 10 ||
              j == 11 ||
              j == 12 ||
              j == 13 ||
              j == 14 ||
              j == 16 ||
              j == 17 ||
              j == 18
            ) {
              cell.setAttribute('rowspan', 2)
            }
            if (j == 4 || j == 8 || j == 15) {
              cell.setAttribute('colspan', 3)
            }
            if (j > 18) {
              break
            }
          }

          if (i == 6) {
            if (j > 8) {
              break
            }
          }

          const cellText = document.createTextNode(
            `cell in row ${i}, column ${j}`
          )
          cell.appendChild(cellText)
          row.appendChild(cell)
        }

        // add the row to the end of the table body
        tblBody.appendChild(row)
      }

      // put the <tbody> in the <table>
      tbl.appendChild(tblBody)
      // appends <table> into <body>
      document.body.appendChild(tbl)
      // sets the border attribute of tbl to '2'
      tbl.setAttribute('border', '1')


    // First row is the header
    generatedHTML += "<tbody class='table-content'>";
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

    done();
  }
});

