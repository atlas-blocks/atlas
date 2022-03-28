import sys
import json
import argparse


def simplify_latex_formula(latex):
    return latex + " simplified"


def handle_simplify_request():
    try:
        parser = argparse.ArgumentParser()
        parser.add_argument('--latex', type=str)
        args = parser.parse_args()

        in_latex = args.latex
        response = {"success": True, "latex": simplify_latex_formula(in_latex)}

    except Exception as e:
        response = {"success": False, "error": str(e)}

    print(json.dumps(response))
    sys.stdout.flush()


if __name__ == "__main__":
    handle_simplify_request()
