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

    var data = {"OkPercent": 99.46753246753246, "KoPercent": 0.5324675324675324};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8302316602316603, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5071428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.9971428571428571, 500, 1500, "add to cart"], "isController": true}, {"data": [0.9971428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.99, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.9914285714285714, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.7464285714285714, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.9957142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.9971428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.5071428571428571, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.9485714285714286, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.9971428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.9971428571428571, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.9878571428571429, 500, 1500, "continue"], "isController": true}, {"data": [0.49857142857142855, 500, 1500, "cat"], "isController": true}, {"data": [0.9957142857142857, 500, 1500, "Fish"], "isController": true}, {"data": [1.0, 500, 1500, "EST-14"], "isController": true}, {"data": [0.7464285714285714, 500, 1500, "checkout"], "isController": true}, {"data": [0.5085714285714286, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.97, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.9485714285714286, 500, 1500, "Login"], "isController": true}, {"data": [0.9957142857142857, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.9871428571428571, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.6778571428571428, 500, 1500, "confirm"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.43642857142857144, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.43642857142857144, 500, 1500, "Sign in"], "isController": true}, {"data": [0.9878571428571429, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.925, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7700, 41, 0.5324675324675324, 323.3272727272728, 160, 2814, 176.0, 688.0, 755.9499999999998, 1726.8899999999976, 20.68657951437583, 94.36898911721366, 15.645327670718013], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 350, 0, 0.0, 544.1771428571426, 496, 707, 532.0, 606.7, 642.25, 695.45, 38.08487486398259, 159.59199027475518, 25.06758365070729], "isController": false}, {"data": ["add to cart", 350, 0, 0.0, 188.3857142857143, 163, 1288, 173.0, 187.0, 272.7999999999995, 440.0, 37.82557008537771, 195.71481884253754, 24.93384746838863], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 350, 0, 0.0, 184.7057142857144, 165, 1008, 173.0, 184.90000000000003, 216.6499999999998, 398.47, 37.670864277257564, 179.86807629695403, 24.795080588741794], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 350, 0, 0.0, 192.4028571428571, 161, 749, 172.0, 201.7000000000001, 325.45, 651.1300000000003, 39.624136759877736, 8.551693578059549, 36.60589196762142], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 350, 0, 0.0, 201.43428571428555, 161, 1281, 170.0, 219.90000000000003, 373.45, 1260.43, 39.624136759877736, 200.94545136137214, 26.738553223706553], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 700, 0, 0.0, 383.5285714285714, 162, 1715, 508.5, 594.9, 684.9999999999973, 1121.6900000000003, 4.943782134583875, 27.16183426676648, 3.157454605486185], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 350, 0, 0.0, 183.2542857142857, 163, 1256, 171.0, 180.0, 188.0, 705.2900000000047, 37.670864277257564, 161.8302069879453, 24.72150468195027], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 350, 0, 0.0, 183.63999999999993, 161, 1293, 171.0, 181.0, 211.14999999999992, 417.8800000000001, 39.718565592374034, 188.31409760837496, 26.142883993418067], "isController": false}, {"data": ["F1-SW-01", 350, 0, 0.0, 544.1771428571426, 496, 707, 532.0, 606.7, 642.25, 695.45, 38.08487486398259, 159.59199027475518, 25.06758365070729], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 350, 0, 0.0, 174.07714285714283, 162, 264, 172.0, 183.0, 185.0, 197.9000000000001, 37.73584905660377, 158.1294221698113, 24.874705188679243], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 350, 0, 0.0, 394.9942857142854, 323, 1450, 346.5, 509.2000000000003, 603.5499999999997, 1432.3500000000001, 38.7725711753628, 204.99482455411544, 61.98310450592667], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 350, 0, 0.0, 188.3857142857143, 163, 1288, 173.0, 187.0, 272.7999999999995, 440.0, 37.829658452226546, 195.73597262753998, 24.936542436770427], "isController": false}, {"data": ["Add to cart", 350, 0, 0.0, 183.63999999999993, 161, 1293, 171.0, 181.0, 211.14999999999992, 417.8800000000001, 39.70955298388927, 188.27136693045156, 26.13695186634899], "isController": true}, {"data": ["continue", 700, 0, 0.0, 197.48142857142872, 161, 1915, 173.0, 186.89999999999998, 204.0, 1036.98, 4.957120904178853, 23.144526409061616, 6.181878315074604], "isController": true}, {"data": ["cat", 350, 0, 0.0, 725.4400000000003, 655, 1728, 706.0, 748.8000000000001, 853.3499999999999, 1348.0, 35.69971440228478, 283.7848390962872, 46.96046416003672], "isController": true}, {"data": ["Fish", 350, 0, 0.0, 185.89714285714305, 161, 960, 171.0, 207.0, 215.45, 598.0700000000049, 39.45440198399278, 158.5496720352835, 25.891951301995263], "isController": true}, {"data": ["EST-14", 350, 0, 0.0, 180.7971428571428, 160, 476, 172.0, 187.90000000000003, 195.89999999999998, 437.38000000000056, 37.739918050463665, 147.12671177485444, 24.545688888289845], "isController": true}, {"data": ["checkout", 700, 0, 0.0, 383.5285714285715, 162, 1715, 508.5, 594.9, 684.9999999999973, 1121.6900000000003, 3.1504851747169065, 17.30920858687238, 2.012126273696149], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 350, 0, 0.0, 551.3628571428567, 493, 1541, 529.5, 567.0, 678.9, 1178.49, 36.32589517384536, 136.54137746497148, 23.838868707836014], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 350, 0, 0.0, 232.6514285714287, 161, 1393, 172.0, 220.7000000000001, 840.6499999999992, 1341.0, 37.711453507165174, 191.24568170186402, 23.643313624609416], "isController": false}, {"data": ["Login", 350, 0, 0.0, 394.9942857142854, 323, 1450, 346.5, 509.2000000000003, 603.5499999999997, 1432.3500000000001, 38.75968992248062, 204.92671996124034, 61.962512112403104], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 350, 0, 0.0, 185.89428571428587, 161, 960, 171.0, 207.0, 215.45, 598.0700000000049, 39.45885005636979, 158.56754685738446, 25.894870349492674], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 350, 0, 0.0, 210.39428571428584, 164, 1267, 173.0, 232.00000000000034, 373.5999999999997, 1260.94, 37.66681015927679, 158.06082349063712, 24.792412155617736], "isController": false}, {"data": ["confirm", 700, 41, 5.857142857142857, 646.0285714285724, 164, 3240, 834.0, 1093.3999999999999, 1751.7999999999997, 2182.95, 4.971908715755979, 75.6130138711814, 9.691337692039975], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 350, 0, 0.0, 180.7971428571428, 160, 476, 172.0, 187.90000000000003, 195.89999999999998, 437.38000000000056, 37.73584905660377, 147.11084905660377, 24.54304245283019], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 700, 0, 0.0, 930.9800000000001, 659, 2814, 723.0, 1780.7999999999997, 2273.199999999999, 2606.99, 11.055133530219996, 50.14684449967624, 6.488413331701385], "isController": false}, {"data": ["Sign in", 700, 0, 0.0, 930.9800000000001, 659, 2814, 723.0, 1780.7999999999997, 2273.199999999999, 2606.99, 11.030918087553973, 50.03700158963409, 6.474200947871033], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 700, 0, 0.0, 197.4814285714287, 161, 1915, 173.0, 186.89999999999998, 204.0, 1036.98, 4.972120609439926, 23.214559212629187, 6.200584002201939], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 700, 41, 5.857142857142857, 240.5242857142857, 164, 1716, 176.0, 344.0, 532.7499999999983, 1340.7800000000002, 4.8833575175800865, 29.490322177332153, 3.1713210441315995], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 41, 100.0, 0.5324675324675324], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7700, 41, "500", 41, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 700, 41, "500", 41, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
