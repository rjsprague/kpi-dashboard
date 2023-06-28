"use client";

import KpiMeter from './KpiMeter';
import SpeedToLeadMeter from './SpeedToLeadMeter';
import BigChecksMeter from './BigChecksMeter';
import { useState, useEffect } from 'react';
import { FiInfo, FiList } from 'react-icons/fi';
import CountUp from 'react-countup';
import kpiToEndpointMapping from '../../lib/kpiToEndpointMapping';
import apiEndpoints from '../../lib/apiEndpoints';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function KpiCard({ prop, handleCardInfoClick, handleKpiCardClick, dateRange, leadSource, kpiView, teamMembers }) {
  const [fetchedData, setFetchedData] = useState(null);

  const startDate = dateRange.gte ? formatDate(new Date(dateRange.gte)) : null;
  const endDate = dateRange.lte ? formatDate(new Date(dateRange.lte)) : null;

  //console.log('KpiCard: ', dateRange, leadSource, kpiView, teamMembers);
  //console.log(fetchedData)

  const handleSingleKpiFetch = async () => {
    let apiName = prop.name;
    //console.log("apiName: ", apiName)
    const apiEndpointsKeys = kpiToEndpointMapping[apiName];
    if (!apiEndpointsKeys || apiEndpointsKeys.length < 1) {
      return;
    }
    //console.log("apiEndpointsKeys: ", apiEndpointsKeys)
    // Call the apiEndpoints function
    const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSource, kpiView, teamMembers);
    //console.log("apiEndpointsObj: ", apiEndpointsObj)
    for (const apiEndpointKey of apiEndpointsKeys) {
      let requestObject = apiEndpointsObj[apiEndpointKey];
      //console.log("requestObject: ", requestObject)

      // Make a request for each endpoint
      try {
        const response = await fetch(requestObject.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "filters": requestObject.filters
          }),
        });

        if (!response.ok) {
          console.error(`Error fetching data from ${requestObject.url}: ${response.status} ${response.statusText}`);
          throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();
        //console.log("data: ", data)
        let fetchedResults = data.data ? data.data : [];
        let offset = fetchedResults.length;

        while (data.total > fetchedResults.length) {
          const fetchMoreData = await fetch(requestObject.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "filters": requestObject.filters,
              "offset": offset,
              "limit": 1000,
            }),
          });

          const moreData = await fetchMoreData.json();
          fetchedResults = fetchedResults.concat(moreData.data);
          offset += moreData.data.length;
        }
        console.log("fetchedResults: ", fetchedResults)

        fetchedResults = fetchedResults.map((result) => {
          return {
            name: result["Seller Contact Name"] ? result["Seller Contact Name"] 
              : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                : result["First"] ? result["First"]
                  : result["Last"] ? result["Last"]
                    : result.Title ? result.Title 
                      : "No Name",
            address: result["Property Address"] ? result["Property Address"] : "No address",
            podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
          };
        });


        setFetchedData(fetchedResults);
        return fetchedResults;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
      }
    }
  };

  const renderMeter = () => {
    if (prop.kpiType === 'STL') {
      return (
        <SpeedToLeadMeter
          value={prop.current}
          unit="min"
          target={prop.target}
          redFlag={prop.redFlag}
        />
      );
    } else if (prop.kpiType === 'BigChecks') {
      return (
        <BigChecksMeter
          value={prop.current}
          unit="min"
          target={prop.target}
          redFlag={prop.redFlag}
        />
      );
    } else if (prop.kpiType === 'meter') {
      return (
        <KpiMeter
          redFlag={prop.redFlag}
          current={prop.current}
          target={prop.target}
          kpiName={prop.name}
          unit={prop.unit}
        />
      );
    } else {
      return (<div className="flex items-center self-center justify-center text-3xl font-semibold align-middle my-15">
        {
          prop.unit === "$" && prop.current !== Infinity ? (
            <span>$<CountUp delay={2} start={0} end={prop.current} /></span>
          ) : prop.unit === "%" && prop.current !== Infinity ? (
            <span><CountUp delay={2} start={0} end={prop.current} />{'%'}</span>
          ) : prop.current !== Infinity ? (
            <span><CountUp delay={2} start={0} end={prop.current} />{' '}{prop.unit}</span>
          ) : (
            <span>{prop.current}</span>
          )
        }
      </div>)
    }
  };

  return (
    <div className="">

      <div className="flex flex-col w-64 px-2 py-1 text-center text-black delay-500 rounded h-52 xs:w-72 sm:w-72 shadow-super-3 transform-gpu front">
        <h1 className="text-2xl font-semibold tracking-tighter align-top">{prop.name}</h1>
        <div className="mt-1 font-medium text-md">
          {prop.data1 !== null && prop.data2 !== null ? (
            <div className="flex flex-row justify-center gap-4 text-sm">
              <div>{prop.data1.length > 1 && prop.data1}</div>
              <div>{prop.data2.length > 1 && prop.data2}</div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="relative bottom-2">{renderMeter()}</div>
        <button
          onClick={() => {
            handleCardInfoClick(prop);
          }}
          className="absolute info-icon right-2 bottom-2"
        >
          <FiInfo />
        </button>
        {kpiView !== 'Team' && (
          <button
            onClick={async () => {
              const data = await handleSingleKpiFetch();
              handleKpiCardClick(data);
            }}
            className="absolute info-icon left-2 bottom-2"
          >
            <FiList />
          </button>
        )}

      </div>
    </div>
  );
}