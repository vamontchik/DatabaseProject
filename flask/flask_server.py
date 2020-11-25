from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import mysql.connector
import time
import sys

from pymongo import MongoClient
from bson.json_util import loads, dumps

app = Flask("flask_server")
CORS(app)

client = None
db = None

# persistent database connection
# TODO: Need to close this connection at some point when the app stops running
#       vlad - not sure if we need this, tbh. we need the connection up the entire
#              runtime of the application. shutting down the docker container
#              seems to do this for us anyway.
cnx = None

###
### home route
###

@app.route('/', methods=['GET'])
def home():
    return make_response(jsonify({"message": "Welcome to the home page!"}), 200)

###
### utils
###

def verify_json_format(format_list, input_json, db_name_str):
    try:
        for key in format_list:
            val = input_json[key]
    except KeyError as e:
        error_msg = "Did not specify correct fields to uniquely identify a {} row.".format(db_name_str)
        return make_response(jsonify({"message": error_msg}), 400), False
    
    return None, True # success case


def connect_to_db():
    global cnx
    global client
    global db

    while cnx == None:
        try:
            cnx = mysql.connector.connect(user='root', password='example_pw', host='cs411project_mysql_1', database='course_db')
            print("[mySQL] Succesfully connected!")
        except mysql.connector.errors.InterfaceError as e:
            time.sleep(5)
            print("[mySQL] Failed to connect, re-attempting...")
    
    while client == None:
        try:
            client = MongoClient('mongodb://flask:flask_pw@cs411project_mongodb_1:27017/mongodb_cs411project?authSource=admin')
            db = client.mongodb_cs411project
            print("[mongo] Succesfully connected!")
        except Exception as e:
            time.sleep(5)
            print("[mongo] Failed to connect, re-attempting...")

###
### mongodb endpoints
###

@app.route('/read/mongodb', methods=['GET'])
def read_from_mongodb():
    # we need to wrap it in a list() call because
    # pymongo returns a cursor, so wrapping it
    # in a list forces pymongo to go through the cursor
    # and plop all the data into the list!
    res = list(db.keys.find())
    
    return make_response(dumps(res), 200)

@app.route('/create/mongodb', methods=['POST'])
def create_document_in_mongodb():
    if not request.is_json:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)

    # TODO: verify json info for mongodb? do we even need to...?

    req = request.get_json()

    return make_response(dumps(req), 200)

###
### /create endpoints
###


def execute_generic_insert_query(sql_query):
    try:
        cursor = cnx.cursor()
        cursor.execute(sql_request)
        cnx.commit()
        return make_response(jsonify({"message": "done"}), 200)
    except mysql.connector.Error as e:
        # NOTE: The finally clause will still run before this returns. (I think so at least)
        return make_response(jsonify({"message": "DB Error. Check the JSON fields you are suppyling."}), 400)
    finally:
        if cnx.is_connected():
            cursor.close()


def generic_create_endpoint(columns, string_fields, db_name_str):
    if not request.is_json:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)
    
    req = request.get_json()

    err_msg, success = verify_json_format(columns, req, db_name_str)
    if not success:
        return err_msg

    str_tuple_of_values = build_values_str_create(req, columns, string_fields)

    # NOTE:
    # INSERT INTO table_name
    # VALUES (value1, value2, value3, ...);
    sql_query = 'INSERT INTO {} VALUES ({});'.format(db_name_str, str_tuple_of_values)

    # NOTE: no return data from INSERT sql statements
    # NOTE: no response body for INSERT sql statements

    return execute_generic_insert_query(sql_query)


@app.route('/create/GradeDistribution', methods=['POST'])
def create_row_in_grade_distribution():
    columns = ['aPlus','a','aMinus','bPlus','b','bMinus','cPlus','c','cMinus','dPlus','d','dMinus','f','w','instructorName','subject','number']
    string_fields = {'instructorName', 'subject'}
    return generic_create_endpoint(columns, string_fields, 'GradeDistribution')


@app.route('/create/GenEd', methods=['POST'])
def create_row_in_gen_ed():
    columns = ['subject','number','ACP','CS','HUM','NAT','QR','SBS']
    string_fields = {'subject','number','ACP','CS','HUM','NAT','QR','SBS'}
    return generic_create_endpoint(columns, string_fields, 'GenEd')


