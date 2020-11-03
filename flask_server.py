from flask import Flask, request, jsonify, make_response
import mysql.connector

app = Flask("flask_server")


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

@app.route('/test')
def test():
    # a = ('a', 123123, 123.4232)
    b = [('a', 123123, 123.4232), ('b', 3333, -23.23)]

    return make_response(jsonify(b), 200)


@app.route('/create/Course_Section', methods=['POST'])  # create endpoint for demo
def create_row_in_course_table():
    if request.is_json:
        req = request.get_json()

        str_tuple_of_values = ','.join([
            req['Year'], req['Title'], req['Term'], req['Num_Students'],
            req['Avg_GPA'], req['Number'], req['Subject'], req['Instructor_Name'],
            req['Credit_Hours'], req['Description']
        ])

        # INSERT INTO table_name
        # VALUES (value1, value2, value3, ...);
        sql_request = 'INSERT INTO Course_Section VALUES ({0});'.format(str_tuple_of_values)

        # NOTE: no return data from INSERT sql statements

        try:
            connection = mysql.connector.connect(user='', password='', host='127.0.0.1', database='')
            cursor = connection.cursor()
            cursor.execute(sql_request)
            # NOTE: no return data from INSERT sql statements
        except mysql.connector.Error as e:
            print("Error: {0}".format(e))
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        # NOTE: no response body for INSERT sql statements

        return make_response(jsonify({"message": "done"}), 200)
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)


@app.route('/read/Course_Section', methods=['GET'])  # read endpoint for demo
def read_from_course_section():
    if request.is_json:
        req = request.get_json()

        str_tuple_of_values = ','.join([
            req['Year'], req['Title'], req['Term'], req['Num_Students'],
            req['Avg_GPA'], req['Number'], req['Subject'], req['Instructor_Name'],
            req['Credit_Hours'], req['Description']
        ])

        # SELECT *
        # FROM table_name;
        sql_request = 'SELECT * FROM Course_Section;'.format(str_tuple_of_values)

        result_data = []

        try:
            connection = mysql.connector.connect(user='', password='', host='127.0.0.1', database='')
            cursor = connection.cursor()
            cursor.execute(sql_request)
            result_data = cursor.fetchall()
        except mysql.connector.Error as e:
            print("Error: {0}".format(e))
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        res = make_response(jsonify(result_data), 200)

        return res
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)


@app.route("/update/Course_Section", methods=['POST'])  # update endpoint for demo
def update_in_course_section():
    if request.is_json:
        req = request.get_json()

        set_values_str = ''
        column_names = \
            ['Year', 'Title', 'Term', 'Num_Students', 'Avg_GPA', 'Number',
             'Subject', 'Instructor_Name', 'Credit_Hours', 'Description']
        for column_name in column_names:
            set_values_str += column_name + '= ' + str(req[column_name])

        number_value = req['Number']
        subject = req['Subject']
        instructor_name = req['Instructor_Name']
        conditional_str = 'Number= {0}, Subject= {1}, Instructor_Name= {2}'.format(
            number_value, subject, instructor_name
        )

        # UPDATE table_name
        # SET column1 = value1, column2 = value2, ...
        # WHERE condition;
        sql_request = \
            'UPDATE Course_Section SET {0} WHERE {1};'.format(set_values_str, conditional_str)

        # NOTE: no result data returned from UPDATE sql statement

        try:
            connection = mysql.connector.connect(user='', password='', host='127.0.0.1', database='')
            cursor = connection.cursor()
            cursor.execute(sql_request)
            # NOTE: no result data returned from UPDATE sql statement
        except mysql.connector.Error as e:
            print("Error: {0}".format(e))
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        res = make_response(jsonify({"message": "done"}), 200)

        return res
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)


@app.route("/delete/Course_Section", methods=['DELETE'])  # delete endpoint for demo
def delete_in_course_section():
    if request.is_json:
        req = request.get_json()

        number_value = req['Number']
        subject = req['Subject']
        instructor_name = req['Instructor_Name']
        conditional_str = 'Number= {0}, Subject= {1}, Instructor_Name= {2}'.format(
            number_value, subject, instructor_name
        )

        # DELETE FROM table_name
        # WHERE condition;
        sql_request = \
            'DELETE FROM Course_Section WHERE {0};'.format(conditional_str)

        # NOTE: no result data returned from UPDATE sql statement

        try:
            connection = mysql.connector.connect(user='', password='', host='127.0.0.1', database='')
            cursor = connection.cursor()
            cursor.execute(sql_request)
            # NOTE: no result data returned from UPDATE sql statement
        except mysql.connector.Error as e:
            print("Error: {0}".format(e))
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

        res = make_response(jsonify({"message": "done"}), 200)

        return res
    else:
        return make_response(jsonify({"message": "Request body must be JSON"}), 400)


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
    app.run()
