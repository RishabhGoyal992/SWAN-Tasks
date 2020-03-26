import {
  ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette, MainAreaWidget, WidgetTracker
} from '@jupyterlab/apputils';

import {
  Message
} from '@lumino/messaging';

import {
  Widget
} from '@lumino/widgets';

class APODWidget extends Widget {
  /**
   * Construct a new APOD widget.
   */
  constructor() {
    super();

    this.addClass('my-apodWidget'); // new line

    // Add an header to the panel
    this.h1 = document.createElement('h1');
    this.h1.innerText = 'Weather Extension'
    this.node.appendChild(this.h1);

    // Add an form to the panel
    this.form = document.createElement('form');
    this.node.appendChild(this.form);

    // Add an text field to the panel
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Enter Location'
    this.form.appendChild(this.input);

    // Add an button element to the panel
    this.button = document.createElement('button');
    this.form.appendChild(this.button);

    // Add a summary element to the panel
    this.summary = document.createElement('div');
    this.node.appendChild(this.summary);
  }

  /**
   * The header associated with the widget.
   */
  readonly h1: HTMLHeadingElement;

  /**
   * The form associated with the widget.
   */
  readonly form: HTMLFormElement;

  /**
   * The text field associated with the widget.
   */
  readonly input: HTMLInputElement;

  /**
   * The button element associated with the widget.
   */
  readonly button: HTMLButtonElement;

  /**
   * The summary text element associated with the widget.
   */
  readonly summary: HTMLDivElement;

  /**
   * Handle update requests for the widget.
   */
  async onUpdateRequest(msg: Message): Promise<void> {

    const data = {
      buttonValue: 'Search',
      location: ''
    }

    this.button.innerText = data.buttonValue;
    this.button.type = 'submit';

    const getWeather = async () => {
      if (data.location === '') {
        this.summary.innerText = 'Please, enter a location!';
        return;
      }

      this.summary.innerText = 'Loading...';

      const response = await fetch(`http://api.weatherstack.com/current?access_key=446a8b613c51cebb33048499536e9a03&query=${data.location}`);

      const res = await response.json();

      if (res.success === false) {
        this.summary.innerText = res.error.info;
        return;
      }

      let reqData = {
        'Region': res.location.region,
        'Timezone': res.location.timezone_id,
        'Observation Time': res.current.observation_time,
        'Temprature': res.current.temprature + ' Celcius',
        'Wind Speed': res.current.wind_speed + ' km/h',
        'Wind Direction': res.current.wind_dir,
        'Pressure': res.current.pressure + ' MB',
        'Precipitation': res.current.precip + ' MM',
        'Humidity': res.current.humidity + ' %',
      }
      
      let summary = '';
      for (let [key, value] of Object.entries(reqData)) {
        if (key !== 'weather_icons')
        summary += `<div><span>${key.replace('_', ' ')}</span>: ${value}</div>`;
      }

      this.summary.innerHTML = summary;
    };

    this.form.onsubmit = (e) => {
      e.preventDefault();
      getWeather();
    };

    this.input.onchange = () => {
      data.location = this.input.value;
    }
  }
}


/**
 * Activate the APOD widget extension.
 */
function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension jupyterlab_apod is activated!');

  // Declare a widget variable
  let widget: MainAreaWidget<APODWidget>;

  // Add an application command
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Weather Extension',
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        const content = new APODWidget();
        widget = new MainAreaWidget({content});
        widget.id = 'weather-ext';
        widget.title.label = 'Weather Extension';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'left');
      }
      widget.content.update();

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: 'apod'
  });
  restorer.restore(tracker, {
    command,
    name: () => 'apod'
  });
}

/**
 * Initialization data for the weather extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'weather',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
