let currentChart;

renderChart = (data, labels, countryName) => {
    let ctx = document.getElementById("myChart").getContext("2d");

    if(currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Population, " + countryName,
                data: data,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)"
            }]
        },
        options: {
            animation: {
                duration: 4000
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

fetchDataGraph = async () => {
    let countryCode = document.getElementById("country").value;
    const indicatorCode = "SP.POP.TOTL"
    const baseUrl = "https://api.worldbank.org/v2/country/";
    const url = baseUrl + countryCode + "/indicator/" + indicatorCode + "?format=json" + "&per_page=60";

    let response = await fetch(url);

    if (response.status === 200) {
        let fetchedData = await response.json();
        console.log(fetchedData);

        let data = getValues(fetchedData);
        let labels = getLabels(fetchedData);
        let countryName = getCountryName(fetchedData)
        let indicatorName = getIndicatorName(fetchedData)
        renderChart(data, labels, countryName, indicatorName)
        renderGraphInformation(countryName, indicatorName)
        fetchCountryInfo(countryCode)
    }
}

fetchCountryInfo = async (countryCode) => {
    const baseurl = "https://restcountries.eu/rest/v2/alpha/"
    const url = baseurl + countryCode
    console.log("Fetching data from: ", url);

    let response = await fetch(url);

    if (response.status === 200) {
        let fetchedInfo = await response.json();
        console.log("fetched info:", fetchedInfo);

        let countryCapital = getCountryCapital(fetchedInfo)
        let countryFlag = getCountryFlag(fetchedInfo)
        renderCountryInformation(countryCapital, countryFlag)
    }
}

function renderGraphInformation(countryName, indicatorName) {
        let p1 = document.getElementById("name")
        p1.textContent = "";
        let p2 = document.getElementById("indicator")
        p2.textContent = "";

        let name = document.createTextNode(countryName)
        let indicator = document.createTextNode(indicatorName)
        p1.appendChild(name)
        p2.appendChild(indicator)
}

function renderCountryInformation(countryCapital, countryFlag) {
        let p3 = document.getElementById("capital")
        p3.textContent = "";
        let p4 = document.getElementById("image")
        p4.textContent = "";
        let flag = document.createElement("img")

        let capital = document.createTextNode(countryCapital)
        p3.appendChild(capital)
        flag.src = countryFlag
        p4.appendChild(flag)
}

document.getElementById("renderBtn").addEventListener("click", fetchDataGraph, renderGraphInformation, renderCountryInformation, fetchCountryInfo)

getValues = (data) => {
    let vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

getLabels = (data) => {
    let labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

getCountryName = (data) => {
    let countryName = data[1][0].country.value;
    return countryName;
}
getIndicatorName = (data) => {
    let indicatorName = data[1][0].indicator.value;
    return indicatorName;
}
getCountryCapital = (data) => {
    let countryCapital = data.capital;
    return countryCapital;
}
getCountryFlag = (data) => {
    let countryFlag = data.flag;
    return countryFlag;
}