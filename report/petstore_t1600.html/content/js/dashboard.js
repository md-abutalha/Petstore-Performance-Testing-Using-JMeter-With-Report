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

    var data = {"OkPercent": 99.875, "KoPercent": 0.125};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6378839285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2228125, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.7209375, 500, 1500, "add to cart"], "isController": true}, {"data": [0.9215625, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.9959375, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.98875, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.4546875, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.905, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.7109375, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.2228125, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.81625, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.7915625, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.7209375, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.7109375, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.59546875, 500, 1500, "continue"], "isController": true}, {"data": [0.481875, 500, 1500, "cat"], "isController": true}, {"data": [0.9965625, 500, 1500, "Fish"], "isController": true}, {"data": [0.825625, 500, 1500, "EST-14"], "isController": true}, {"data": [0.4546875, 500, 1500, "checkout"], "isController": true}, {"data": [0.6678125, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.696875, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.7915625, 500, 1500, "Login"], "isController": true}, {"data": [0.9965625, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.90125, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.429375, 500, 1500, "confirm"], "isController": true}, {"data": [0.825625, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.0025, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.0025, 500, 1500, "Sign in"], "isController": true}, {"data": [0.59546875, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.6746875, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 33600, 42, 0.125, 1736.296517857133, 156, 83611, 344.0, 2169.600000000006, 5659.650000000005, 30529.550000000072, 81.69219547775347, 369.17187594973257, 62.44301604668125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 1600, 0, 0.0, 1892.7481250000012, 166, 13941, 1752.0, 3541.9, 4366.349999999994, 7230.080000000001, 50.66818671226803, 212.321473810881, 33.349958832098295], "isController": false}, {"data": ["add to cart", 1600, 0, 0.0, 1183.2549999999976, 162, 34827, 328.0, 2529.5000000000005, 4976.249999999979, 14359.750000000002, 16.99000775169104, 87.54039274792137, 11.199468000382275], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 1600, 0, 0.0, 311.6406250000002, 161, 1200, 330.0, 520.0, 536.0, 733.96, 16.98802344347235, 80.7283233484456, 11.181570118066762], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 1600, 0, 0.0, 177.04812500000003, 158, 1056, 168.0, 181.0, 210.0, 419.99, 51.4287551026968, 11.099369997749992, 47.51133039760856], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 1600, 0, 0.0, 314.85437500000035, 156, 1858, 330.0, 369.0, 409.0, 888.7700000000002, 51.20983228779926, 259.69986237357574, 34.55663487389579], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 3200, 0, 0.0, 3887.182187499996, 161, 83611, 682.0, 7502.400000000002, 24037.1, 45164.73999999999, 14.024077588209257, 77.0502544055325, 8.956783928407084], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 1600, 0, 0.0, 515.9162500000007, 161, 15810, 336.0, 706.0, 1229.9499999999998, 4159.490000000001, 17.02109552026042, 73.120897650025, 11.170093935170902], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 1600, 0, 0.0, 920.626875000001, 162, 16365, 354.0, 2050.8, 3173.2999999999975, 5699.83, 51.22950819672131, 242.93993340163934, 33.71942238729508], "isController": false}, {"data": ["F1-SW-01", 1600, 0, 0.0, 1892.7481250000003, 166, 13941, 1752.0, 3541.9, 4366.349999999994, 7230.080000000001, 50.66979130379707, 212.32819773886055, 33.35101497925705], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 1600, 0, 0.0, 819.5300000000002, 160, 45430, 173.0, 1949.000000000001, 3854.6499999999915, 11201.080000000002, 16.990909863223177, 71.19921310848696, 11.20006265398012], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 1600, 0, 0.0, 492.1456249999999, 316, 2075, 497.0, 557.9000000000001, 616.8999999999996, 1168.94, 50.89058524173028, 269.0640903307888, 81.35535941475827], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 1600, 0, 0.0, 1183.2549999999978, 162, 34827, 328.0, 2529.5000000000005, 4976.249999999979, 14359.750000000002, 16.99000775169104, 87.54039274792137, 11.199468000382275], "isController": false}, {"data": ["Add to cart", 1600, 0, 0.0, 920.6268750000012, 162, 16365, 354.0, 2050.8, 3173.2999999999975, 5699.83, 51.231148538311295, 242.94771220902308, 33.72050206525567], "isController": true}, {"data": ["continue", 3200, 0, 0.0, 2512.728437500002, 161, 62055, 698.0, 4817.800000000001, 16107.14999999995, 32158.759999999995, 14.043711050645133, 65.56931888001404, 17.513495128587728], "isController": true}, {"data": ["cat", 1600, 0, 0.0, 1308.1593749999988, 321, 45597, 697.5, 2712.100000000001, 4396.449999999998, 11874.660000000002, 16.894388951069626, 134.2971934196355, 22.22338077840897], "isController": true}, {"data": ["Fish", 1600, 0, 0.0, 211.41562500000003, 160, 883, 170.0, 335.0, 345.0, 447.8900000000001, 50.66337354738609, 203.59353725341185, 33.24783889047212], "isController": true}, {"data": ["EST-14", 1600, 0, 0.0, 660.1431249999998, 160, 30530, 179.0, 1387.2000000000025, 2371.499999999998, 8070.6700000000055, 16.990549007114794, 66.28637039396835, 11.050493787830518], "isController": true}, {"data": ["checkout", 3200, 0, 0.0, 3887.1821874999946, 161, 83611, 682.0, 7502.400000000002, 24037.1, 45164.73999999999, 10.363197694188512, 56.93686545654743, 6.618682902343053], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 1600, 0, 0.0, 488.6293749999991, 160, 4393, 512.5, 646.0, 973.7499999999991, 2105.3400000000006, 16.92602270202795, 63.62134900400935, 11.107702398205841], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 1600, 0, 0.0, 1598.1674999999987, 158, 30409, 442.0, 2547.4000000000015, 7877.199999999993, 28167.08, 16.94663926959985, 85.94130637405469, 10.624748448323341], "isController": false}, {"data": ["Login", 1600, 0, 0.0, 492.1456249999999, 316, 2075, 497.0, 557.9000000000001, 616.8999999999996, 1168.94, 50.88896663592125, 269.05553258484144, 81.35277185840145], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 1600, 0, 0.0, 211.41437500000035, 160, 883, 170.0, 335.0, 345.0, 447.8900000000001, 50.66337354738609, 203.59353725341185, 33.24783889047212], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 1600, 0, 0.0, 356.0074999999995, 160, 1614, 335.0, 523.0, 536.0, 777.9300000000001, 17.177150096084684, 72.08028707312097, 11.306053871836989], "isController": false}, {"data": ["confirm", 3200, 42, 1.3125, 3012.8159375000046, 162, 34018, 1383.5, 7025.200000000001, 12004.599999999991, 31308.369999999988, 14.068098388763106, 207.57175211021476, 27.421801156221836], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 1600, 0, 0.0, 660.1431249999999, 160, 30530, 179.0, 1387.2000000000025, 2371.499999999998, 8070.6700000000055, 16.990549007114794, 66.28637039396835, 11.050493787830518], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 1600, 0, 0.0, 10476.37937499999, 900, 36587, 9974.5, 15936.2, 20489.649999999994, 23354.66, 41.55844155844156, 188.51182021103895, 24.391233766233768], "isController": false}, {"data": ["Sign in", 1600, 0, 0.0, 10476.379999999977, 900, 36587, 9974.5, 15936.2, 20489.649999999994, 23354.66, 41.390728476821195, 187.7510626584489, 24.292800600165563], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 3200, 0, 0.0, 2512.7284375000017, 161, 62055, 698.0, 4817.800000000001, 16107.14999999995, 32158.759999999995, 14.070510847484456, 65.69444566584296, 17.54691635960708], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 3200, 42, 1.3125, 1621.9496875000004, 162, 32754, 445.0, 2985.7000000000003, 7544.849999999996, 19170.78999999997, 13.91189423482408, 77.8650010977354, 9.034579752107435], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 42, 100.0, 0.125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 33600, 42, "500", 42, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 3200, 42, "500", 42, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
