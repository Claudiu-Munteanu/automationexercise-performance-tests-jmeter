/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8121428571428572, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99, 500, 1500, "POST To Create/Register User Account"], "isController": false}, {"data": [0.84, 500, 1500, "POST To Verify Login without email parameter"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Search Product without search_product parameter"], "isController": false}, {"data": [0.98, 500, 1500, "DELETE To Verify Login"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Verify Login with invalid details"], "isController": false}, {"data": [0.49, 500, 1500, "POST To Verify Login with valid details"], "isController": false}, {"data": [0.0, 500, 1500, "Get All Products List"], "isController": false}, {"data": [0.99, 500, 1500, "POST To Search Product"], "isController": false}, {"data": [0.38, 500, 1500, "PUT METHOD To Update User Account"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Brands List"], "isController": false}, {"data": [0.88, 500, 1500, "GET user account detail by email"], "isController": false}, {"data": [0.82, 500, 1500, "POST To All Products List"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE METHOD To Delete User Account"], "isController": false}, {"data": [1.0, 500, 1500, "POST To All Brands List"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 700, 0, 0.0, 846.1971428571436, 68, 7252, 99.0, 4147.9, 4910.799999999997, 6607.010000000001, 15.688032272523532, 23.141357750168087, 12.229683472938145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST To Create/Register User Account", 50, 0, 0.0, 158.42000000000004, 91, 617, 124.5, 283.59999999999997, 349.5499999999997, 617.0, 7.407407407407407, 5.964988425925926, 23.76417824074074], "isController": false}, {"data": ["POST To Verify Login without email parameter", 50, 0, 0.0, 706.0399999999998, 70, 4537, 82.5, 3870.7999999999997, 4434.4, 4537.0, 3.7630766915029725, 3.300923835327764, 1.7626192424926619], "isController": false}, {"data": ["POST To Search Product without search_product parameter", 50, 0, 0.0, 87.83999999999999, 68, 207, 80.5, 114.49999999999997, 143.99999999999974, 207.0, 7.687576875768758, 6.714617927429274, 1.456435462792128], "isController": false}, {"data": ["DELETE To Verify Login", 50, 0, 0.0, 141.88000000000002, 68, 2060, 79.0, 209.09999999999997, 354.3999999999997, 2060.0, 4.849190185239065, 4.10400603724178, 1.4250178813888081], "isController": false}, {"data": ["POST To Verify Login with invalid details", 50, 0, 0.0, 85.11999999999999, 73, 118, 83.0, 98.9, 105.49999999999996, 118.0, 5.254308532997058, 4.336446511139134, 3.505301104718369], "isController": false}, {"data": ["POST To Verify Login with valid details", 50, 0, 0.0, 1945.2800000000004, 73, 5354, 1124.0, 4570.1, 4812.099999999999, 5354.0, 3.9453957231910355, 3.2455503333859386, 2.64688276749783], "isController": false}, {"data": ["Get All Products List", 50, 0, 0.0, 4842.460000000002, 2105, 7252, 4775.5, 6927.599999999999, 7170.0, 7252.0, 5.915759583530526, 36.655525319451016, 0.9994398515144345], "isController": false}, {"data": ["POST To Search Product", 50, 0, 0.0, 145.07999999999998, 92, 633, 117.0, 198.6, 338.1999999999996, 633.0, 9.423294383716547, 28.683624670184695, 4.396923883339616], "isController": false}, {"data": ["PUT METHOD To Update User Account", 50, 0, 0.0, 2585.1600000000003, 192, 6346, 2373.0, 5405.1, 6166.599999999999, 6346.0, 3.9404208369453855, 3.1684985518953424, 12.884868291433525], "isController": false}, {"data": ["Get All Brands List", 50, 0, 0.0, 80.34, 70, 113, 79.5, 89.0, 95.0, 113.0, 12.963443090484834, 24.26746418848846, 2.1647937192118225], "isController": false}, {"data": ["GET user account detail by email", 50, 0, 0.0, 481.9, 73, 4289, 131.5, 1457.8999999999992, 4003.449999999999, 4289.0, 4.0703353956366, 4.804029250447736, 0.9122480207994138], "isController": false}, {"data": ["POST To All Products List", 50, 0, 0.0, 402.31999999999994, 69, 1795, 90.0, 1347.6999999999998, 1746.35, 1795.0, 10.69747539580659, 9.053574293966623, 2.016223390029953], "isController": false}, {"data": ["DELETE METHOD To Delete User Account", 50, 0, 0.0, 103.59999999999998, 81, 240, 98.0, 122.6, 129.04999999999995, 240.0, 5.006508460999299, 4.059378754881346, 3.7263286021828375], "isController": false}, {"data": ["POST To All Brands List", 50, 0, 0.0, 81.31999999999998, 69, 165, 78.0, 95.5, 103.89999999999999, 165.0, 11.767474699929396, 9.973394475170629, 2.194909831725112], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 700, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
