setters: {
    [
        {
            name: 'Brandon Pringle',
            item_id: '2593807622',
            first_outbound
        },
        {},
        {}
    ]
}

setters: {
    [
        {
            name: 'Brandon Pringle',
            item_id: '2593807622',
            first_outbound_call_ts: null
        },
        {
            name: 'Chris Kaczmarski',
            item_id: '2637523449',
            first_outbound_call_ts: null
        },
        {
            name: 'Nick Horne',
            item_id: '2676491067',
            first_outbound_call_ts: null,
            first_outbound_call: {
                item_id: '2769207495',
                created_on: '2024-03-30 07: 58: 00'
            }
        }
    ]
}

'{"connection_tracking":{"timestamp":"2024-03-23 14:16:25"},"last_outbound_communication":{"timestamp":"2024-03-29 09:49:33","id":"2768802118"},"last_communication_status":{"timestamp":"2024-03-29 10:38:11","value":"Commitment Completed"},"lead_created_ts":"2024-03-23 14:09:44","setters":[{"name":"Brandon Pringle","item_id":"2593807622","first_outbound_call_ts":null},{"name":"Chris Kaczmarski","item_id":"2637523449","first_outbound_call_ts":null},{"name":"Nick Horne","item_id":"2676491067","first_outbound_call_ts":null}],"speed_to_lead":{"final_setter_first_outbound_call":{"type":null,"item_id":null,"created_on":null}},"setter_call":{"qualification":null,"setter_responsible":{"item_id":null,"name":null},"created_on":null,"item_id":null},"discovery_call_booking":{"closer_assigned":{"item_id":null,"name":null,"first_outbound_call":null},"created_on":null,"item_id":null,"self_set":null}}',

const admin_json = {
    "connection_tracking": { "timestamp": "2024-03-23 14:16:25" },
    "last_outbound_communication": { "timestamp": "2024-03-29 09:49:33", "id": "2768802118" },
    "last_communication_status": { "timestamp": "2024-03-29 10:38:11", "value": "Commitment Completed" },
    "lead_created_ts": "2024-03-23 14:09:44",
    "setters": [
        { "name": "Brandon Pringle", "item_id": "2593807622", "first_outbound_call_ts": null },
        { "name": "Chris Kaczmarski", "item_id": "2637523449", "first_outbound_call_ts": null },
        { "name": "Nick Horne", "item_id": "2676491067", "first_outbound_call_ts": null }
    ],
    "speed_to_lead": { "final_setter_first_outbound_call": { "type": null, "item_id": null, "created_on": null } },
    "setter_call": { "qualification": null, "setter_responsible": { "item_id": null, "name": null }, "created_on": null, "item_id": null },
    "discovery_call_booking": {
        "closer_assigned": { "item_id": null, "name": null, "first_outbound_call": null },
        "created_on": null,
        "item_id": null,
        "self_set": null
    }
};

adminObj:
{
    lead_created_ts: '2024-04-01 18:55:54',
        setters: [
            {
                name: 'Brandon Pringle',
                item_id: '2593807622',
                first_outbound_call: { type: 'Outgoing Call', item_id: '2771202098', created_on: '2024-04-02 05:19:58' }
            },
            { name: 'Chris Kaczmarski', item_id: '2637523449', first_outbound_call: null },
            {
                name: 'Nick Horne',
                item_id: '2676491067',
                first_outbound_call: { type: 'Outgoing Call', item_id: '2771777175', created_on: '2024-04-02 12:20:04' }
            }
        ],
            setter_call: {
        qualification: null,
            setter_responsible: { item_id: null, name: null },
        created_on: null,
            item_id: null
    },
    discovery_call_booking: {
        closer_assigned: {
            item_id: '2593542815',
                name: 'Brandon Pringle',
                    first_outbound_call: { type: 'Outgoing Call', item_id: '2771202098', created_on: '2024-04-02 05:19:58' }
        },
        created_on: '2024-04-01 18:57:24',
            item_id: '2770842477',
                self_set: null
    },
    speed_to_lead: { final_setter_first_outbound_call: { type: null, item_id: null, created_on: null } },
    last_outbound_communication: { timestamp: '2024-04-02 12:20:04', id: '2771777175' },
    last_communication_status: { timestamp: '2024-04-02 12:48:03', value: 'Commitment Completed' }
}