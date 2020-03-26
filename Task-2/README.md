# Weather Extension for Jupyter Lab

A packaged JupyterLab extension ready to be installed, which provides the functionality of obtaining weather data of the world cities.

## Requirements

* JupyterLab 2.0

## Procedure for the installtion

1. Make sure you have Conda installed in your system if not install it from [here](https://docs.conda.io/projects/conda/en/latest/user-guide/install/).

2. Create a Conda environment in your respective machine with the following command:

```bash
conda create -n jupyterlab-ext --override-channels --strict-channel-priority -c conda-forge -c jupyterlab cookiecutter nodejs
conda activate jupyterlab-ext
```

3. Change the working Directory to the folder containing the product (here for example Weather-Extension).
```bash
cd Weather-Extension
jupyter labextension install .
```

