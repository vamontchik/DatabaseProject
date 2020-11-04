from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import mysql.connector

app = Flask("flask_server")
CORS(app)


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

#persistent database connection
#TODO Need to close this connection at some point when the app stops running
cnx = None

@app.route('/create/CourseSection', methods=['POST'])  # create endpoint for demo
def create_row_in_course_table():
    if request.is_json:
        req = request.get_json()
        string_fields = {'title', 'term', 'subject', 'instructorName', 'description', 'creditHours'}

        #right now the way I am wrapping strings in single quotes is bad
        #there's a better way to do it but I have to start doing CS 374
        #do not stare too long at this disaster
        str_tuple_of_values = ""

        #join values together with the appropriate formatting for string and non-string fields
        for index, key in enumerate(req):
            if key in string_fields:
                str_tuple_of_values += "'{}'".format(req[key])
            else:
                str_tuple_of_values += str(req[key])

            #always append a comma unless this is the last elem
            if index != (len(req) - 1):
                str_tuple_of_values += ', '


        # INSERT INTO table_name
        # VALUES (value1, value2, value3, ...);
        sql_request = 'INSERT INTO CourseSection VALUES ({});'.format(str_tuple_of_values)

        # NOTE: no return data from INSERT sql statements

        try:
            cursor = cnx.cursor()
            cursor.execute(sql_request)
            cnx.commit()
            # NOTE: no return data from INSERT sql statements
        except mysql.connector.Error as e:
            #note: The finally clause will still run before this returns. (I think so at least)
            return make_response(jsonify({"message": "DB Error. Check the JSON fields you are suppyling."}), 400)
        finally:
            if cnx.is_connected():
                cursor.close()

        # NOTE: no response body for INSERT sql statements

        return make_response(jsonify({"message": "done"}), 200)
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)


@app.route('/read/CourseSection', methods=['GET'])  # read endpoint for demo
def read_from_course_section():
    #Attempt to read all rows from CourseSection table
    try:
        cursor = cnx.cursor(dictionary=True)
        cursor.execute("SELECT * FROM CourseSection;")

        rows = cursor.fetchall()

        # TODO: parse req and do sql executions with connection to database
        response_body = rows
        res = make_response(jsonify(response_body), 200)
        return res
    except mysql.connector.Error as err:
        #This should never happend because the user never passes any input
        #If this occurs, this means something on the server-side got messed up
        response_body = {
            "message": "DB error."
        }
        res = make_response(jsonify(response_body), 500)
        return res
    finally:
        if cnx.is_connected():
            cursor.close()


@app.route("/update/CourseSection", methods=['POST'])  # update endpoint for demo
def update_in_course_section():
    if request.is_json:
        req = request.get_json()
        string_fields = {'title', 'term', 'subject', 'instructorName', 'description', 'creditHours'}

        #build set value string
        str_tuple_of_values = ''

        for index, key in enumerate(req):
            if key in string_fields:
                str_tuple_of_values += key + "= " + "'{}'".format(req[key])
            else:
                str_tuple_of_values += key + "= " + str(req[key])

            #always append a comma unless this is the last elem
            if index != (len(req) - 1):
                str_tuple_of_values += ', '

        try:
            number_value = str(req['number'])
            subject = "'{}'".format(req['subject'])
            instructor_name = "'{}'".format(req['instructorName'])
        except KeyError as e:
            return make_response(jsonify({"message": "Did not specify enough fields to uniquely identify a Course Section row."}), 400)

        conditional_str = 'number= {0} AND subject= {1} AND instructorName= {2}'.format(
            number_value, subject, instructor_name
        )

        # UPDATE table_name
        # SET column1 = value1, column2 = value2, ...
        # WHERE condition;
        sql_request = \
            'UPDATE CourseSection SET {0} WHERE {1};'.format(str_tuple_of_values, conditional_str)

        # NOTE: no result data returned from UPDATE sql statement

        try:
            cursor = cnx.cursor()
            cursor.execute(sql_request)
            cnx.commit()
            # NOTE: no result data returned from UPDATE sql statement
        except mysql.connector.Error as e:
            return make_response(jsonify({"message": "DB Error. Check the JSON fields you are suppyling."}), 400)
        finally:
            if cnx.is_connected():
                cursor.close()

        res = make_response(jsonify({"message": "done"}), 200)

        return res
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)


@app.route("/delete/CourseSection", methods=['DELETE'])  # delete endpoint for demo
def delete_in_course_section():
    if request.is_json:
        req = request.get_json()

        try :
            number_value = str(req['number'])
            subject = "'{}'".format(req['subject'])
            instructor_name = "'{}'".format(req['instructorName'])
            conditional_str = 'number= {0} AND subject= {1} AND instructorName= {2}'.format(
                number_value, subject, instructor_name
            )
        except KeyError as e:
            return make_response(jsonify({"message": "Failed to specify enough fields for unique identification of Course Section item."}), 400)

        # DELETE FROM table_name
        # WHERE condition;
        sql_request = \
            'DELETE FROM CourseSection WHERE {};'.format(conditional_str)

        # NOTE: no result data returned from UPDATE sql statement

        try:
            cursor = cnx.cursor()
            cursor.execute(sql_request)
            cnx.commit()
            # NOTE: no result data returned from UPDATE sql statement
        except mysql.connector.Error as e:
            return make_response(jsonify({"message": "DB Error. Check the JSON fields you are suppyling."}), 400)
        finally:
            if cnx.is_connected():
                cursor.close()

        res = make_response(jsonify({"message": "done"}), 200)
        return res
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)


def connect_to_db():
    global cnx
    cnx = mysql.connector.connect(user='root', password='example_pw', host='cs411project_mysql_1', database='course_db')

# @app.route("/")  # search endpoint for demo

# ???

# @app.route("/")  # complex query one for demo

# ???

# @app.route("/")  # complex query two for demo
# ???

# def connect_to_db():
#     global cnx
#     cnx = mysql.connector.connect(user='', password='', host='127.0.0.1', database='')


if __name__ == '__main__':
    connect_to_db()
    app.run(host='0.0.0.0')
