from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import mysql.connector
import time
import sys
from enum import Enum
from pymongo import MongoClient
from bson.json_util import loads, dumps
from bson.objectid import ObjectId

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
    except Exception as e:
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
def executeGenericGenQuery(criteria_json, priority_val):
    #string for filtering out classes below GPA requirement
    gpa_filter_string = " WHERE c.avgGPA >= {}".format(criteria_json["minAvgGpa"])

    # holds all string of the form: A=B that we need to filter for specific GenEd proprties
    gened_filter_strings = []
    for key, value in criteria_json.items():
        if key != "priority" and key != "minAvgGpa" and value != 0:
            column_name, column_val = key.split("_")
            gened_filter_strings.append("{}{}='{}'".format("ge.", column_name, column_val))

    # string containing all the filters
    concat_gened_string = " AND (" if len(gened_filter_strings) > 0 else ""
    for index, item in enumerate(gened_filter_strings):
        concat_gened_string += item

        #apppend an or if this isn't the last item
        if index != len(gened_filter_strings) - 1:
            concat_gened_string += " OR "
        else:
            concat_gened_string += ")"

    # Order by Likes or GPA depending on priority
    order_by_string = " ORDER BY c.avgGPA DESC;" if priority_val == PriorityType.MaxGPA else " ORDER BY c.likes DESC;"

    base_query = '''
        SELECT *
        FROM CourseSection c
        JOIN GradeDistribution g ON c.instructorName = g.instructorName AND c.subject = g.subject AND c.number = g.number
        JOIN Instructor i ON c.instructorName = i.instructorName
        JOIN GenEd ge ON c.subject = ge.subject AND c.number = ge.number
    '''

    query_with_filters = base_query + gpa_filter_string + concat_gened_string + order_by_string

    try:
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(query_with_filters)
        rows = cursor.fetchall()
        cnx.commit()
        return rows
    except mysql.connector.Error as e:
        print(e)
        # NOTE: The finally clause will still run before this returns. (I think so at least)
        return None
    finally:
        if cnx.is_connected():
            cursor.close()

#utility function for calculating the total number of requirement courses we need to find
def calcReqSum(criteria_json):
    gened_keys = [
        'ACP_ACP',
        'CS_NW','CS_US','CS_WCC',
        'HUM_HP','HUM_LA',
        'NAT_LS','NAT_PS',
        'QR_QR1','QR_QR2',
        'SBS_BSC','SBS_SS',
    ]

    req_sum = 0

    for key in gened_keys:
        req_sum += criteria_json[key]

    return req_sum


#utility function for seeing how many reqs this course fills (reqs are speicifed in criteria_json)
#decrements value if course meets a criteria

#The should_edit flag specifies if we should change the values in criteria_json or not
#This isn't the best way to do this, but again we're crunched for timeeeee
def numMatchingReqs(criteria_json, course, should_edit):
    gened_keys = [
        'ACP_ACP',
        'CS_NW','CS_US','CS_WCC',
        'HUM_HP','HUM_LA',
        'NAT_LS','NAT_PS',
        'QR_QR1','QR_QR2',
        'SBS_BSC','SBS_SS',
    ]

    num_matches = 0

    for key in gened_keys:
        if criteria_json[key] > 0:
            corresponding_key, corresponding_value = key.split("_")

            if course[corresponding_key] == corresponding_value:
                num_matches += 1

                if should_edit:
                    criteria_json[key] -= 1

    return num_matches

