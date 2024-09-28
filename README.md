# Petstore-Performance-Testing-Using-JMeter-With-Report

This repository contains the performance testing results for the [Petstore](https://petstore.octoperf.com/) website. The tests were conducted using Apache JMeter, focusing on evaluating API performance under various loads.

## Project Overview

The performance tests aimed to evaluate the following:
- Response Time
- Throughput
- Error Rate
- APDEX (Application Performance Index)
- Server's ability to handle concurrent requests

## JMeter Installation Guide

### Step 1: Download JMeter
You can download Apache JMeter from the official website: [JMeter Download](https://jmeter.apache.org/download_jmeter.cgi).

### Step 2: Installation
1. After downloading, extract the **.zip** file.
2. Navigate to the **bin** folder.
3. Run the **jmeter.bat** file (on Windows) or **jmeter.sh** file (on Unix/Linux) to start the JMeter GUI.

### Step 3: Verifying Installation
Open your terminal and run the following command to verify the JMeter installation:
```bash
jmeter -v
```
## Project Setup in JMeter
### Step 1: Creating a Test Plan
- Open JMeter.
- Create a Thread Group.
- Set the number of threads (users), ramp-up period, and loop count.
- Add HTTP Request Sampler to simulate API calls to the Petstore website.
- Configure the request with the correct API endpoint and parameters.

### Step 2: Running the Test
Once the test plan is configured, execute the performance test by clicking the start button in JMeter. You can also save the test plan for later execution using the command line.

## _Test Scenarios_
Server: https://petstore.octoperf.com/

1. 30 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~0.50
- Total API Requests: 630

2. 40 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~0.7
- Total API Requests: 840

3. 50 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~0.8
- Total API Requests: 1050

4. 70 Concurrent Requests with 10 Loop Count
- Avg TPS for Total Samples is ~1.2
- Total API Requests: 1470
- Errors: 6 connection timeouts, Error Rate: 0.41%

## Test Report Regeneration Command
You can regenerate the test reports using the following commands:
```bash
jmeter -n -t petstore_t50.jmx -l report\petstore_t50.jtl
jmeter -g report\petstore_t50.jtl -o report\petstore_t50.html
```

Repeat the same for other .jmx files like petstore_t110.jmx and petstore_t180.jmx to generate their respective reports.

## Results Summary
The performance tests indicate that the Petstore server can handle up to 55 concurrent API requests with almost zero errors. For 70 concurrent requests, a 0.41% error rate was observed due to connection timeouts.

## Key Takeaways
- Performance: The server handles up to 55 concurrent API calls with negligible errors.
- Optimization: Further improvements are needed for higher load scenarios (70+ requests).
- Scalability: The website scales up to moderate loads but requires optimization for peak traffic.
  
## _Screenchots_ 
![image](https://github.com/user-attachments/assets/be6089ad-ce8b-4907-a0d8-e3dd77f5dc69)
![image](https://github.com/user-attachments/assets/6634260c-5ed6-4c96-a791-9943e0eec67f)
![image](https://github.com/user-attachments/assets/7014806e-2f58-4fec-bbec-79b134199c57)
![image](https://github.com/user-attachments/assets/13c758e5-63f9-4232-8916-0316b89e0ad1)


## Authors

- [@abutalha](https://github.com/md-abutalha)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/md-abutalha)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abu-talha1/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/abu_talha0x)