@app.route('/create/Instructor', methods=['POST'])
def create_row_in_instructor():
    columns = ['instructorName', 'rating']
    string_fields = {'instructorName'}
    return generic_create_endpoint(columns, string_fields, 'Instructor')


@app.route('/create/CourseSection', methods=['POST'])
def create_row_in_course_section():
    columns = ['year','title','term','numStudents','avgGPA','number','subject','instructorName','description','creditHours']
    string_fields = {'title', 'term', 'subject', 'instructorName', 'description', 'creditHours'}
    return generic_create_endpoint(columns, string_fields, 'CourseSection')

###
### /read endpoints
###

def execute_generic_read_query(sql_query):
    try:
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(sql_query)
        rows = cursor.fetchall()
        response_body = rows # TODO: necessary? helps clarify there's no need to construct
                             #       the response_body, just pass up raw, but... still X)
        return make_response(jsonify(response_body), 200)
    except mysql.connector.Error as err:
        # This should never happen because the user never passes any input.
        # If this occurs, this means something on the server-side got messed up.
        response_body = {"message": "DB error."}
        return make_response(jsonify(response_body), 500)
    finally:
        if cnx.is_connected():
            cursor.close()

def generic_read_endpoint(db_name_str):
    sql_query = "SELECT * FROM {};".format(db_name_str)
    # NOTE : no json verify here becuase we don't need json input...
    return execute_generic_read_query(sql_query)


@app.route('/read/CourseSection', methods=['GET'])
def read_from_course_section():
    return generic_read_endpoint('CourseSection')


@app.route('/read/Instructor', methods=['GET'])
def read_from_instructor():
    return generic_read_endpoint('Instructor')


@app.route('/read/GenEd', methods=['GET'])
def read_from_gened():
    return generic_read_endpoint('GenEd')


@app.route('/read/GradeDistribution', methods=['GET'])
def read_from_grade_distribution():
    return generic_read_endpoint('GradeDistribution')

###
### /update endpoints
###

def build_values_str_update(req, string_fields):
    str_tuple_of_values = ''
    for index, key in enumerate(req):
        if key in string_fields:
            str_tuple_of_values += key + "= " + "'{}'".format(req[key])
        else:
            str_tuple_of_values += key + "= " + str(req[key])

        # always append a comma unless this is the last elem
        if index != (len(req) - 1):
            str_tuple_of_values += ', '
    return str_tuple_of_values


def build_conditional_str_update(req):
    number_value = str(req['number'])
    subject = "'{}'".format(req['subject'])
    instructor_name = "'{}'".format(req['instructorName'])
    return 'number= {0} AND subject= {1} AND instructorName= {2}'.format(number_value, subject, instructor_name)


def execute_generic_update_query(sql_query):
    try:
        cursor = cnx.cursor()
        cursor.execute(sql_query)
        cnx.commit()
        return make_response(jsonify({"message": "done"}), 200)
    except mysql.connector.Error as e:
        return make_response(jsonify({"message": "DB Error. Check the JSON fields you are suppyling."}), 400)
    finally:
        if cnx.is_connected():
            cursor.close()


def generic_update_endpoint(db_name_str, columns, string_fields):
    if not request.is_json:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)
    
    req = request.get_json()

    err_msg, success = verify_json_format(columns, req, db_name_str)
    if not success:
        return err_msg

    str_tuple_of_values = build_values_str_update(req, string_fields)
    conditional_str = build_conditional_str_update(req)

    # NOTE:
    # UPDATE table_name
    # SET column1 = value1, column2 = value2, ...
    # WHERE condition;
    sql_query = 'UPDATE {0} SET {1} WHERE {2};'.format(db_name_str, str_tuple_of_values, conditional_str)

    # NOTE: no result data returned from UPDATE sql statement

    return execute_generic_update_query(sql_query)


@app.route('/update/GradeDistribution', methods=['POST'])
def update_in_grade_distribution():
    columns = ['aPlus','a','aMinus','bPlus','b','bMinus','cPlus','c','cMinus','dPlus','d','dMinus','f','w','instructorName','subject','number']
    string_fields = {'instructorName', 'subject'}
    return generic_update_endpoint('GradeDistribution', columns, string_fields)


