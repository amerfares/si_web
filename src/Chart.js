import React, { useState, useEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_data_countries from "@amcharts/amcharts5-geodata/data/countries2";


function Chart(params) {
  const rootRef = useRef();
  const [country, setCountry] = useState("");
  const [capital, setCapital] = useState("");
  const [president, setPresident] = useState("");
  const [officialLanguage, setOfficialLanguage] = useState("");
  const [population, setPopulation] = useState("");
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    if (!rootRef.current) {
        rootRef.current = am5.Root.new("chartDiv");
    }
    const root = rootRef.current;

    am5.ready(function() {
        
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        
        var chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            projection: am5map.geoOrthographic(),
            paddingBottom: 20,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20
        }));
        
        var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow 
        }));
        
        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            toggleKey: "active",
            interactive: true
        });
        
        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: root.interfaceColors.get("primaryButtonHover")
        });
        
        polygonSeries.mapPolygons.template.states.create("active", {
            fill: root.interfaceColors.get("primaryButtonHover")
        });
        
        var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
        backgroundSeries.mapPolygons.template.setAll({
            fill: root.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0.1,
            strokeOpacity: 0
        });
        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });
        
        
        var previousPolygon;
        
        polygonSeries.mapPolygons.template.on("active", function(active, target) {
            if (previousPolygon && previousPolygon !== target) {
                previousPolygon.set("active", false);
            }
            if (target.get("active")) {
                selectCountry(target.dataItem.get("id"));
                console.log(params.data, am5geodata_data_countries)
                setCountry(am5geodata_data_countries[target.dataItem.get("id")].country)
                setCapital(params.data[am5geodata_data_countries[target.dataItem.get("id")].country].capital)
                setPresident(params.data[am5geodata_data_countries[target.dataItem.get("id")].country].president)
                setOfficialLanguage(params.data[am5geodata_data_countries[target.dataItem.get("id")].country].officialLanguage)
                setPopulation(params.data[am5geodata_data_countries[target.dataItem.get("id")].country].population)
                setCurrency(params.data[am5geodata_data_countries[target.dataItem.get("id")].country].currency)
            }
            previousPolygon = target;
        });
        
        function selectCountry(id) {
            var dataItem = polygonSeries.getDataItemById(id);
            var target = dataItem.get("mapPolygon");
            if (target) {
            var centroid = target.geoCentroid();
            if (centroid) {
                chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            }
            }
        }
        
        chart.appear(1000, 100);
        });
  }, []);

  return <>
    <div id="container">
        <div id="country">
            <p>Country: {country}</p>
        </div>
        <div id="capital">
            <p>Capital: {capital}</p>
        </div>
        <div id="president">
            <p>Head of the government: {president}</p>
        </div>
        <div id="officialLanguage">
            <p>Official Language: {officialLanguage}</p>
        </div>
        <div id="population">
            <p>Population: {population}</p>
        </div>
        <div id="currency">
            <p>Currency: {currency}</p>
        </div>
    </div>
    </>;
}

export default Chart;
