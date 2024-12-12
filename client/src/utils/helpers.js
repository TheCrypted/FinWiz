export function stringToRGB(str) {
    // Validate input
    // if (str.length < 2 || str.length > 10 || !/^[A-Z]+$/.test(str)) {
    //     throw new Error('Input must be a string of length 2 to 10 consisting only of capital letters');
    // }

    // Convert each letter to a number 0-25 (A=0, B=1, ..., Z=25) and sum them
    const total = [...str].reduce((sum, char) => sum + (char.charCodeAt(0) - 65), 0);

    // Scale values to RGB range while ensuring a valid distribution
    const numChars = str.length;
    const red = (total * 255 / (25 * numChars)) % 256;
    const green = ((total * 512 / (25 * numChars)) + 85) % 256;
    const blue = ((total * 1024 / (25 * numChars)) + 170) % 256;

    // Round the values to integers
    const r = Math.floor(red);
    const g = Math.floor(green);
    const b = Math.floor(blue);

    return {
        rgb: [r, g, b],
        cssString: `rgba(${r}, ${g}, ${b}, 0.3)`
    };
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export const processEducationValues = (rawData) => {
    console.log("rawData", rawData)
    // return {}
    let res = rawData.filter(item =>  item.indicator_name !== undefined && !item.indicator_name.includes("GPI"))
        .forEach(item => item.indicator_name = item.indicator_name.split(",", 2)[1]);
    return res;
}

export const processIMFValues = (rawData) => {
    const mappings = {
        "Country GDP based on PPP Valuation, USD Billions": "GDP (PPP, USD Bn)",
        "Current Account Balance, % of GDP": "Current Account (% of GDP)",
        "Current Account Balance, USD Billions": "Current Account (USD Bn)",
        "Exports of Goods and services, % change": "Exports (Goods & Services, % Chg)",
        "Exports of Goods, % change": "Exports (Goods, % Chg)",
        "GDP at Constant Prices, % change": "GDP (% Chg, Constant)",
        "GDP at Constant Prices, LCU Billions": "GDP (Constant, LCU Bn)",
        "GDP at Current Prices, LCU Billions": "GDP (Current, LCU Bn)",
        "GDP at Current Prices, USD Billions": "GDP (Current, USD Bn)",
        "GDP Corresponding to Fiscal Year, Current Prices, LCU Billions": "GDP (Fiscal Yr, LCU Bn)"
    };

    return rawData.map((item) => {
        const indicatorName = mappings[item.indicator_name] || item.indicator_name || "N/A";
        let value = item.avg || "N/A";

        if (typeof value === "number") {
            if (indicatorName.includes("%")) {
                value = `${value.toFixed(2)}%`; // Add percentage sign for percentage indicators
            } else {
                value = value.toLocaleString(undefined, { maximumFractionDigits: 2 }); // Format numbers with commas
            }
        }

        return { indicator_name: indicatorName, avg: value };
    });
};

export const generateChartData = (item) => {
    console.log(item)
    if(!item) return null
    const previousValue = item.education_value / (1 + item.year_change / 100);
    const data = [
        { name: `${item.year - 1}`, value: previousValue },
        { name: `${item.year}`, value: item.education_value },
    ];
    return data;
};

export  const processIMFPerformance = (rawData) => {
    const mappings = {
        "General Government Net Lending/Borrowing, USD Billions": "Govt Lending/Borrowing (USD Bn)",
        "General Government Primary Net Lending/Borrowing, USD Billions": "Primary Lending/Borrowing (USD Bn)",
        "Country GDP based on PPP Valuation, USD Billions": "GDP (PPP, USD Bn)",
        "GDP at Current Prices, USD Billions": "GDP (Current, USD Bn)",
        "Population, Millions": "Population (Mn)",
        "General Government Gross Debt, % of GDP": "Govt Debt (% of GDP)",
        "Total Investment, % of GDP": "Investment (% of GDP)",
        "Gross National Savings, % of GDP": "Savings (% of GDP)",
        "Share of World GDP based on PPP, %": "World GDP Share (% of PPP)",
        "GDP at Constant Prices, % change": "GDP (% Chg, Constant)"
    };

    return rawData.map((item) => {
        const indicatorName = mappings[item.indicator_name] || item.indicator_name || "N/A";
        let value = item.country_average || "N/A";

        if (typeof value === "number") {
            if (indicatorName.includes("%")) {
                value = `${value.toFixed(2)}%`; // Add percentage sign for percentage indicators
            } else {
                value = value.toLocaleString(undefined, { maximumFractionDigits: 2 }); // Format numbers with commas
            }
        }

        return { indicator_name: indicatorName, country_average: value };
    });
};


export function getColorFromPercentChange(percentChange) {
    // Convert percentage to decimal and cap at ±5% for more sensitive color scaling
    const normalizedChange = Math.max(Math.min(percentChange, 5), -5) / 5;

    if (normalizedChange >= 0) {
        // Positive change: pure green with variable intensity
        return {text: `rgba(0, ${Math.round(120 + (normalizedChange * 105))}, 50, 1)`, bg: `rgba(0, ${Math.round(120 + (normalizedChange * 105))}, 0, 0.4)`}

    } else {
        // Negative change: pure red with variable intensity
        return {bg: `rgba(${Math.round(120 + (Math.abs(normalizedChange) * 105))}, 0, 0, 0.4)`, text: `rgba(${Math.round(120 + (Math.abs(normalizedChange) * 105))}, 0, 50, 1)`}

    }
}