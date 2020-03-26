# Weather Extension for Jupyter Lab

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

## Install

```bash
jupyter labextension install .
```

## For Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` instead of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to weather_extension directory
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

### Uninstall

```bash
jupyter labextension uninstall weather_extension
```

# Resources

## Websites
- https://github.com/jupyterlab/jupyterlab - Source
- https://jupyterlab.readthedocs.io/en/latest/ - Documentation

