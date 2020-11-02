from flask import Flask, request, jsonify, make_response
import mysql.connector

app = Flask("flask_server")

# /           --- []         home
# /create     --- [POST]     add row(s) of data to a table
# /read       --- [GET]      get row(s) of data from a table
# /update     --- [POST]     update row(s) of data in a table
# /delete     --- [DELETE]   delete row(s) of data in a table

# generic format of each endpoint:
# if request.is_json:
#     req = request.get_json()
#     # TODO: parse req and do sql executions with connection to database
#     response_body = {
#         # TODO: construct response body for react
#     }
#     res = make_response(jsonify(response_body), 200)
#     return res
# else:
#     return make_response(jsonify({"message": "Request body must be JSON"}), 400)

cnx = 0  # TODO: why does Python make it so you can't just declare global variables?
         #       going to have to rely on Python's dynamic typing instead...


@app.route("/")
def home():
    return "Hello, world!"


@app.route("/create", methods=["POST"])
def get_all_rows():
    pass # TODO: impl


@app.route("/read", methods=["GET"])
def create_endpoint():
    pass # TODO: impl


@app.route("/add", methods=["POST"])
def add_endpoint():
    pass # TODO: impl


@app.route("/delete", methods=["DELETE"])
def delete_endpoint():
    pass # TODO: impl


def connect_to_db():
    global cnx
    cnx = mysql.connector.connect(user='', password='', host='127.0.0.1', database='')


if __name__ == '__main__':
    connect_to_db()
    app.run()
