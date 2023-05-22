// Adding font to transition
const text2019 = "2019";
const text2022 = "2022"
const rollingText2019 = document.getElementById("chart1Background");
const rollingText2022 = document.getElementById("chart2Background");

function createRollingText(data, text) {
    for (let i = 0; i < data.length; i++) {
        const digit = document.createElement("span");
        digit.textContent = data.charAt(i);
        digit.classList.add("rolling-digit");
        digit.style.animationDelay = `${i * 0.2}s`;
        text.appendChild(digit);
    }
}
createRollingText(text2019, rollingText2019)
createRollingText(text2022, rollingText2022)

function createBubbleChart(bubbleData, chartName) {

    // Define the SVG dimensions
    const svgWidth = 400;
    const svgHeight = 500;

    // Define the maximum word length
    const maxWordLength = d3.max(bubbleData, d => d.word.length);

    // Define the bubbles
    const bubbles = d3.select(chartName)
        .selectAll(".bubble")
        .data(bubbleData)
        .join("circle")
        .attr("class", "bubble")
        .attr("r", d => d.r = d.word.length / maxWordLength * 50)
        .attr("cx", d => d.x = Math.random() * svgWidth)
        .attr("cy", d => d.y = Math.random() * svgHeight - 100);

    // Define the tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    // Add mouseover and mouseout events to the bubbles
    bubbles.on("mouseover", function (event, d) {
        tooltip.text(d.word + " (" + d.frequency + ")")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + "px")
            .style("visibility", "visible");
    }).on("mouseout", function () {
        tooltip.style("visibility", "hidden");
    });

    // Define the bubble labels
    const labels = d3.select(chartName)
        .selectAll(".bubble-label")
        .data(bubbleData)
        .join("text")
        .attr("class", "bubble-label")
        .text(d => `${d.word}`);

    // Define the force simulation
    const simulation = d3.forceSimulation(bubbleData)
        .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-1))
        .force("collide", d3.forceCollide().radius(d => d.r + 1).strength(0.0001).iterations(100))
        .velocityDecay(0.7)
        .on("tick", () => {
            bubbles
                .attr("cx", d => (d.x = Math.max(d.r, Math.min(svgWidth - d.r, d.x + d.vx))))
                .attr("cy", d => (d.y = Math.max(d.r, Math.min(svgHeight - d.r, Math.max(d.r, Math.min(svgHeight - d.r, d.y + d.vy))))));


            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y + 4);
        });

}

const data2019 = [

    { date: new Date("2021-03-01"), value: 825, label: "B"}, //Billionaires
    { date: new Date("2021-04-01"), value: 442, label: "CL"}, //Criminal law
    { date: new Date("2021-05-01"), value: 373, label: "Super"}, //Superannuation
    { date: new Date("2021-06-01"), value: 301, label: "PS"}, // Public Statements
    { date: new Date("2021-07-01"), value: 257, label: "SSGB"}, //Social security and government benefits
    { date: new Date("2021-08-01"), value: 244, label: "LI"}, //Life insurance
    { date: new Date("2021-09-01"), value: 233, label: "F&C"}, //Food and cooking
    { date: new Date("2021-10-01"), value: 190, label: "PM"} //Property market
];
const data2022 = [
    {date: new Date("2021-03-01"), value: 583, label: "B"},
 {date: new Date("2021-04-01"), value: 583, label: "CL"},
 {date: new Date("2021-05-01"), value: 560, label: "PS"},
 {date: new Date("2021-06-01"), value: 386, label: "LI"},
 {date: new Date("2021-07-01"), value: 342, label: "E&T"},
 {date: new Date("2021-08-01"), value: 319, label: "Super"},
 {date: new Date("2021-09-01"), value: 313, label: "F&C"},
 {date: new Date("2021-010-01"), value: 237, label: "PM"}
];
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const x2019 = d3.scaleTime()
    .domain(d3.extent(data2019, d => d.date))
    .range([0, width]);
const y2019 = d3.scaleLinear()
    .domain([0, d3.max(data2019, d => d.value)])
    .range([height, 0]);
const x2022 = d3.scaleTime()
    .domain(d3.extent(data2022, d => d.date))
    .range([0, width]);