# Approximate algorithm for maximizing the number of courses chosen
# to fulfill a set of schedule requirements
def maxCoursesGen(criteria_json):
    rows = executeGenericGenQuery(criteria_json, PriorityType.MinCredHrs)

    if rows == None:
        return None

    #This is approximate
    #At every decision point, this algorithm chooses the course that
    #matches the smallest number requirements (its a greedy algorithm)
    num_reqs = calcReqSum(criteria_json)
    #print("NUMBER OF REQS: {}".format(num_reqs))
    reqs_filled = 0
    schedule = []

    while reqs_filled < num_reqs:
        best_index = -1
        best_item = None
        best_score = float('inf') #<--- this is gross, but python doesn't have a way tor represent infinite integers

        for index, row in enumerate(rows):
            num_matching_reqs = numMatchingReqs(criteria_json, row, should_edit=False)

            if num_matching_reqs > 0 and num_matching_reqs < best_score:
                best_index = index
                best_item = row
                best_score = num_matching_reqs

        #case where we can no longer find matching courses, so return an error (no solution)
        if best_score == 0:
            return None

        #update requirement dict to reflect filling of requirements
        #print(criteria_json)
        numMatchingReqs(criteria_json, best_item, should_edit=True)
        #print(criteria_json)
        #print(best_score)
        #print(best_item)
        #add this best item to the schedule
        schedule.append(rows.pop(best_index))
        #update the number of reqs cause we just filled some
        reqs_filled += best_score

    #return the schedule we created
    return schedule

# Approximate algorithm for minimizing the number of courses chosen
# to fulfill a set of schedule requirements
def minCoursesGen(criteria_json):
    rows = executeGenericGenQuery(criteria_json, PriorityType.MinCredHrs)

    if rows == None:
        return None

    #This is approximate
    #At every decision point, this algorithm chooses the course that
    #matches the largest number requirements (its a greedy algorithm)
    num_reqs = calcReqSum(criteria_json)
    reqs_filled = 0
    schedule = []

    while reqs_filled < num_reqs:
        best_index = -1
        best_item = None
        best_score = 0

        for index, row in enumerate(rows):
            num_matching_reqs = numMatchingReqs(criteria_json, row, should_edit=False)

            if num_matching_reqs > best_score:
                best_index = index
                best_item = row
                best_score = num_matching_reqs

        #case where we can no longer find matching courses, so return an error (no solution)
        if best_score == 0:
            return None
        #update requirement dict to reflect filling of requirements
        numMatchingReqs(criteria_json, best_item, should_edit=True)
        #add this best item to the schedule
        schedule.append(rows.pop(best_index))
        #update the number of reqs cause we just filled some
        reqs_filled += best_score

    #return the schedule we created
    return schedule

# strategy: ?
def maxGPAGen(criteria_json):
    rows = executeGenericGenQuery(criteria_json, PriorityType.MaxGPA)

    if rows == None:
        return None

    #Maximize the average GPA of all the courses selected for the schedule
    #This solution is approximate
    num_reqs = calcReqSum(criteria_json)
    reqs_filled = 0
    schedule = []

    for row in rows:
        #terminate early if all reqs are filled
        if reqs_filled >= num_reqs:
            return schedule

        num_matching_reqs = numMatchingReqs(criteria_json, row, should_edit=True)

        if num_matching_reqs > 0:
            reqs_filled += num_matching_reqs
            schedule.append(row)

    #case where we couldn't make a schedule given the constraints
    return None

#TODO: I COPY PASTED THIS CODE FROM THE METHOD ABOVE. THAT'S NOT GOOD. SHOULD CONSOLIDATE THE CODE
#FOR BOTH METHODS INTO ONE METHOD
def maxLikesGen(criteria_json):
    rows = executeGenericGenQuery(criteria_json, PriorityType.MaxLikes)

    if rows == None:
        return None

    #Maximize the number of likes of all the courses selected for the schedule
    #This solution is approximate
    num_reqs = calcReqSum(criteria_json)
    reqs_filled = 0
    schedule = []

    for row in rows:
        #terminate early if all reqs are filled
        if reqs_filled >= num_reqs:
            return schedule

        num_matching_reqs = numMatchingReqs(criteria_json, row, should_edit=True)

        if num_matching_reqs > 0:
            reqs_filled += num_matching_reqs
            schedule.append(row)

    #case where we couldn't make a schedule given the constraints
    return None

class PriorityType(Enum):
    MaxCredHrs = 1,
    MinCredHrs = 2,
    MaxGPA = 3,
    MaxLikes = 4,
    Unknown = 5

def parseGen(parse_str):
    if parse_str == 'Maximize GPA':
        return PriorityType.MaxGPA
    if parse_str == 'Maximize Unique Courses':
        return PriorityType.MaxCredHrs
    if parse_str == 'Minimize Unique Courses':
        return PriorityType.MinCredHrs
    if parse_str == 'Maximize Favorability':
        return PriorityType.MaxLikes

    return PriorityType.Unknown

