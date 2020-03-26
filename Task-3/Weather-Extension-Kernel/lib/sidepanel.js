import { ReactWidget } from '@jupyterlab/apputils';
import { Signal } from '@lumino/signaling';
import React from 'react';
// React Component for Displaying Weather information
function MyComp(props) {
    let child = [];
    for (let [key, value] of Object.entries(props)) {
        if (key !== 'weather_icons')
            child.push(React.createElement("div", null,
                React.createElement("span", null, key.replace('_', ' ')),
                ": ",
                value));
    }
    return (React.createElement("div", null, child));
}
// Side Panel containing search form
export class SidePanel extends ReactWidget {
    constructor() {
        super();
        this.state = {
            isLoading: false
        };
        // private comm: any;
        this._getData = new Signal(this);
        this.id = "sidepanel:id";
        this.title.label = "Weather Extension";
        this.inputVal = "";
        this.weatherData = undefined;
    }
    get onGetData() {
        return this._getData;
    }
    onInputChange(event) {
        // update the value of text with each key change
        this.inputVal = event.target.value;
        // Update the Widget to pass props to Component
        this.update();
    }
    // function to fetch weather information on button click
    async onSubmit() {
        this.state.isLoading = true;
        this.update();
        const resp = await fetch("http://api.weatherstack.com/current?access_key=d0ba0ed5de7d4333fa4bfd50c7bbedb1&query=" + this.inputVal);
        if (resp.ok) {
            const data = await resp.json();
            this.weatherData = {};
            this.weatherData = {
                'Region': data.location.region,
                'Timezone': data.location.timezone_id,
                'Observation Time': data.current.observation_time,
                'Temprature': data.current.temperature + ' Celcius',
                'Wind Speed': data.current.wind_speed + ' km/h',
                'Wind Direction': data.current.wind_dir,
                'Pressure': data.current.pressure + ' MB',
                'Precipitation': data.current.precip + ' MM',
                'Humidity': data.current.humidity + ' %',
            };
            this.state.isLoading = false;
            // Send the weather data to the kernel
            // this.comm.send({ 'weather_data': this.weatherData });
            this._getData.emit(this.weatherData);
            // update the widget
            this.update();
        }
    }
    render() {
        return (React.createElement("div", { className: 'my-apodWidget' },
            React.createElement("h1", null, "Weather Extension"),
            React.createElement("form", { onSubmit: (e) => {
                    e.preventDefault();
                    this.onSubmit();
                } },
                React.createElement("input", { type: "text", placeholder: 'Enter Location', onChange: (event) => {
                        this.onInputChange(event);
                    } }),
                React.createElement("button", { type: 'submit' }, "Search")),
            this.weatherData ? React.createElement(MyComp, Object.assign({}, this.weatherData)) : (this.state.isLoading ? React.createElement("div", null, "Loading...") : '')));
    }
}
