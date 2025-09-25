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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8235714285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99, 500, 1500, "POST To Create/Register User Account"], "isController": false}, {"data": [0.78, 500, 1500, "POST To Verify Login without email parameter"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Search Product without search_product parameter"], "isController": false}, {"data": [0.92, 500, 1500, "DELETE To Verify Login"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Verify Login with invalid details"], "isController": false}, {"data": [0.47, 500, 1500, "POST To Verify Login with valid details"], "isController": false}, {"data": [0.43, 500, 1500, "Get All Products List"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Search Product"], "isController": false}, {"data": [0.28, 500, 1500, "PUT METHOD To Update User Account"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Brands List"], "isController": false}, {"data": [0.8, 500, 1500, "GET user account detail by email"], "isController": false}, {"data": [0.86, 500, 1500, "POST To All Products List"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE METHOD To Delete User Account"], "isController": false}, {"data": [1.0, 500, 1500, "POST To All Brands List"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 700, 0, 0.0, 473.2999999999998, 87, 4327, 137.0, 1551.9999999999998, 1968.7999999999997, 3083.0, 17.900524229638155, 26.417982235327965, 13.95579109928398], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST To Create/Register User Account", 50, 0, 0.0, 176.3, 109, 633, 141.5, 309.6, 400.69999999999953, 633.0, 6.987143655673561, 5.639116213666854, 22.439239143725548], "isController": false}, {"data": ["POST To Verify Login without email parameter", 50, 0, 0.0, 526.8399999999999, 94, 2274, 134.0, 1817.8999999999999, 2022.0999999999997, 2274.0, 4.416570974295557, 3.877783819892236, 2.067162242734741], "isController": false}, {"data": ["POST To Search Product without search_product parameter", 50, 0, 0.0, 110.10000000000002, 87, 254, 101.0, 125.0, 188.3999999999997, 254.0, 8.107669855683477, 7.092944300308091, 1.5360233906275338], "isController": false}, {"data": ["DELETE To Verify Login", 50, 0, 0.0, 251.71999999999997, 89, 1989, 107.0, 196.79999999999995, 1828.4999999999993, 1989.0, 4.798925040790863, 4.072525254343027, 1.4074347346194451], "isController": false}, {"data": ["POST To Verify Login with invalid details", 50, 0, 0.0, 124.24, 91, 357, 118.0, 158.1, 181.59999999999997, 357.0, 5.696707303178763, 4.7035664948159965, 3.8244710963313207], "isController": false}, {"data": ["POST To Verify Login with valid details", 50, 0, 0.0, 1086.2600000000002, 95, 3147, 1074.5, 2164.7, 2231.9999999999995, 3147.0, 4.161464835622139, 3.421016697877653, 2.7762334841864336], "isController": false}, {"data": ["Get All Products List", 50, 0, 0.0, 1239.6600000000005, 322, 2265, 1231.5, 1600.7, 1924.4499999999996, 2265.0, 8.640055296353896, 53.535942630032835, 1.4596968420597891], "isController": false}, {"data": ["POST To Search Product", 50, 0, 0.0, 203.27999999999997, 132, 436, 167.5, 306.7, 391.4, 436.0, 8.503401360544219, 25.891196322278912, 3.9517564838435373], "isController": false}, {"data": ["PUT METHOD To Update User Account", 50, 0, 0.0, 1727.82, 297, 4327, 1793.0, 3200.8999999999996, 3725.1999999999975, 4327.0, 4.324885390537151, 3.4840668519159244, 14.143642283323242], "isController": false}, {"data": ["Get All Brands List", 50, 0, 0.0, 111.71999999999996, 92, 276, 105.0, 129.8, 155.14999999999998, 276.0, 7.913896802785692, 14.813516441120608, 1.3215589387464388], "isController": false}, {"data": ["GET user account detail by email", 50, 0, 0.0, 459.1200000000001, 88, 1912, 220.0, 1225.8999999999999, 1713.1499999999996, 1912.0, 4.847779716889665, 5.719149184361062, 1.086489692408377], "isController": false}, {"data": ["POST To All Products List", 50, 0, 0.0, 339.0799999999999, 96, 834, 282.5, 758.5, 816.9499999999999, 834.0, 8.821453775582217, 7.482384659491884, 1.6626372838743824], "isController": false}, {"data": ["DELETE METHOD To Delete User Account", 50, 0, 0.0, 142.72, 99, 301, 128.0, 210.09999999999997, 220.79999999999998, 301.0, 5.149330587023687, 4.176388710092688, 3.8310214984552005], "isController": false}, {"data": ["POST To All Brands List", 50, 0, 0.0, 127.33999999999999, 87, 314, 113.0, 199.99999999999994, 276.2999999999998, 314.0, 8.994423457456376, 7.624881948192121, 1.6776707816153984], "isController": false}]}, function(index, item){
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