@app.route('/schedule/mongodb', methods=['POST'])
def schedule_gen():
    if not request.is_json:
        return make_response(jsonify({'message': 'Request body must be JSON'}), 400)

    criteria = request.get_json()

    print(criteria)

    format_list = [
        'ACP_ACP',
        'CS_NW','CS_US','CS_WCC',
        'HUM_HP','HUM_LA',
        'NAT_LS','NAT_PS',
        'QR_QR1','QR_QR2',
        'SBS_BSC','SBS_SS',
        'minAvgGpa',
        'priority'
    ]
    err_msg, success = verify_json_format(format_list, criteria, 'schedule gen')
    if not success:
        return err_msg

    schedule = None

    typeOfGen = parseGen(criteria['priority'])
    if typeOfGen == PriorityType.MaxCredHrs:
        schedule = maxCoursesGen(criteria)
    if typeOfGen == PriorityType.MinCredHrs:
        schedule = minCoursesGen(criteria)
    if typeOfGen == PriorityType.MaxGPA:
        schedule = maxGPAGen(criteria)
    if typeOfGen == PriorityType.MaxLikes:
        schedule = maxLikesGen(criteria)
    if typeOfGen == PriorityType.Unknown:
        print("unknown priority")
        err_msg = 'unknown priority'
        err_json = jsonify({'message':err_msg})
        return make_response(err_json, 400)

    #attempts to create schedule in db and returns the oid of the new document
    return _create_document_in_mongodb(schedule)


#TODO This is a copy of the create_document_in_mongodb method that Vlad made.
#I modified it slightly so that a list of schedules can be passed internally
#(user does not need to make a request)
#also we should be guaranteed that this method is taking in a list of dictionaries
#so I took out some of the type checking
#This isn't made to replace the create_document_in_mongodb method that Vlad made
#It's just for internal use with the schedule generation methods
def _create_document_in_mongodb(schedule):
    if schedule == None:
        return make_response(jsonify({'message': 'Unable to generate a schedule given the constraints supplied. Try other constraints.'}), 400)

    format_list_inner = ['instructorName', 'subject', 'number']
    list_of_constructed = []
    for class_json_obj in schedule:
        err_msg, success = verify_json_format(format_list_inner, class_json_obj, 'mongodb')
        if not success:
            return err_msg

        # construct json object to contain ONLY primary keys
        constructed = {}
        for item in format_list_inner:
            constructed[item] = class_json_obj[item]

        list_of_constructed.append(constructed)

    # print('list_of_constructed: {}'.format(list_of_constructed))

    final_constructed = {'classes': list_of_constructed}

    # print('final_constructed: {}'.format(final_constructed))

    obj_id = db.keys.insert_one(final_constructed)

    # print('obj_id: {}'.format(obj_id))

    response_body = {'oid': str(obj_id.inserted_id)}

    # print('response_body: {}'.format(response_body))

    return make_response(response_body, 200)

@app.route('/read/mongodb', methods=['GET'])
def read_from_mongodb():
    # we need to wrap it in a list() call because
    # pymongo returns a cursor, so wrapping it
    # in a list forces pymongo to go through the cursor
    # and plop all the data into the list!
    all_schedules = list(db.keys.find())

    # convert inner ObjectId json objects to strings
    ret_schedules = list()
    for schedule in all_schedules:
        ret_obj = {
            '_id': str(schedule['_id']), # converts to string here
            'classes': schedule['classes']
        }
        ret_schedules.append(ret_obj)

    return make_response(jsonify(ret_schedules), 200)

