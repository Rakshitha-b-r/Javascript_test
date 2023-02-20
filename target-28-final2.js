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
        element.innerHTML = `
      <style>
      .table {
        font-size: ${config.font_size}px;
        border: 1px solid black;
        border-collapse: collapse;
        margin: auto;
      }
      .table-header {
        background-color: #eee;
        border: 1px solid black;
        border-collapse: collapse;
        font-weight: normal;
        font-family: 'Verdana';
        font-size: 11px;
        align-items: center;
        text-align: center;
        margin: auto;
        width: 90px;
      }
      .table-cell {
        padding: 5px;
        border-bottom: 1px solid #ccc;
        border: 1px solid black;
        border-collapse: collapse;
        font-family: 'Verdana';
        font-size: 11px;
        align-items: center;
        text-align: center;
        margin: auto;
        width: 90px;
      }
       .table-row {
        border: 1px solid black;
        border-collapse: collapse;
      }
      th:before {
        content: '';
        top: 0;
        left: 0;
        border-top: 1px solid black;
        position: absolute;
        width: 100%;
    }
    tr:before {
        top: 177.5px;
        content: '';
        border-top: 1px solid black;
        position: absolute;
        width: 100%;
    }
    tr:after {
        bottom: 0;
        content: '';
        border-top: 1px solid black;
        position: absolute;
        width: 100%;
        left: 0;
    }
    th:not(:nth-child(19)):after {
        content: '';
        top: 27px;
        left: 0;
        width: 100%;
        position: absolute;
        border: 1px solid black;
    }
      </style>
    `;
        // Create a container element to let us center the text.
        this._container = element.appendChild(document.createElement("div"));
        var table = generateTableHeader();
        element.appendChild(table);
    },

    updateAsync: function (data, element, config, queryResponse, details, done) {
        console.log(config);
        // Clear any errors from previous updates
        this.clearErrors();

        // Throw some errors and exit if the shape of the data isn't what this chart needs
        if (queryResponse.fields.dimensions.length == 0) {
            this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
            return;
        }

        // Create a new table
        var table = document.createElement('table');
        table.id = "data_table";
        table.classList.add('table');

        // Create the table body
        var tableBody = document.createElement('tbody');

        // Loop through the data
        for (row of data) {
            var tableRow = document.createElement('tr');
            tableRow.classList.add('table-row');
            for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
                var tableCell = document.createElement('td');
                tableCell.classList.add('table-cell');
                tableCell.style.border = "1px solid black";
                tableCell.style.borderCollapse = "collapse";
                tableCell.innerHTML = LookerCharts.Utils.htmlForCell(row[field.name]);
                tableRow.appendChild(tableCell);
            }
            tableBody.appendChild(tableRow);
        }
        let table_data = document.getElementById("table");
        table_data.appendChild(tableBody);

        done();
    }
});

