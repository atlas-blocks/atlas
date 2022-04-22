# Atlas

## Installing
```zsh
$ git clone git@github.com:atlas-blocks/atlas.git
```
Also, you'll need to install Docker.
- Wndows, macOS: [Docker Desctop](https://www.docker.com/products/docker-desktop/)
- Linux: you should know what to do :)


## Running

### Development
```zsh
$ make dev
```
It may take a bit of time, since `Julia` has pretty slow precompiling speed. 
 - When you will be updating the frontend everything should be updating automatically (you don't need to restart docker conatiner). 
 - When updating `Julia`'s backend sometimes it will be able to recompile, but sometimes you will have to restart the whole thing...

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

julia>]  # type ]
(@v1.7) pkg> activate .  # activate current environment
(AtlasGraph) pkg> test  # it will run all the tests
```