@app.route('/search/mongodb', methods=['POST'])
def search_from_mongodb():
    if not request.is_json:
        return make_response(jsonify({'message': 'Request body must be JSON'}), 400)

    oid_request = request.get_json()

    print(oid_request)

    format_list = ['oid']
    err_msg, success = verify_json_format(format_list, oid_request, 'mongodb')
    if not success:
        return err_msg

    oid_str = oid_request['oid']

    # obtain primary keys from mongodb
    try:
        oid_obj = ObjectId(oid_str)
    except Exception as e: # Note: specific bson error can't be used b/c of package name clash???
        return make_response(jsonify({'message':'invalid oid passed in'}), 400)

    result_obj = db.keys.find_one({'_id': oid_obj})
    if result_obj is None:
        err_msg = 'no document found with oid={}'.format(oid_str)
        return make_response(jsonify({'message': err_msg}), 400)

    if 'classes' not in result_obj:
        err_msg = 'malformed document in mongodb with oid={}'.format(oid_str)
        return make_response(jsonify({'message': err_msg}), 400)

    # obtain record from mySQL db
    all_records = []
    for class_obj in result_obj['classes']:
        format_list_inner = ['instructorName', 'subject', 'number']
        err_msg, success = verify_json_format(format_list_inner, class_obj, 'CourseSection')
        if not success:
            return err_msg

        #I would build this with the build_conditional_str_update method, but we have to use table alias names here
        #here so I can't pass in stuff like alias.instructorName for example
        number_value = str(class_obj['number'])
        subject = "'{}'".format(class_obj['subject'])
        instructor_name = "'{}'".format(class_obj['instructorName'])

        conditional_str = 'c.number= {0} AND c.subject= {1} AND c.instructorName= {2}'.format(number_value, subject, instructor_name)

        sql_query = '''
            SELECT *
            FROM CourseSection c
            JOIN GradeDistribution g ON c.instructorName = g.instructorName AND c.subject = g.subject AND c.number = g.number
            JOIN Instructor i ON c.instructorName = i.instructorName
            JOIN GenEd ge ON c.subject = ge.subject AND c.number = ge.number
            WHERE {};
        '''.format(conditional_str)

        print(sql_query)

        try:
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(sql_query)
            fetched_records = cursor.fetchall()

            print(fetched_records)

            if len(fetched_records) != 1:
                return make_response(jsonify({'message':'something terrible has occured...'}), 400)
            all_records.append(fetched_records[0])
        except mysql.connector.Error as e:
            print(e)
            return make_response(jsonify({'message':'an error occured while accesing mySQL DB'}), 400)
        finally:
            if cnx.is_connected():
                cursor.close()

    return make_response(jsonify(all_records), 200)

@app.route('/create/mongodb', methods=['POST'])
def create_document_in_mongodb():
    if not request.is_json:
        return make_response(jsonify({'message': 'Request body must be JSON'}), 400)

    schedule = request.get_json()

    # check to see if we got an array of json objs,
    # which are later checked to be valid classes
    # (ie. have primary keys of record in CourseSection)
    if not isinstance(schedule, list):
        return make_response(jsonify({'message': 'Must pass an array type!'}), 400)

    format_list_inner = ['instructorName', 'subject', 'number']
    list_of_constructed = []
    for class_json_obj in schedule:
        err_msg, success = verify_json_format(format_list_inner, class_json_obj, 'mongodb')
        if not success:
            return err_msg

        # construct json object to contain ONLY primary keys
        constructed = {}
        for item in format_list_inner:
            constructed[item] = class_json_obj[item]

        list_of_constructed.append(constructed)

    # print('list_of_constructed: {}'.format(list_of_constructed))

    final_constructed = {'classes': list_of_constructed}

    # print('final_constructed: {}'.format(final_constructed))

    obj_id = db.keys.insert_one(final_constructed)

    # print('obj_id: {}'.format(obj_id))

    response_body = {'oid': str(obj_id.inserted_id)}

    # print('response_body: {}'.format(response_body))

    return make_response(response_body, 200)

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

@app.route('/read/allsql', methods=['GET'])
def read_all_sql():
    read_all_data_query = '''
        SELECT *
        FROM CourseSection c
        JOIN GradeDistribution g ON c.instructorName = g.instructorName AND c.subject = g.subject AND c.number = g.number
        JOIN Instructor i ON c.instructorName = i.instructorName
        JOIN GenEd ge ON c.subject = ge.subject AND c.number = ge.number;
    '''

    return execute_generic_read_query(read_all_data_query)

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
