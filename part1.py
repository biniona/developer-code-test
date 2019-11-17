import sqlite3
import json

#data base name
DB = "cma-artworks.db"
# sql string for getting desired information from tables
SQL_STR ='''
        SELECT DISTINCT 
            artwork.accession_number,
            artwork.title, 
            artwork.tombstone, 
            creator.role, 
            creator.description, 
            department.name
        FROM artwork
        INNER JOIN (creator INNER JOIN artwork__creator ON creator.id = artwork__creator.creator_id) ON artwork.id = artwork__creator.artwork_id
        INNER JOIN (department INNER JOIN artwork__department ON department.id = artwork__department.department_id) ON artwork.id = artwork__department.artwork_id
        '''

# Function that makes SQL query and converts query to JSON String
# PYTHON DB CODE BASED ON THIS STACK OVERFLOW POST:
# https://stackoverflow.com/questions/3286525/return-sql-table-as-json-in-python
def db_to_json(sql_str, DB_name, json_str = True ):
    conn = sqlite3.connect(DB_name)
    conn.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()
    rows = db.execute(sql_str).fetchall()
    conn.commit()
    conn.close()
    if json_str:
        return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON
    return rows

# writes string to file
def write_to_file(fileName, outPutString):
    outF = open(fileName, "w")
    outF.write(outPutString)
    outF.close()

# calling the two functions
write_to_file("table.JSON", db_to_json(SQL_STR, DB))

