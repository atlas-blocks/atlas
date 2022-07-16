FROM jupyter/datascience-notebook AS dev
CMD start.sh jupyter notebook --NotebookApp.token=''
RUN julia -E 'using Pkg; Pkg.add(url="https://github.com/atlas-blocks/AtlasUtils.jl")'

FROM dev AS prod

