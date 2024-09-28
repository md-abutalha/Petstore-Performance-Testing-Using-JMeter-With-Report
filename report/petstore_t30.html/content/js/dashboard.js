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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8371428571428572, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48333333333333334, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "add to cart"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.8833333333333333, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.725, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "F1-SW-01"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01"], "isController": false}, {"data": [0.8166666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "continue"], "isController": true}, {"data": [0.48333333333333334, 500, 1500, "cat"], "isController": true}, {"data": [1.0, 500, 1500, "Fish"], "isController": true}, {"data": [1.0, 500, 1500, "EST-14"], "isController": true}, {"data": [0.725, 500, 1500, "checkout"], "isController": true}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.8166666666666667, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.95, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "confirm"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "Sign in"], "isController": true}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.975, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 630, 0, 0.0, 340.6253968253968, 162, 2514, 194.0, 701.9, 1081.6999999999996, 1644.0099999999984, 1.9726274458231963, 8.888247328342274, 1.5078160959354483], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 30, 0, 0.0, 601.1666666666667, 510, 1525, 541.5, 716.7, 1131.7499999999995, 1525.0, 3.847140292382662, 16.121170893177737, 2.532199762759682], "isController": false}, {"data": ["add to cart", 30, 0, 0.0, 260.26666666666665, 168, 1423, 175.0, 231.40000000000003, 1371.3, 1423.0, 3.6845983787767134, 18.951933262711865, 2.4288124078850406], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-6", 30, 0, 0.0, 264.36666666666656, 168, 1085, 180.0, 411.90000000000003, 1064.6499999999999, 1085.0, 3.69321679182568, 17.521139819032378, 2.430886833682137], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 30, 0, 0.0, 232.16666666666669, 169, 676, 201.0, 250.20000000000002, 660.6, 676.0, 3.679175864606328, 0.7940408848417955, 3.398926140544518], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 30, 0, 0.0, 398.70000000000005, 167, 1407, 184.0, 1112.8, 1387.75, 1407.0, 3.7137905422134194, 18.833705357142858, 2.506083266278782], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 60, 0, 0.0, 422.49999999999994, 169, 1594, 519.5, 601.8, 758.3499999999998, 1594.0, 0.4277891854893908, 2.350333942932923, 0.27321692120123203], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 30, 0, 0.0, 185.83333333333334, 170, 214, 181.0, 209.0, 211.8, 214.0, 3.695491500369549, 15.875456162232076, 2.4251662971175167], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 30, 0, 0.0, 224.83333333333337, 170, 1034, 201.5, 217.4, 596.1999999999994, 1034.0, 4.1180507892930684, 19.5245474433768, 2.710513898421414], "isController": false}, {"data": ["F1-SW-01", 30, 0, 0.0, 601.1666666666667, 510, 1525, 541.5, 716.7, 1131.7499999999995, 1525.0, 3.847140292382662, 16.121170893177737, 2.532199762759682], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FL-DSH-01", 30, 0, 0.0, 182.39999999999998, 167, 228, 178.5, 205.5, 219.2, 228.0, 3.6733194563487204, 15.39278690155504, 2.4213775713236196], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 30, 0, 0.0, 632.3666666666667, 343, 1653, 378.0, 1500.4000000000003, 1637.05, 1653.0, 3.6040365209034118, 19.05493527751081, 5.761531039764536], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-14", 30, 0, 0.0, 260.26666666666665, 168, 1423, 175.0, 231.40000000000003, 1371.3, 1423.0, 3.6845983787767134, 18.951933262711865, 2.4288124078850406], "isController": false}, {"data": ["Add to cart", 30, 0, 0.0, 224.83333333333337, 170, 1034, 201.5, 217.4, 596.1999999999994, 1034.0, 4.118616144975288, 19.527227913920925, 2.7108860172981877], "isController": true}, {"data": ["continue", 60, 0, 0.0, 183.9333333333334, 168, 220, 180.0, 209.8, 215.95, 220.0, 0.42897589155489463, 2.0028649780507335, 0.5349630991363286], "isController": true}, {"data": ["cat", 30, 0, 0.0, 771.1666666666667, 677, 1504, 716.5, 803.1, 1412.6999999999998, 1504.0, 3.4411562284927735, 27.35450361321404, 4.5265990622849275], "isController": true}, {"data": ["Fish", 30, 0, 0.0, 185.39999999999998, 167, 232, 179.0, 202.0, 216.59999999999997, 232.0, 4.043671653861707, 16.249715679336838, 2.653659522846745], "isController": true}, {"data": ["EST-14", 30, 0, 0.0, 195.16666666666669, 168, 454, 185.0, 211.3, 327.49999999999983, 454.0, 3.673769287288758, 14.321959955914767, 2.38938510286554], "isController": true}, {"data": ["checkout", 60, 0, 0.0, 422.49999999999994, 169, 1594, 519.5, 601.8, 758.3499999999998, 1594.0, 0.27166653837969024, 1.4925741649649775, 0.1735057774417162], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 30, 0, 0.0, 588.7666666666668, 510, 1329, 533.0, 629.1, 1223.3999999999999, 1329.0, 3.512058066026692, 13.201085445446031, 2.3047881058300166], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 30, 0, 0.0, 184.0333333333333, 162, 262, 179.0, 203.9, 230.64999999999995, 262.0, 3.714710252600297, 18.8383694743685, 2.3289492013372954], "isController": false}, {"data": ["Login", 30, 0, 0.0, 632.3666666666667, 343, 1653, 378.0, 1500.4000000000003, 1637.05, 1653.0, 3.6031707902954597, 19.050358065097285, 5.760147054407879], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 30, 0, 0.0, 185.39999999999998, 167, 232, 179.0, 202.0, 216.59999999999997, 232.0, 4.043671653861707, 16.249715679336838, 2.653659522846745], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=K9-BD-01", 30, 0, 0.0, 298.1666666666667, 163, 1337, 190.5, 1098.700000000002, 1298.5, 1337.0, 3.690944881889764, 15.48827163816437, 2.4293914554625986], "isController": false}, {"data": ["confirm", 60, 0, 0.0, 716.1166666666666, 171, 2240, 869.5, 1827.1, 2008.6999999999998, 2240.0, 0.43027717021047723, 6.291332940406612, 0.8387043278712037], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=EST-14", 30, 0, 0.0, 195.16666666666669, 168, 454, 185.0, 211.3, 327.49999999999983, 454.0, 3.6746692797648213, 14.325468520333171, 2.389970449534542], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 30, 0, 0.0, 1006.7999999999998, 700, 2514, 737.0, 1963.1000000000006, 2401.7999999999997, 2514.0, 2.864508736751647, 12.995284004105795, 1.6812204597536522], "isController": false}, {"data": ["Sign in", 30, 0, 0.0, 1006.7999999999998, 700, 2514, 737.0, 1963.1000000000006, 2401.7999999999997, 2514.0, 2.831524303916942, 12.845645056630485, 1.661861432279377], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 60, 0, 0.0, 183.9333333333334, 168, 220, 180.0, 209.8, 215.95, 220.0, 0.43028951312741587, 2.0089982053341555, 0.5366012776012794], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 60, 0, 0.0, 249.91666666666666, 171, 1480, 186.5, 226.09999999999997, 1185.999999999996, 1480.0, 0.42254413825644205, 2.3103756153299013, 0.27440610541067767], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 630, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
