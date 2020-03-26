import {
    ReactWidget
} from '@jupyterlab/apputils'

import {
    ISignal, Signal
} from '@lumino/signaling'

import React from 'react';

// The Weather data type defined as an interface
interface WeatherData {
    'Region': string,
    'Timezone': string,
    'Observation Time': string,
    'Temprature': string,
    'Wind Speed': string,
    'Wind Direction': string,
    'Pressure': string,
    'Precipitation': string,
    'Humidity': string
}

// React Component for Displaying Weather information
function MyComp(props: {
    'Region': string,
    'Timezone': string,
    'Observation Time': string,
    'Temprature': string,
    'Wind Speed': string,
    'Wind Direction': string,
    'Pressure': string,
    'Precipitation': string,
    'Humidity': string
}) {
    let child = [];
    for (let [key, value] of Object.entries(props)) {
        if (key !== 'weather_icons')
        child.push(<div><span>{key.replace('_', ' ')}</span>: {value}</div>);
    }
    return (
        <div>
            {child}
        </div>
    )
}

// Side Panel containing search form
export class SidePanel extends ReactWidget {
    state = {
        isLoading: false
    }

    private inputVal: string;
    private weatherData: WeatherData;
    // private comm: any;
    private _getData = new Signal<SidePanel, WeatherData>(this);

    constructor() {
        super();
        this.id = "sidepanel:id";
        this.title.label = "Weather Extension";
        this.inputVal = "";
        this.weatherData = undefined;
    }

    get onGetData(): ISignal<SidePanel, WeatherData> {
        return this._getData;
    }

    onInputChange(event: any): void {

        // update the value of text with each key change
        this.inputVal = event.target.value;

        // Update the Widget to pass props to Component
        this.update();
    }


    // function to fetch weather information on button click
    async onSubmit(): Promise<void> {
        this.state.isLoading = true;
        this.update();

        const resp = await fetch("http://api.weatherstack.com/current?access_key=d0ba0ed5de7d4333fa4bfd50c7bbedb1&query=" + this.inputVal);
        if (resp.ok) {
            
            const data = await resp.json();
            this.weatherData = ({} as WeatherData);

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
            }

            this.state.isLoading = false;

            // Send the weather data to the kernel
            // this.comm.send({ 'weather_data': this.weatherData });
            this._getData.emit(this.weatherData);

            // update the widget
            this.update();
        }

    }
 
    render() {
        return (
            <div className='my-apodWidget'>
                <h1>Weather Extension</h1>
                <form onSubmit={(e) => {
                        e.preventDefault();
                        this.onSubmit();
                    }}>    
                    <input type="text" placeholder='Enter Location' onChange={(event: any) => {
                        this.onInputChange(event);
                    }} />

                    <button type='submit'>Search</button>

                </form>
                { this.weatherData ? <MyComp {...this.weatherData} /> : (this.state.isLoading ? <div>Loading...</div> : '') }
            </div>
        )
    }

}