@app.route('/update/GenEd', methods=['POST'])
def update_in_gen_ed():
    columns = ['subject','number','ACP','CS','HUM','NAT','QR','SBS']
    string_fields = {'subject','number','ACP','CS','HUM','NAT','QR','SBS'}
    return generic_update_endpoint('GenEd', columns, string_fields)


@app.route('/update/Instructor', methods=['POST'])
def update_in_instructor():
    columns = ['instructorName', 'rating']
    string_fields = {'instructorName'}
    return generic_update_endpoint('Instructor', columns, string_fields)


@app.route("/update/CourseSection", methods=['POST'])
def update_in_course_section():
    columns = ['year','title','term','numStudents','avgGPA','number','subject','instructorName','description','creditHours']
    string_fields = {'title', 'term', 'subject', 'instructorName', 'description', 'creditHours'}
    return generic_update_endpoint('CourseSection', columns, string_fields)


###
### /delete endpoints
###

def build_conditional_str_delete(req):
    number_value = str(req['number'])
    subject = "'{}'".format(req['subject'])
    instructor_name = "'{}'".format(req['instructorName'])
    return 'number= {0} AND subject= {1} AND instructorName= {2}'.format(number_value, subject, instructor_name)


def execute_generic_delete_query(sql_query):
    try:
        cursor = cnx.cursor()
        cursor.execute(sql_query)
        cnx.commit()
        return make_response(jsonify({"message": "done"}), 200)
    except mysql.connector.Error as e:
        return make_response(jsonify({"message": "DB Error. Check the JSON fields you are suppyling."}), 400)
    finally:
        if cnx.is_connected():
            cursor.close()


def generic_delete_endpoint(db_name_str, columns):
    if not request.is_json:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)

    req = request.get_json()

    err_msg, success = verify_json_format(columns, req, db_name_str)
    if not success:
        return err_msg

    conditional_str = build_conditional_str_delete(req)

    # NOTE:
    # DELETE FROM table_name
    # WHERE condition;
    sql_query = 'DELETE FROM CourseSection WHERE {};'.format(conditional_str)

    # NOTE: no result data returned from UPDATE sql statement

    return execute_generic_delete_query(sql_query)


@app.route('/delete/CourseSection', methods=['DELETE'])
def delete_in_course_section():
    columns = ['number','subject','instructorName']
    return generic_delete_endpoint('CourseSection', columns)


@app.route('/delete/Instructor', methods=['DELETE'])
def delete_in_instructor():
    columns = ['instructorName']
    return generic_delete_endpoint('Instructor', columns)


@app.route('/delete/GenEd', methods=['DELETE'])
def delete_in_gened():
    columns = ['number','subject']
    return generic_delete_endpoint('GenEd', columns)


@app.route('/delete/GradeDistribution', methods=['DELETE'])
def delete_in_grade_distribution():
    columns = ['number','subject','instructorName']
    return generic_delete_endpoint('GradeDistribution', columns)


###
### /search endpoint
###

@app.route("/search/CourseSection", methods=['GET'])
def search_course_section():
    subject = request.args.get("subject")
    number = request.args.get("number")

    print(request.args, file=sys.stderr)

    if not subject or not number:
        return make_response(jsonify({"message": "Please specify both a subject and a number to search for a Course."}), 400)

    subject = str(subject)
    number = int(number)

    print(subject, file=sys.stderr)
    print(number, file=sys.stderr)

    sql_request = \
        "SELECT * FROM CourseSection WHERE subject='{0}' AND number={1};".format(subject, number)

    try:
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(sql_request)

        rows = cursor.fetchall()

        response_body = rows
        res = make_response(jsonify(response_body), 200)
        return res
        # NOTE: no result data returned from UPDATE sql statement
    except mysql.connector.Error as e:
        return make_response(jsonify({"message": "DB error. Plese try again."}), 400)
    finally:
        if cnx.is_connected():
            cursor.close()


if __name__ == '__main__':
    connect_to_db()
    app.run(host='0.0.0.0')
