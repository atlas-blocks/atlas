FROM jupyter/datascience-notebook:ubuntu-20.04 AS dev
COPY . /home/jovyan/work 
RUN julia -E 'using Pkg; Pkg.activate("./work"); Pkg.add(url="https://github.com/atlas-blocks/AtlasUtils.jl"); Pkg.instantiate(); Pkg.precompile();'

CMD start.sh jupyter notebook --NotebookApp.token=''

FROM dev AS prod

