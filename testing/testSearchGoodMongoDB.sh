str="\"$*\""
data_arg="{\"oid\": ${str}}"
curl \
-H 'Content-Type: application/json' \
-d "${data_arg}" \
http://localhost:5000/search/mongodb