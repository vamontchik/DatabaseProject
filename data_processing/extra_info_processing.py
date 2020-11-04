def columns_equal(row1, row2, index_values):
    for i in index_values:
        if row1[i] != row2[i]:
            return False
    return True


def find_all_matching(row, csv_data, index_values):
    matching_rows = []

    for iter_row in csv_data:
        if columns_equal(row, iter_row, index_values):
            matching_rows.append(iter_row)

    return matching_rows


def remove_matching_rows(csv_data, to_remove):
    for row in to_remove:
        csv_data.remove(row)


def merge_rows_into_one(rows, grab_index_list):
    merged = []
    from_row = rows[0]  # assume all rows have same values in the columns we need !

    for i in grab_index_list:
        merged.append(from_row[i])

    return merged


def read_from_csv_file():
    with open('csv_data/course_catalogue_fall_2019.csv', 'r', encoding="utf8") as f:
        csv_reader = csv.reader(f, delimiter=',')
        extra_info = [row for row in csv_reader]
    return extra_info


def write_to_csv_file(data, file_name):
    with open(file_name, 'w+', newline='') as f:
        csv_writer = csv.writer(f, delimiter=',')
        csv_writer.writerows(data)


def merge(csv_data):
    merged = []

    subject_index = 3
    number_index = 4
    description_index = 6
    credit_hours_index = 7

    # drop first row since those just describe columns w/ str names
    csv_data.pop(0)

    while len(csv_data) > 0:
        row = csv_data[0]
        matching_rows = find_all_matching(row, csv_data, [subject_index, number_index])
        squished = \
            merge_rows_into_one(matching_rows, [subject_index, number_index, description_index, credit_hours_index])
        remove_matching_rows(csv_data, matching_rows)
        merged.append(squished)

    return merged


def main():
    extra_info = read_from_csv_file()
    merged_data = merge(extra_info)
    write_to_csv_file(merged_data, 'csv_data/extra_info_fall_2019.csv')


if __name__ == '__main__':
    import csv

    main()
