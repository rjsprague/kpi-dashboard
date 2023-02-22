const fs = require('fs');

const filePath = "\mEI02.json"

try {
    const data = fs.readFileSync(filePath);
    const jsonData = JSON.parse(data);

    if (jsonData.app.name === "Marketing Expenses") {
        console.log("App Name: ", jsonData.app.name);
        console.log("Lead Source: ", jsonData["fields"][3]["values"][0]["value"]["title"]);
        console.log("Spent: $",jsonData['fields'][1]['values'][0]['value']);
        console.log("Week Number: ", jsonData['fields'][2]['values'][0]['value']);
        console.log("Created On: ", jsonData.created_on);
        console.log("Last Event On: ", jsonData.last_event_on);
    }
} catch (e) {
    console.error(e);
}