function generateTableHeader() {
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement('table')
    tbl.classList.add('table');
    tbl.id = "table";
    tbl.style.position = "absolute";
    tbl.style.top = "0px";
    const tblBody = document.createElement('tbody');
    tblBody.style.position = "sticky";
    tblBody.style.top = "0px";
    tblBody.style.zIndex = "1";

    let k=0;

    // creating all cells
    for (let i = 0; i < 7; i++) {
        // creates a table row
        const row = document.createElement('tr')
        row.classList.add('table-row');

        for (let j = 0; j < 35; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            const cell = document.createElement('th')
            cell.classList.add('table-header');
            cell.style.border = "1px solid black";
            cell.style.borderCollapse = "collapse";
            cell.style.backgroundColor = "#eee";
            if (i == 0) {
                if (j == 0) {
                    cell.setAttribute('colspan', 3)
                    cell.setAttribute('height','25px')
                    cell.style.fontWeight='bold'
                    //j = j + 2
                }
                if (j == 1) {
                    cell.setAttribute('colspan', 15)
                    cell.style.fontWeight='bold'
                    //j = j + 14
                }
                if (j == 2) {
                    cell.setAttribute('rowspan', 7)
                }
                if (j == 3) {
                    cell.setAttribute('rowspan', 7)
                }
                if (j == 4) {
                    cell.setAttribute('colspan', 3)
                    cell.setAttribute('rowspan', 5)
                    cell.style.fontWeight='bold'
                }
                if (j == 5) {
                    cell.setAttribute('colspan', 8)
                    cell.style.fontWeight='bold'
                    //j = j + 7
                }
                if (j == 6) {
                    cell.setAttribute('rowspan', 7)
                }
                if (j == 7) {
                    cell.setAttribute('colspan', 3)
                    cell.setAttribute('rowspan', 5)
                    cell.style.fontWeight='bold'
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
                if (j == 3) {
                    cell.setAttribute('rowspan', 6)
                    cell.style.fontWeight='bold'
                    // i = i + 3
                }
                if (j == 5) {
                    cell.setAttribute('rowspan', 4)
                    cell.setAttribute('colspan', 6)
                }
                if (j == 6 || j == 7) {
                    cell.setAttribute('rowspan', 6)
                }
                if (j == 4) {
                    cell.setAttribute('colspan', 14)
                    cell.setAttribute('rowspan', 2)
                    cell.setAttribute('height','25px')
                }
                if (j > 7) {
                    break
                }
            }
            if (i == 2) {
                if (j == 0) {
                    cell.setAttribute('colspan', 14)
                }
                if (j >= 0) {
                    break
                }
            }
            if (i == 3) {
                if (j == 0) {
                    cell.setAttribute('rowspan', 2)
                }
                if (j == 1) {
                    cell.setAttribute('rowspan', 2)
                    cell.setAttribute('colspan', 6)
                    cell.setAttribute('height','25px')
                }
                if (j == 2) {
                    cell.setAttribute('rowspan', 2)
                    cell.setAttribute('colspan', 6)
                }
                if (j == 3) {
                    cell.setAttribute('rowspan', 4)
                }
                if (j > 3) {
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
                    j == 1 ||
                    j == 2 ||
                    j == 3 ||
                    j == 5 ||
                    j == 6 ||
                    j == 7 ||
                    j == 11 ||
                    j == 12 ||
                    j == 13 ||
                    j == 14 ||
                    j == 18
                ) {
                    cell.setAttribute('rowspan', 2)
                }
                if(j==9 || j==16)
                {
                    cell.setAttribute('rowspan', 2)
                    cell.style.fontWeight='bold'
                }
                if(j==0 || j==10 || j==17)
                {
                    cell.setAttribute('rowspan', 2)
                    cell.style.fontStyle='italic'
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
            const headers = ['COUNTERPARTY','ORIGINAL EXPOSURES','(-) Value adjustments and provisions','(-) Exposures deducted from CET 1 or Additional Tier 1 items',
            'Exposure value before application of exemptions and CRM','ELIGIBLE CREDIT RISK MITIGATION (CRM) TECHNIQUES','(-) Amounts exempted','Exposure value after application of exemptions and CRM',
            'Code','Group or individual','Transactions where there is an exposure to underlying assets','Total original exposure','',
            '(-) Substitution effect of eligible credit risk mitigation techniques','(-) Funded credit protection other than substitution effect',
            '(-) Real estate','','Direct exposures','Indirect exposures','Additional exposures arising from transactions where there is an exposure to underlying assets',
            'Of which: defaulted','Debt instruments','Equity instruments','Derivatives','Off balance sheet items','Debt instruments','Equity instruments',
            'Derivatives','Off balance sheet items','Total','Of which: Non-trading book','% of Tier 1 capital','(-) Debt instruments','(-) Equity instruments',
            '(-) Derivatives','(-) Off balance sheet items','Total','Of which: Non-trading book','% of Tier 1 capital','Loan commit-ments','Financial guarantees',
            'Other commit-ments','Loan commit-ments','Financial guarantees','Other commit-ments','(-) Loan commit-ments','(-) Financial guarantees','(-) Other commit-ments']
            const cellText = document.createTextNode(
                `${headers[k]}`
            )
            k++;
            cell.appendChild(cellText)
            row.appendChild(cell)
        }
        // add the row to the end of the table body
        tblBody.appendChild(row)
    }

    const next_row = document.createElement('tr')
    const header = ['010', '020', '030', '040', '050', '060', '070', '080', '090', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190', '200', '210', '220', '230', '240', '250', '260', '270', '280', '290', '300', '310', '320', '330', '340', '350',];
    for (let i = 0; i < header.length; i++) {
        const next_cell = document.createElement('th')
        next_cell.classList.add('table-header');
        next_cell.style.border = "1px solid black";
        next_cell.style.borderCollapse = "collapse";
        next_cell.style.backgroundColor = "#eee";
        const cell_data = document.createTextNode(
            `${header[i]}`
        )
        next_cell.appendChild(cell_data)
        next_row.appendChild(next_cell)
    }
    tblBody.appendChild(next_row)
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody)
    // appends <table> into <body>
    document.body.appendChild(tbl)
    tbl.style.border = "1px solid black";
    tbl.style.borderCollapse = "collapse";
}