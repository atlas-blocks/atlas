FROM jupyter/datascience-notebook AS dev
COPY . /home/jovyan/work 
RUN julia -E 'using Pkg; Pkg.activate("./work"); Pkg.add(url="https://github.com/atlas-blocks/AtlasUtils.jl"); Pkg.instantiate(); Pkg.precompile();'

CMD start.sh jupyter notebook --NotebookApp.token=''

FROM dev AS prod

