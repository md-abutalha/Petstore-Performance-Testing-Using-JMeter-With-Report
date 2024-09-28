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

    var data = {"OkPercent": 99.82010582010582, "KoPercent": 0.17989417989417988};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8237301587301588, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6494444444444445, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.9822222222222222, 500, 1500, "add to cart"], "isController": true}, {"data": [0.9944444444444445, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.9994444444444445, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.9944444444444445, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.845, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.9816666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.9988888888888889, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.6494444444444445, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.9994444444444445, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.9388888888888889, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.9822222222222222, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.9988888888888889, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.9891666666666666, 500, 1500, "continue"], "isController": true}, {"data": [0.5172222222222222, 500, 1500, "cat"], "isController": true}, {"data": [0.9927777777777778, 500, 1500, "Fish"], "isController": true}, {"data": [0.9861111111111112, 500, 1500, "EST-14"], "isController": true}, {"data": [0.845, 500, 1500, "checkout"], "isController": true}, {"data": [0.7516666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.5572222222222222, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.9388888888888889, 500, 1500, "Login"], "isController": true}, {"data": [0.9927777777777778, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.9994444444444445, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.5175, 500, 1500, "confirm"], "isController": true}, {"data": [0.9861111111111112, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.11055555555555556, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.11055555555555556, 500, 1500, "Sign in"], "isController": true}, {"data": [0.9891666666666666, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.6730555555555555, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18900, 34, 0.17989417989417988, 566.3742328042354, 158, 16128, 180.0, 1071.9000000000015, 2367.9500000000007, 7135.910000000014, 55.85964746355823, 252.74340208712627, 42.6974063131746], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 900, 0, 0.0, 530.4866666666665, 475, 1808, 508.0, 534.0, 557.8499999999998, 1507.0, 69.83240223463687, 292.62777147346367, 45.963905377094974], "isController": false}, {"data": ["add to cart", 900, 0, 0.0, 207.6866666666668, 160, 1627, 171.0, 214.0, 227.0, 1173.97, 32.724892735073816, 168.69710611955495, 21.571584566576977], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 900, 0, 0.0, 256.5877777777776, 159, 546, 183.5, 343.0, 355.0, 502.98, 32.82156011815761, 156.08603465409723, 21.603253437146712], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 900, 0, 0.0, 168.23000000000008, 158, 999, 166.0, 173.0, 175.0, 212.94000000000005, 72.05187735169322, 15.550258686254104, 66.56355075654471], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 900, 0, 0.0, 232.94777777777762, 158, 1311, 170.0, 333.0, 340.0, 816.8800000000001, 71.75316909830184, 363.8810616479311, 48.41937485051423], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1800, 0, 0.0, 361.80000000000143, 160, 1806, 485.0, 520.0, 533.0, 1110.89, 11.287814177494608, 62.01683844002408, 7.209209445392063], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 900, 0, 0.0, 324.83555555555535, 160, 1608, 331.0, 351.0, 362.89999999999986, 1250.92, 33.15527721495672, 142.4317035826119, 21.758150672315345], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 900, 0, 0.0, 171.50777777777785, 160, 602, 169.0, 176.0, 179.0, 206.84000000000015, 71.61043921069383, 339.52019762492046, 47.134214871101214], "isController": false}, {"data": ["F1-SW-01", 900, 0, 0.0, 530.4866666666668, 475, 1808, 508.0, 534.0, 557.8499999999998, 1507.0, 69.8432407263697, 292.6731894109887, 45.97103930622381], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 900, 0, 0.0, 170.56333333333316, 160, 577, 169.0, 178.0, 180.0, 188.0, 33.22504430005907, 139.22721200347016, 21.901274318886593], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 900, 0, 0.0, 401.35888888888866, 318, 1478, 341.0, 502.0, 510.94999999999993, 1063.1700000000008, 70.80481472740146, 374.35279974038235, 113.19090010620722], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 900, 0, 0.0, 207.6866666666668, 160, 1627, 171.0, 214.0, 227.0, 1173.97, 32.724892735073816, 168.69710611955495, 21.571584566576977], "isController": false}, {"data": ["Add to cart", 900, 0, 0.0, 171.50777777777785, 160, 602, 169.0, 176.0, 179.0, 206.84000000000015, 71.60474182512532, 339.4931851181478, 47.13046483411568], "isController": true}, {"data": ["continue", 1800, 0, 0.0, 199.72944444444408, 159, 15611, 169.0, 184.0, 201.94999999999982, 1215.7600000000011, 11.31044016462974, 52.80782658895975, 14.104914150617361], "isController": true}, {"data": ["cat", 900, 0, 0.0, 663.900000000001, 323, 2086, 670.0, 698.0, 706.0, 728.97, 32.63115913128603, 259.3922220006526, 42.923995458830355], "isController": true}, {"data": ["Fish", 900, 0, 0.0, 190.14999999999998, 159, 1321, 168.0, 179.0, 327.0, 892.97, 71.69600892217, 288.11433272922807, 47.05050585517406], "isController": true}, {"data": ["EST-14", 900, 0, 0.0, 187.2222222222221, 159, 2972, 168.0, 177.0, 184.94999999999993, 564.9200000000001, 32.72132339574623, 127.56203417560444, 21.281641974186513], "isController": true}, {"data": ["checkout", 1800, 0, 0.0, 361.8000000000012, 160, 1806, 485.0, 520.0, 533.0, 1110.89, 7.498187937915004, 41.1960989635838, 4.788881749410559], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 900, 0, 0.0, 493.33666666666704, 160, 1509, 500.0, 521.9, 531.0, 547.98, 32.826348615822305, 123.38732013896487, 21.542291279133384], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 900, 0, 0.0, 1722.1655555555546, 159, 15645, 987.0, 4274.5, 7518.649999999998, 14352.17, 33.15772022252514, 168.15238390192684, 20.788336311387834], "isController": false}, {"data": ["Login", 900, 0, 0.0, 401.35888888888866, 318, 1478, 341.0, 502.0, 510.94999999999993, 1063.1700000000008, 69.91920447482909, 369.6704814714108, 111.77513449735861], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 900, 0, 0.0, 190.14888888888885, 159, 1321, 168.0, 179.0, 327.0, 892.97, 71.70172084130019, 288.13728638862335, 47.05425430210325], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 900, 0, 0.0, 267.2055555555558, 159, 1186, 325.5, 339.0, 345.0, 357.99, 33.21523472099203, 139.3807261680691, 21.862371290965456], "isController": false}, {"data": ["confirm", 1800, 34, 1.8888888888888888, 2626.416111111106, 160, 17923, 670.5, 7619.500000000011, 9534.199999999997, 16512.83, 11.339582703356516, 167.98187861842936, 22.10332722255821], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 900, 0, 0.0, 187.22222222222206, 159, 2972, 168.0, 177.0, 184.94999999999993, 564.9200000000001, 32.723702868777956, 127.57131040250154, 21.283189561138784], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 900, 0, 0.0, 2764.478888888884, 742, 13116, 2426.0, 5031.099999999999, 5951.099999999996, 8767.490000000002, 56.868444332111714, 257.96330998041196, 33.37688969101478], "isController": false}, {"data": ["Sign in", 900, 0, 0.0, 2764.48, 742, 13116, 2426.0, 5031.099999999999, 5951.099999999996, 8767.490000000002, 56.51846269781462, 256.3757437672695, 33.17148054822909], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 1800, 0, 0.0, 199.7294444444441, 159, 15611, 169.0, 184.0, 201.94999999999982, 1215.7600000000011, 11.34079725804724, 52.94956219797252, 14.142771580592116], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1800, 34, 1.8888888888888888, 1341.0188888888877, 158, 16128, 183.0, 4311.400000000001, 7646.449999999998, 14460.300000000054, 11.160022320044641, 63.10129221820944, 7.247475432450865], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 34, 100.0, 0.17989417989417988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18900, 34, "500", 34, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1800, 34, "500", 34, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
