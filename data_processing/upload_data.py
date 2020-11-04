import mysql.connector
import csv

def read_csv_data(file_name):
    with open(file_name, 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        data = [(row) for row in csv_reader]

    return data



def fill_table(data, table_name):
    db = mysql.connector.connect(
      host="localhost",
      user="root",
      password="example_pw",
      database="course_db"
    )

    c = db.cursor()

    num_attributes = len(data[0])
    #print(data[0])
    #print("%s, " * (num_attributes - 1) + "%s")
    sql = "INSERT INTO {} VALUES ({})".format(table_name, "%s, " * (num_attributes - 1) + "%s")
    c.executemany(sql, data)

    #commit and close connection
    db.commit()
    c.close()
    db.close()

#function used for writing rows (in SQL insert format) to a file
def append_sql_rows_util(file_name, table_name, data):
    num_attributes = len(data[0])

    with open(file_name, 'a') as f:
        f.write("INSERT INTO {} VALUES \n".format(table_name))
        for line in data:
            joined_values = ", ".join(line)
            f.write("({})\n".format(joined_values))

        f.write(";\n")
