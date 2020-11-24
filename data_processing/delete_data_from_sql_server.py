import mysql.connector

if '__main__' == __name__:
    db_names = ['CourseSection', 'GenEd', 'GradeDistribution', 'Instructor']

    db = mysql.connector.connect(
      host="localhost",
      user="root",
      password="example_pw",
      database="course_db"
    )

    c = db.cursor()

    for db_name in db_names:
        sql = "DELETE FROM {}".format(db_name)
        c.execute(sql)
        print("Deleting from {}...".format(db_name))

    db.commit()
    c.close()
    db.close()
