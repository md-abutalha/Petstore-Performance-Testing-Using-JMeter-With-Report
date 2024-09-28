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

    var data = {"OkPercent": 99.71428571428571, "KoPercent": 0.2857142857142857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8574285714285714, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.495, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.985, 500, 1500, "add to cart"], "isController": true}, {"data": [0.985, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.745, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.995, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.495, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.985, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.985, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [1.0, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.9825, 500, 1500, "continue"], "isController": true}, {"data": [0.49, 500, 1500, "cat"], "isController": true}, {"data": [1.0, 500, 1500, "Fish"], "isController": true}, {"data": [1.0, 500, 1500, "EST-14"], "isController": true}, {"data": [0.745, 500, 1500, "checkout"], "isController": true}, {"data": [0.505, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.99, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.715, 500, 1500, "confirm"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.41, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.41, 500, 1500, "Sign in"], "isController": true}, {"data": [0.9825, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.97, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 6, 0.2857142857142857, 292.4609523809524, 161, 2903, 178.0, 546.0, 694.0, 1471.359999999986, 3.3924864502475707, 15.381449005678377, 2.593112899121992], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 100, 0, 0.0, 588.0000000000003, 511, 1612, 545.5, 652.1, 785.95, 1609.959999999999, 11.055831951354339, 46.32868642896628, 7.2769831398562745], "isController": false}, {"data": ["add to cart", 100, 0, 0.0, 197.82, 167, 1061, 174.0, 205.0, 266.3499999999994, 1056.1199999999976, 0.3241123373361207, 1.6696596415317548, 0.21364826924011862], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 100, 0, 0.0, 213.56000000000003, 165, 1055, 177.0, 220.8, 465.1999999999973, 1054.7199999999998, 0.32462894911116597, 1.542659591649245, 0.2136717887704354], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 100, 0, 0.0, 176.91000000000005, 161, 197, 174.0, 192.9, 194.0, 196.99, 12.990387113535984, 2.803589406339309, 12.00088497012211], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 100, 0, 0.0, 172.53, 163, 197, 171.0, 179.0, 185.95, 196.91999999999996, 13.031013812874642, 66.08403782251759, 8.793389203805056], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 200, 0, 0.0, 361.24999999999966, 164, 646, 508.5, 548.8, 559.8499999999999, 629.5500000000004, 0.45401199045666796, 2.4944057210050916, 0.28996468921744223], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 100, 0, 0.0, 193.5300000000001, 164, 1009, 172.0, 211.0, 278.2499999999994, 1003.4899999999972, 0.32465951333538956, 1.3947042960570102, 0.21305780562634938], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 100, 0, 0.0, 178.28000000000003, 166, 244, 175.0, 187.0, 194.0, 243.82999999999993, 11.441647597254004, 54.24726473112128, 7.530928203661327], "isController": false}, {"data": ["F1-SW-01", 100, 0, 0.0, 588.0000000000003, 511, 1612, 545.5, 652.1, 785.95, 1609.959999999999, 11.057054400707651, 46.33380901702786, 7.277787759840778], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 100, 0, 0.0, 210.2899999999999, 161, 1645, 174.0, 201.90000000000006, 324.04999999999956, 1641.2799999999982, 0.32452043991990837, 1.359880085640944, 0.2139172821737677], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 100, 0, 0.0, 350.06000000000006, 325, 382, 349.0, 365.0, 372.95, 381.93999999999994, 12.71132579128003, 67.20616975975594, 20.320742500317785], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 100, 0, 0.0, 197.82, 167, 1061, 174.0, 205.0, 266.3499999999994, 1056.1199999999976, 0.3241112868514533, 1.6696542299764048, 0.21364757678196386], "isController": false}, {"data": ["Add to cart", 100, 0, 0.0, 178.28000000000003, 166, 244, 175.0, 187.0, 194.0, 243.82999999999993, 11.437721605856114, 54.22865077776507, 7.528344103854512], "isController": true}, {"data": ["continue", 200, 0, 0.0, 218.97499999999994, 163, 1331, 174.0, 208.70000000000002, 409.9999999999998, 1330.98, 0.4543121033287448, 2.1211583652487587, 0.56655913667071], "isController": true}, {"data": ["cat", 100, 0, 0.0, 777.7500000000001, 668, 1865, 710.0, 963.4000000000003, 1339.5999999999965, 1864.8799999999999, 0.3239611376219309, 2.5752379494555835, 0.42614809802416104], "isController": true}, {"data": ["Fish", 100, 0, 0.0, 190.24999999999991, 164, 492, 176.5, 196.50000000000003, 318.9999999999991, 491.88999999999993, 13.027618551328818, 52.35219759640437, 8.549374674309536], "isController": true}, {"data": ["EST-14", 100, 0, 0.0, 174.61, 164, 203, 172.0, 183.9, 197.95, 202.96999999999997, 0.32451096198029566, 1.2650857033450589, 0.21105888738171574], "isController": true}, {"data": ["checkout", 200, 0, 0.0, 361.24999999999983, 164, 646, 508.5, 548.8, 559.8499999999999, 629.5500000000004, 0.38379539100114946, 2.108625849387175, 0.24511932198706227], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 100, 0, 0.0, 567.4599999999996, 220, 1229, 533.0, 663.8000000000004, 854.1999999999994, 1228.6299999999999, 0.3241985002577378, 1.2185937768476884, 0.21275526579414045], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 100, 0, 0.0, 172.67999999999998, 161, 227, 169.0, 190.10000000000005, 202.0, 226.8099999999999, 0.3247069519758418, 1.6466828140727992, 0.20357603825047893], "isController": false}, {"data": ["Login", 100, 0, 0.0, 350.06000000000006, 325, 382, 349.0, 365.0, 372.95, 381.93999999999994, 12.708095056551024, 67.18908851188208, 20.31557774177151], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 100, 0, 0.0, 190.24999999999991, 164, 492, 176.5, 196.50000000000003, 318.9999999999991, 491.88999999999993, 13.027618551328818, 52.35219759640437, 8.549374674309536], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 100, 0, 0.0, 185.35999999999999, 164, 571, 176.5, 195.8, 203.95, 570.3999999999996, 0.3246616214250697, 1.362374010999536, 0.21369329378954785], "isController": false}, {"data": ["confirm", 200, 6, 3.0, 571.1550000000004, 168, 1728, 606.5, 929.6, 1176.9999999999998, 1719.7800000000002, 0.45468599385264535, 6.781153166092247, 0.8862824645799612], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 100, 0, 0.0, 174.60999999999993, 164, 203, 172.0, 183.9, 197.95, 202.96999999999997, 0.32450885584667605, 1.265077492714776, 0.21105751757215455], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 100, 0, 0.0, 1032.7100000000003, 671, 2903, 715.0, 2166.3, 2661.949999999999, 2902.99, 9.573958831977022, 43.4265049066539, 5.619091072283389], "isController": false}, {"data": ["Sign in", 100, 0, 0.0, 1032.7100000000003, 671, 2903, 715.0, 2166.3, 2661.949999999999, 2902.99, 9.458053532582994, 42.90077024023456, 5.551064622150761], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 200, 0, 0.0, 218.97499999999994, 163, 1331, 174.0, 208.70000000000002, 409.9999999999998, 1330.98, 0.4547521600727603, 2.123212966120964, 0.5671079183719873], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 200, 6, 3.0, 188.58999999999995, 164, 503, 176.0, 210.0, 231.95, 382.97, 0.4520601511237085, 2.602127098406714, 0.2935742192356115], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 6, 100.0, 0.2857142857142857], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 6, "500", 6, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 200, 6, "500", 6, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
