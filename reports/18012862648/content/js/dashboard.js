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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.805, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99, 500, 1500, "POST To Create/Register User Account"], "isController": false}, {"data": [0.81, 500, 1500, "POST To Verify Login without email parameter"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Search Product without search_product parameter"], "isController": false}, {"data": [0.94, 500, 1500, "DELETE To Verify Login"], "isController": false}, {"data": [0.99, 500, 1500, "POST To Verify Login with invalid details"], "isController": false}, {"data": [0.52, 500, 1500, "POST To Verify Login with valid details"], "isController": false}, {"data": [0.09, 500, 1500, "Get All Products List"], "isController": false}, {"data": [1.0, 500, 1500, "POST To Search Product"], "isController": false}, {"data": [0.27, 500, 1500, "PUT METHOD To Update User Account"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Brands List"], "isController": false}, {"data": [0.78, 500, 1500, "GET user account detail by email"], "isController": false}, {"data": [0.88, 500, 1500, "POST To All Products List"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE METHOD To Delete User Account"], "isController": false}, {"data": [1.0, 500, 1500, "POST To All Brands List"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 700, 0, 0.0, 532.3314285714284, 79, 4999, 133.0, 1884.9, 2377.6499999999955, 3460.540000000004, 17.807173747138133, 26.279716714894427, 13.865026194034597], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST To Create/Register User Account", 50, 0, 0.0, 183.62000000000003, 109, 1188, 141.5, 249.69999999999993, 478.9999999999999, 1188.0, 5.324813631522897, 4.297499001597444, 17.01964357028754], "isController": false}, {"data": ["POST To Verify Login without email parameter", 50, 0, 0.0, 486.43999999999994, 84, 2463, 101.0, 1821.1999999999998, 2216.3499999999995, 2463.0, 4.058441558441558, 3.56350192775974, 1.9031078784496753], "isController": false}, {"data": ["POST To Search Product without search_product parameter", 50, 0, 0.0, 120.10000000000002, 90, 290, 108.5, 157.5, 221.54999999999959, 290.0, 6.244536030972899, 5.45713906581741, 1.1830468652429125], "isController": false}, {"data": ["DELETE To Verify Login", 50, 0, 0.0, 208.9799999999999, 79, 2386, 94.5, 376.6999999999997, 1264.3999999999965, 2386.0, 4.384426517011574, 3.7132324732549984, 1.2892954226587163], "isController": false}, {"data": ["POST To Verify Login with invalid details", 50, 0, 0.0, 115.41999999999999, 88, 546, 99.0, 129.79999999999998, 219.3499999999999, 546.0, 5.248792777661138, 4.330869134474071, 3.50982262360907], "isController": false}, {"data": ["POST To Verify Login with valid details", 50, 0, 0.0, 1069.6000000000004, 93, 2565, 1066.0, 2116.2999999999997, 2383.449999999999, 2565.0, 3.828190797029324, 3.15137862721078, 2.54941057824822], "isController": false}, {"data": ["Get All Products List", 50, 0, 0.0, 1884.54, 741, 2897, 1863.5, 2575.5, 2634.5, 2897.0, 8.739730816290859, 54.16140917234749, 1.476536553924139], "isController": false}, {"data": ["POST To Search Product", 50, 0, 0.0, 226.25999999999996, 145, 456, 198.0, 373.3, 416.7999999999999, 456.0, 6.1304561059342815, 18.661012598087297, 2.853655476029916], "isController": false}, {"data": ["PUT METHOD To Update User Account", 50, 0, 0.0, 1928.2599999999998, 244, 4999, 1973.0, 3673.6, 4447.199999999996, 4999.0, 4.265483705852243, 3.439546099215151, 13.963627420662004], "isController": false}, {"data": ["Get All Brands List", 50, 0, 0.0, 113.34, 86, 263, 96.5, 194.59999999999997, 254.79999999999998, 263.0, 9.304056568663936, 17.41639432917752, 1.5537047590249349], "isController": false}, {"data": ["GET user account detail by email", 50, 0, 0.0, 561.4999999999999, 92, 2286, 289.0, 1660.9999999999998, 2090.399999999999, 2286.0, 4.4903457566232605, 5.299046503143242, 1.0063812022900764], "isController": false}, {"data": ["POST To All Products List", 50, 0, 0.0, 286.85999999999996, 83, 1082, 100.5, 820.9999999999999, 1018.0499999999998, 1082.0, 9.723842862699339, 8.237918125243095, 1.8327164770517308], "isController": false}, {"data": ["DELETE METHOD To Delete User Account", 50, 0, 0.0, 117.69999999999999, 97, 223, 114.5, 133.8, 149.29999999999995, 223.0, 5.35503909178537, 4.346158094141587, 3.9794634250830034], "isController": false}, {"data": ["POST To All Brands List", 50, 0, 0.0, 150.02000000000004, 80, 329, 138.5, 206.5, 249.1499999999998, 329.0, 7.271669575334497, 6.170409304101221, 1.3563368055555556], "isController": false}]}, function(index, item){
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
