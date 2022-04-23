# Atlas

## Table of Content
1. [About The Project](#about-the-project)
   - [About Us](#about-us)
   - [The Problems Atlas Solves](#the-problems-atlas-solves)
   - [The Target Audience](#the-target-audience)
   - [Project Structure](#project-structure)
1. [Installing](#installing)
1. [Running](#running)
   - [Development](#development)
   - [Production](#production)
1. [Testing](#testing)
   - [Backend](#backend)

## About The Project

### About Us
We (2.5 folks) are a young but crazy ambitious startup "Atlas". In short, we are planning to create a better MATLAB. 

We are doing an interface where you can create complex formulas and models using blocks. You can put your mathematical formulas inside blocks and reference other blocks to create compound expressions. And, of course, you can define your functions and classes and use them. 

### The Problems Atlas Solves
- Do you remember writing a long implication or equivalence chain and losing "-1" or "2" somewhere? And then spending precious time finding it...\
  Worry not! Atlas (much like IntelliJ) have static checks and warnings. It will automatically find and point out possible mistakes. 
- Imagine writing on paper a long ducking equation with a lot of rewriting and duplicating.\
  Say no more! In Atlas, you can split expressions into blocks and use references!
- You want to visualise the equation you just evaluated?\
  Just drug a Graph block, and it will create the plot for you!
- Matlab is old and ridiculously slow if you are during some serious calculations. My friend spent an hour plotting a single graph while writing his PhD paper! And another accountancy of mine had spent one month waiting for his animation of his aerodynamic model to execute (no joke).\
  In Atlas, you can easily buy server power, and we will evaluate your model on our powerful machines in a blink of a second!
- Matlab Simulink is the thing engineers use **a lot** for creating different models like electric schemas or thermal cycle of a house with radiators. So Simulink doesn't have much flexibility, and there is elephant-sized room for improvement!

### The Target Audience
- All schoolers and students that are doing math and physics-related studies.
- Big research companies (where the real money is) and independent researchers.


### Project Structure
- Frontend is done using `React` (with `Next`) + `Typescript`.
- Backend is written in `Julia` using the Genie framework.
- Maybe we will add a python (`Flask` or `Django`) service for user management and stuff like this.
- `Nginx` reverse-proxy allows different services to interact with each other.



## Installing
```zsh
$ git clone git@github.com:atlas-blocks/atlas.git
```
Also, you'll need to install `Docker`.
- Windows, macOS: [Docker Desctop](https://www.docker.com/products/docker-desktop/)
- Linux: you should know [what to do :)](https://docs.docker.com/engine/install/ubuntu/)


## Running

### Development
```zsh
$ make dev
```
It may take some time since `Julia` has a pretty slow precompiling speed. 
 - When you update the frontend, everything should update automatically (you don't need to restart the docker container). 
 - When updating `Julia`'s backend, sometimes it will be able to recompile, but sometimes you will have to restart the whole thing...

The server will be available on the http://localhost:8080/document.

### Production
```zsh
$ make prod
```

## Testing

### Backend

You can find the tests in the `test/` folder. You can run them this way:
```zsh
$ cd backend/AtlasBackend/AtlasGraph  # go to the folder
$ julia  # switch to the julia REPL

julia>]  # just type ], it will switch the context automatically
(@v1.7) pkg> activate .  # activate current environment
(AtlasGraph) pkg> test  # it will run all the tests
```