const y2022 = d3.scaleLinear()
    .domain([0, d3.max(data2022, d => d.value)])
    .range([height, 0]);
const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));
const xAxis = g => g
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));
const yAxis = g => g
    .call(d3.axisLeft(y));

// Define the toggle behavior
let chartType = "line";
const toggle = d3.select("#toggle")
    .on("click", () => {
        chartType = chartType === "line" ? "bar" : "line";
        updateChart(chartType);

    });
function getDataShow(filename, variable, chartName) {
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            variable = data;
            // Do something with the data here
            createBubbleChart(variable, chartName);
        });
}
// Define the updateChart function
function updateChart(type) {
    if (type === "line") {
        const svg1 = d3.select("#chart1")
        const svg2 = d3.select("#chart2")

        // Remove all the previous charts
        svg1.selectAll(".bar").remove();
        svg1.selectAll(".bar-label").remove();
        svg1.selectAll(".topic-label").remove();
        svg1.selectAll(".x-axis").remove();
        svg1.selectAll(".y-axis").remove();

        //  Define the first election's data
        let bubbleData2019;
        getDataShow('assets/words2019.json', bubbleData2019, "#chart1")

        svg2.selectAll(".bar").remove();
        svg2.selectAll(".bar-label").remove();
        svg2.selectAll(".topic-label").remove();
        svg2.selectAll(".x-axis").remove();
        svg2.selectAll(".y-axis").remove();

        // Define the first election's data
        let bubbleData2022;
        getDataShow('assets/words2022.json', bubbleData2022, "#chart2")

    } else {
        const svg3 = d3.select("#chart1")
        svg3.selectAll(".bubble").remove();
        svg3.selectAll(".bubble-label").remove();

        svg3.selectAll(".bar")
            .data(data2019)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x2019(d.date))
            .attr("width", width / data2019.length)
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attr("y", d => y2019(d.value) + 150)
            .attr("height", d => height - y2019(d.value));


        svg3.selectAll(".bar-label")
            .data(data2019)
            .join("text")
            .attr("class", "bar-label")
            .text(d => d.value)
            .attr("x", d => x2019(d.date) + 25)
            .attr("y", d => y2019(d.value) + 140)
            .attr("text-anchor", "middle")
            .attr("font-size", "0px")
            .transition()
            .duration(2000)
            .attr("font-size", "12px")
            .attr("fill", "black");

        svg3.selectAll(".topic-label")
            .data(data2019)
            .join("text")
            .attr("class", "topic-label")
            .text(d => d.label)
            .attr("x", d => x2019(d.date) + 25)
            .attr("y", d => 420)
            .attr("text-anchor", "middle")
            .attr("font-size", "0px")
            .transition()
            .duration(2000)
            .attr("font-size", "12px")
            .attr("fill", "black");


        const svg4 = d3.select("#chart2")
        svg4.selectAll(".bubble").remove();
        svg4.selectAll(".bubble-label").remove();

        svg4.selectAll(".bubble").remove();
        svg4.selectAll(".bubble-label").remove();
        svg4.selectAll(".bar")
            .data(data2022)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x2022(d.date))
            .attr("width", width / data2022.length)
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attr("y", d => y2022(d.value) + 150)
            .attr("height", d => height - y2022(d.value));

        svg4.selectAll(".bar-label")
            .data(data2022)
            .join("text")
            .attr("class", "bar-label")
            .text(d => d.value)
            .attr("x", d => x2022(d.date) + 25)
            .attr("y", d => y2022(d.value) + 140)
            .attr("text-anchor", "middle")
            .attr("font-size", "0px")
            .transition()
            .duration(2000)
            .attr("font-size", "12px")
            .attr("fill", "black");

        svg4.selectAll(".topic-label")
            .data(data2022)
            .join("text")
            .attr("class", "topic-label")
            .text(d => d.label)
            .attr("x", d => x2022(d.date) + 25)
            .attr("y", d => 420)
            .attr("text-anchor", "middle")
            .attr("font-size", "0px")
            .transition()
            .duration(2000)
            .attr("font-size", "12px")
            .attr("fill", "black");
    }
}