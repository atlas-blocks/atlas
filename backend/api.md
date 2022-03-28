# Elements API:

## HTTP

- `GET /api/simplify`
  Simplify –– simplify expression.
  Request body:
  ```json
  {
      "latex": "<latex string>"
  }
  ```
  Response body:
  ```json
  {
      "success": true,
      "latex": "<latex string>",
      "error": "error message if any"
  }
  ```

2. Test Equal -- [el_equal.py]
Function: Tests the inputs if they are equal by testing few random numbers.
In1: latex
In2: latex
Out: Bool
Parameters: no
API: 
POST {"in_latex1": latex, "in_latex2": latex}
RESPONSE {"out": bool, "success": true/false, "error": error if any}

3. Constant [el_constant.py]
Function: Gives a constant with arbitrary precision.
In: no
Out: Float
Parameters: 
[Constant (dropdown): pi, degree, e, phi, euler, catalan, apery, khinchin, glaisher, mertens, twinprime]
[Precision: int number]
API: 
POST {"constant": string (one from the list), "precision": string (int number)}
RESPONSE {"out": string, "success": true/false, "error": error if any}


4. Evaluate
Function: Evaluates an expression. Evaluates numbers or use substitute subexpression with a number
In1: latex
In2: latex (expression to substitute)
In3: latex (substitution)
Out: latex
Parameters:
API: 
POST {"in_latex": latex, "in_expr": latex, "in_subs": latex}
RESPONSE {"out": string, "success": true/false, "error": error if any}


