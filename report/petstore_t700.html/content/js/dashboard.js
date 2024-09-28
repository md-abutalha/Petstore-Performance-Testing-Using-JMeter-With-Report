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

    var data = {"OkPercent": 99.60544217687075, "KoPercent": 0.3945578231292517};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7938367346938775, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5228571428571429, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.9328571428571428, 500, 1500, "add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.7217857142857143, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.9921428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.5228571428571429, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.9971428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.8821428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.9328571428571428, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [1.0, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.9978571428571429, 500, 1500, "continue"], "isController": true}, {"data": [0.49642857142857144, 500, 1500, "cat"], "isController": true}, {"data": [0.9964285714285714, 500, 1500, "Fish"], "isController": true}, {"data": [0.9971428571428571, 500, 1500, "EST-14"], "isController": true}, {"data": [0.7217857142857143, 500, 1500, "checkout"], "isController": true}, {"data": [0.5121428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.6457142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.8821428571428571, 500, 1500, "Login"], "isController": true}, {"data": [0.9964285714285714, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.9928571428571429, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.5292857142857142, 500, 1500, "confirm"], "isController": true}, {"data": [0.9971428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "Sign in"], "isController": true}, {"data": [0.9978571428571429, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.7025, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14700, 58, 0.3945578231292517, 557.5855102040802, 158, 13854, 181.0, 1042.5999999999985, 2401.7999999999956, 6186.959999999999, 45.0149743690248, 204.6648866501127, 34.408069833689574], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 700, 0, 0.0, 539.054285714286, 491, 847, 528.0, 584.0, 611.9499999999999, 667.99, 76.56967840735068, 320.8598535604901, 50.39840160796325], "isController": false}, {"data": ["add to cart", 700, 0, 0.0, 305.92142857142863, 162, 2333, 176.0, 949.4999999999997, 1220.6999999999996, 1577.7600000000002, 51.493305870236874, 266.0252799948507, 33.943341271884655], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 700, 0, 0.0, 238.69142857142847, 160, 428, 177.0, 352.9, 375.0, 404.98, 51.82497964018657, 247.03915099577998, 34.11136355223218], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 700, 0, 0.0, 170.10999999999999, 160, 206, 169.0, 177.0, 181.0, 190.99, 81.33860097606322, 17.55452228096677, 75.14288722983964], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 700, 0, 0.0, 236.65285714285727, 159, 358, 174.0, 339.0, 345.0, 353.99, 79.81755986316989, 404.7779183295325, 53.86126354047891], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1400, 0, 0.0, 420.5485714285722, 160, 2110, 513.0, 570.0, 993.4000000000024, 1512.99, 9.614724263443444, 52.82464717395783, 6.1406539729414185], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 700, 0, 0.0, 275.16571428571376, 160, 1066, 326.0, 346.0, 363.8499999999998, 862.0100000000009, 52.5052505250525, 225.5572236911191, 34.456570657065704], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 700, 0, 0.0, 173.63571428571424, 160, 227, 172.0, 182.0, 186.94999999999993, 210.99, 79.53641631632769, 377.0989269685263, 52.35111777070787], "isController": false}, {"data": ["F1-SW-01", 700, 0, 0.0, 539.0542857142858, 491, 847, 528.0, 584.0, 611.9499999999999, 667.99, 76.5780549174051, 320.8949547368997, 50.40391505305765], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 700, 0, 0.0, 183.47000000000023, 161, 1348, 172.5, 192.0, 220.94999999999993, 291.8000000000002, 51.55018778996981, 216.01743731128948, 33.980836677958614], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 700, 0, 0.0, 407.1157142857146, 320, 540, 351.0, 511.0, 519.9499999999999, 531.0, 78.18608287724784, 413.37837177482413, 124.99083756841283], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 700, 0, 0.0, 305.92142857142863, 162, 2333, 176.0, 949.4999999999997, 1220.6999999999996, 1577.7600000000002, 51.48951820522251, 266.0057121184259, 33.94084452004413], "isController": false}, {"data": ["Add to cart", 700, 0, 0.0, 173.6371428571429, 160, 227, 172.0, 182.0, 186.94999999999993, 210.99, 79.50931394820536, 376.9704289243526, 52.333278907314856], "isController": true}, {"data": ["continue", 1400, 0, 0.0, 180.04428571428588, 161, 4503, 171.0, 180.0, 184.95000000000005, 326.99, 9.64014708110118, 45.00931952611791, 12.021941232974811], "isController": true}, {"data": ["cat", 700, 0, 0.0, 724.1785714285708, 655, 1874, 705.5, 764.0, 800.0, 1322.810000000003, 49.62779156327544, 394.5021712158809, 65.28187034739454], "isController": true}, {"data": ["Fish", 700, 0, 0.0, 187.555714285714, 161, 1224, 171.0, 184.89999999999998, 328.94999999999993, 470.6400000000003, 79.70849464814393, 320.31294480186745, 52.30869961284446], "isController": true}, {"data": ["EST-14", 700, 0, 0.0, 183.47857142857146, 160, 2075, 171.0, 186.89999999999998, 214.94999999999993, 417.8100000000002, 51.497094092547634, 200.75820275141618, 33.493227212535864], "isController": true}, {"data": ["checkout", 1400, 0, 0.0, 420.548571428572, 160, 2110, 513.0, 570.0, 993.4000000000024, 1512.99, 6.189021559898677, 34.00335478124019, 3.952754004075913], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 700, 0, 0.0, 540.7085714285711, 488, 1535, 529.0, 569.9, 598.8999999999999, 734.5600000000004, 50.244042492104505, 188.85675737510766, 32.97265288544358], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 700, 0, 0.0, 1139.135714285714, 158, 8465, 476.0, 2497.5999999999995, 4152.699999999998, 8028.42, 53.475935828877006, 271.1919284759358, 33.5269050802139], "isController": false}, {"data": ["Login", 700, 0, 0.0, 407.1171428571432, 320, 540, 351.0, 511.0, 519.9499999999999, 531.0, 78.17735090462364, 413.3322048805003, 124.97687835045788], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 700, 0, 0.0, 187.55428571428584, 161, 1224, 171.0, 184.89999999999998, 328.94999999999993, 470.6400000000003, 79.699419332802, 320.27647515085965, 52.30274393715132], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 700, 0, 0.0, 255.59142857142862, 160, 1321, 185.0, 343.0, 352.0, 525.95, 51.79047055341817, 217.327785125037, 34.08864956348032], "isController": false}, {"data": ["confirm", 1400, 58, 4.142857142857143, 1942.244285714285, 163, 10729, 843.5, 5539.5, 6284.150000000001, 9654.94, 9.66703953819171, 145.3828004701461, 18.843174724834626], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 700, 0, 0.0, 183.47857142857148, 160, 2075, 171.0, 186.89999999999998, 214.94999999999993, 417.8100000000002, 51.50846210448859, 200.80252023546726, 33.50062086092715], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 700, 0, 0.0, 3695.921428571426, 698, 13854, 3164.5, 6799.599999999999, 7764.549999999999, 10018.600000000002, 50.35608948996475, 228.4160087403784, 29.554697054168766], "isController": false}, {"data": ["Sign in", 700, 0, 0.0, 3695.9242857142835, 698, 13854, 3164.5, 6799.599999999999, 7764.549999999999, 10018.600000000002, 49.715909090909086, 225.5121404474432, 29.178966175426137], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 1400, 0, 0.0, 180.04428571428593, 161, 4503, 171.0, 180.0, 184.95000000000005, 326.99, 9.668508287292818, 45.1417364468232, 12.057309651243093], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1400, 58, 4.142857142857143, 987.9514285714265, 163, 8333, 187.0, 2757.5000000000005, 4383.250000000001, 7816.82, 9.499446996478419, 55.79864241664235, 6.169074465486473], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 58, 100.0, 0.3945578231292517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14700, 58, "500", 58, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1400, 58, "500", 58, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
