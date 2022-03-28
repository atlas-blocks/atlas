#!/usr/bin/python3

import sys
import json
import cgi
from sympy import *
from sympy.parsing.latex import parse_latex

result = {}

try:
    fs = cgi.FieldStorage()
    sys.stdout.write("Content-Type: application/json\n\n")
    in_latex = fs.getvalue('in_latex')

    expr = parse_latex(in_latex)
    simple = trigsimp(expr.doit())
    result['success'] = True
    result['out'] = str(simple)
    # result['out_sympy'] = str(expr)

except Exception as e:
    result['error'] = str(e)
    result['success'] = False

print(json.dumps(result, indent=1))
