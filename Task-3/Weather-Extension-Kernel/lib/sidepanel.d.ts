/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { ISignal } from '@lumino/signaling';
interface WeatherData {
    'Region': string;
    'Timezone': string;
    'Observation Time': string;
    'Temprature': string;
    'Wind Speed': string;
    'Wind Direction': string;
    'Pressure': string;
    'Precipitation': string;
    'Humidity': string;
}
export declare class SidePanel extends ReactWidget {
    state: {
        isLoading: boolean;
    };
    private inputVal;
    private weatherData;
    private _getData;
    constructor();
    get onGetData(): ISignal<SidePanel, WeatherData>;
    onInputChange(event: any): void;
    onSubmit(): Promise<void>;
    render(): JSX.Element;
}
export {};
