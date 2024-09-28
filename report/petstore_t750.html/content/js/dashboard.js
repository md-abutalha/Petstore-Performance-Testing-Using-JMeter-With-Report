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

    var data = {"OkPercent": 99.34603174603174, "KoPercent": 0.653968253968254};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7679809523809524, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5246666666666666, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.8086666666666666, 500, 1500, "add to cart"], "isController": true}, {"data": [0.9986666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.994, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.9826666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.7436666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.978, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.998, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.5246666666666666, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [0.9446666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.8153333333333334, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.8086666666666666, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.998, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.9956666666666667, 500, 1500, "continue"], "isController": true}, {"data": [0.28933333333333333, 500, 1500, "cat"], "isController": true}, {"data": [0.996, 500, 1500, "Fish"], "isController": true}, {"data": [0.9993333333333333, 500, 1500, "EST-14"], "isController": true}, {"data": [0.7436666666666667, 500, 1500, "checkout"], "isController": true}, {"data": [0.42333333333333334, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.6146666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.8153333333333334, 500, 1500, "Login"], "isController": true}, {"data": [0.996, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.9926666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.516, 500, 1500, "confirm"], "isController": true}, {"data": [0.9993333333333333, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.037333333333333336, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.037333333333333336, 500, 1500, "Sign in"], "isController": true}, {"data": [0.9956666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.6566666666666666, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15750, 103, 0.653968253968254, 726.3639365079381, 158, 15928, 229.0, 1551.0, 3612.1499999999924, 7911.959999999999, 47.32799653829511, 216.49287596271157, 36.176073246835784], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 750, 0, 0.0, 532.602666666667, 486, 681, 525.0, 569.0, 598.0, 625.0, 63.82978723404255, 267.47423537234044, 42.01296542553192], "isController": false}, {"data": ["add to cart", 750, 0, 0.0, 554.8933333333324, 162, 4290, 218.0, 1393.0999999999995, 1734.7999999999997, 2688.3500000000004, 40.85634907664651, 211.93954451980173, 26.931675416734763], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 750, 0, 0.0, 240.03733333333327, 160, 738, 176.0, 342.0, 348.0, 360.98, 41.4524954402255, 198.47530381224783, 27.284162037804677], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 750, 0, 0.0, 186.59333333333308, 159, 853, 171.0, 206.0, 268.89999999999986, 515.49, 66.88664942477482, 14.435497580932847, 61.791767925622054], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 750, 0, 0.0, 280.5426666666669, 158, 1677, 267.0, 364.0, 398.0, 1309.0900000000004, 65.89351607801792, 334.1650673761202, 44.46525352530311], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1500, 0, 0.0, 478.3053333333335, 160, 3950, 499.0, 863.0, 1193.3500000000006, 1938.8100000000002, 9.937262747851895, 54.59671896427223, 6.346650231538222], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 750, 0, 0.0, 306.96266666666656, 159, 2261, 328.5, 348.9, 428.29999999999905, 1164.47, 42.871841774322625, 184.1730780910598, 28.13464616439922], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 750, 0, 0.0, 176.76533333333333, 160, 1026, 171.0, 179.0, 183.44999999999993, 272.49, 66.17841701226507, 313.7658345649872, 43.55884088502603], "isController": false}, {"data": ["F1-SW-01", 750, 0, 0.0, 532.6026666666669, 486, 681, 525.0, 569.0, 598.0, 625.0, 63.82978723404255, 267.47423537234044, 42.01296542553192], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 750, 0, 0.0, 320.8826666666668, 160, 4448, 172.0, 348.0, 1415.4999999999966, 2467.0, 42.25114078080108, 177.05043465861078, 27.851093776406962], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 750, 0, 0.0, 467.5453333333332, 318, 1855, 471.0, 567.9, 666.8999999999999, 1484.6000000000004, 64.69421202449755, 342.04537490295866, 103.42229012119383], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 750, 0, 0.0, 554.8933333333324, 162, 4290, 218.0, 1393.0999999999995, 1734.7999999999997, 2688.3500000000004, 40.85634907664651, 211.93954451980173, 26.931675416734763], "isController": false}, {"data": ["Add to cart", 750, 0, 0.0, 176.76533333333336, 160, 1026, 171.0, 179.0, 183.44999999999993, 272.49, 66.17841701226507, 313.7658345649872, 43.55884088502603], "isController": true}, {"data": ["continue", 1500, 0, 0.0, 198.30800000000013, 159, 3099, 170.0, 328.0, 338.0, 394.97, 9.96254084641747, 46.514558385470636, 12.42398892663585], "isController": true}, {"data": ["cat", 750, 0, 0.0, 1787.7146666666663, 333, 10635, 938.5, 4045.5, 5152.499999999999, 7801.840000000003, 41.0913872452334, 326.6444259533202, 54.05283068293886], "isController": true}, {"data": ["Fish", 750, 0, 0.0, 186.9506666666665, 161, 1697, 170.0, 183.0, 332.44999999999993, 414.7800000000002, 65.74333800841514, 264.1931991256136, 43.14406556802244], "isController": true}, {"data": ["EST-14", 750, 0, 0.0, 180.6226666666668, 160, 1317, 169.0, 180.0, 326.0, 342.49, 40.86525363700758, 159.3106372255217, 26.578377853756876], "isController": true}, {"data": ["checkout", 1500, 0, 0.0, 478.30533333333346, 160, 3950, 499.0, 863.0, 1193.3500000000006, 1938.8100000000002, 6.478138442137268, 35.59180358932057, 4.137404825349387], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 750, 0, 0.0, 1466.8319999999997, 168, 10302, 595.0, 3698.7, 4818.049999999999, 7470.370000000003, 41.46395400265369, 155.8542567931778, 27.210719814241486], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 750, 0, 0.0, 1306.7613333333322, 161, 8412, 710.0, 3030.7, 4466.799999999998, 7997.2300000000005, 43.31504475887958, 219.66311272740396, 27.156502671094426], "isController": false}, {"data": ["Login", 750, 0, 0.0, 467.54666666666657, 318, 1855, 471.0, 567.9, 666.8999999999999, 1484.6000000000004, 64.6718979046305, 341.92739771061485, 103.38661803699233], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 750, 0, 0.0, 186.95066666666656, 161, 1697, 170.0, 183.0, 332.44999999999993, 414.7800000000002, 65.74910142894713, 264.21635974620847, 43.14784781274656], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 750, 0, 0.0, 260.50133333333355, 161, 1070, 318.0, 345.0, 350.0, 517.8800000000001, 42.4616429825058, 178.18132802326897, 27.94838610371964], "isController": false}, {"data": ["confirm", 1500, 103, 6.866666666666666, 2334.48933333333, 162, 17558, 662.0, 6523.700000000001, 8806.650000000001, 10116.69, 9.994403134244823, 153.10746294575037, 19.481277984328777], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 750, 0, 0.0, 180.62266666666682, 160, 1317, 169.0, 180.0, 326.0, 342.49, 40.86748038360941, 159.31931805797734, 26.579826108870968], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 750, 0, 0.0, 4877.207999999996, 745, 14760, 4453.0, 8593.8, 9810.899999999998, 11461.600000000002, 43.41534008683068, 196.9394446454414, 25.481073625180898], "isController": false}, {"data": ["Sign in", 750, 0, 0.0, 4877.208000000002, 745, 14760, 4453.0, 8593.8, 9810.899999999998, 11461.600000000002, 42.99719085019778, 195.04264783867453, 25.23565595797741], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 1500, 0, 0.0, 198.3080000000001, 159, 3099, 170.0, 328.0, 338.0, 394.97, 9.99060882770196, 46.64560625512019, 12.458991672827542], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1500, 103, 6.866666666666666, 1277.3573333333322, 162, 15928, 326.5, 3992.000000000002, 5766.400000000001, 8311.810000000001, 9.827301554023952, 60.3747436712178, 6.381987825611258], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 103, 100.0, 0.653968253968254], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15750, 103, "500", 103, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1500, 103, "500", 103, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
