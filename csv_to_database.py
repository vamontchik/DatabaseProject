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


def merge_rows_into_one(rows):
    merged = []

    # merge grade distribution columns, everything else is identical...
    for i in range(6):
        merged.append(rows[0][i])

    for i in range(6, 20):
        aggregate_value = 0
        for row in rows:
            aggregate_value += int(row[i])
        merged.append(aggregate_value)

    merged.append(rows[0][20])

    return merged


def merge(csv_data, file):
    if file == 'gen_ed':
        # gen_ed rows are unique ! so we don't need to do anything...
        return csv_data

    elif file == 'gpa':
        merged = []

        subject_index = 3
        number_index = 4
        primary_instructor_index = 20

        # drop first row since those just describe columns w/ str names
        csv_data.pop(0)

        while len(csv_data) > 0:
            row = csv_data[0]
            matching_rows = find_all_matching(row, csv_data, [subject_index, number_index, primary_instructor_index])
            squished = merge_rows_into_one(matching_rows)
            remove_matching_rows(csv_data, matching_rows)
            merged.append(squished)

        return merged


def read_from_csv_files():
    with open('csv_data/gened_fall_2019.csv', 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        gen_ed_data = [row for row in csv_reader]

    # first col in first row in gen-ed data has three bad characters at the beginning,
    # so crop out the odd characters:
    gen_ed_data[0][0] = gen_ed_data[0][0][3:]

    with open('csv_data/gpa_for_fall2019.csv', 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        gpa_data = [row for row in csv_reader]

    # first col in first row in gen-ed data has three bad characters at the beginning,
    # so crop out the odd characters:
    gpa_data[0][0] = gpa_data[0][0][3:]

    return gen_ed_data, gpa_data


def main():
    gen_ed_data, gpa_data = read_from_csv_files()
    merged_gen_ed_data = merge(gen_ed_data, 'gen_ed')
    merged_gpa_data = merge(gpa_data, 'gpa')

    print(merged_gen_ed_data)
    print(merged_gpa_data)


if __name__ == '__main__':
    import csv

    main()
