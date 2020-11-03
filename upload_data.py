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


def main():
    #node: this opens and closes a connection each time we fill a table which is not smart
    #but oh wellllllllll
    data = read_csv_data("csv_data/Course_Section.csv")
    fill_table(data, "Course_Section")

    data = read_csv_data("csv_data/Grade_Distribution.csv")
    fill_table(data, "Grade_Distribution")

    data = read_csv_data("csv_data/Gen_Ed.csv")
    fill_table(data, "Gen_Ed")

    data = read_csv_data("csv_data/Instructor.csv")
    fill_table(data, "Instructor")

if __name__ == '__main__':
    main()
