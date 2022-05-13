from flask import Flask, abort, request
from markupsafe import escape
import psycopg2


app = Flask(__name__)
app.config['CONNECTION_STRING'] = 'dbname=plantdb user=plantdb password=plantdb'

@app.route('/something')
def something():
    # Example of executing database query
    # https://www.psycopg.org/docs/usage.html#basic-module-usage
    # https://www.psycopg.org/docs/connection.html#the-connection-class
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            cursor.execute('CREATE TABLE Region (abbr VARCHAR(4) PRIMARY KEY, name VARCHAR(28) UNIQUE NOT NULL);')
            cursor.execute('INSERT INTO REGION (abbr, name) VALUES (%s, %s);', ('NITL', 'Northern Italy'))
            cursor.execute('SELECT * FROM Region;')
            print('Abbreviation: %s\nRegion: %s\n' % cursor.fetchone(), end='')
            cursor.execute('DROP TABLE Region;')
    # The transaction is commited after the context exits, here

    # The connection still needs to be closed separately
    conn.close()

    return {
        'message': 'ok'
    }

@app.route('/regions', methods=['GET'])
def regions():
    """
    Helper endpoint for interaction #2:
    Returns all regions. The data from this endpoint can be used to set the query parameters
    in the `/plants` endpoint.
    """
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            response_keys = ['abbr', 'name']
            cursor.execute('SELECT Region.abbr, Region.name FROM Region;')
            regions = [dict(zip(response_keys, region)) for region in cursor.fetchall()]
    conn.close()
    return {
        'regions': regions
    }

@app.route('/plants', methods=['GET'])
def plants():
    """
    Endpoint for interactions #1 and #2:
    Returns all plants, aggregated with their regions, and returns this data as an array.
    If the `region` query parameter is provided, the response is filtered down to plants from the
    specified region. The `region` query parameter should be provided as an abbreviation, not a
    region name.
    """
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            response_keys = ['scientificName', 'commonName', 'region']
            query_region = request.args.get('region', default='', type=str)
            if query_region != '':
                cursor.execute('SELECT Plant.scientific_name AS scientificName, Plant.common_name AS commonName, Region.name '
                               'FROM Plant '
                               'LEFT JOIN Region '
                               '    ON Plant.region = Region.abbr '
                               'WHERE Plant.region = %s'
                               'ORDER BY Plant.scientificName;', (query_region,))
            else:
                cursor.execute('SELECT Plant.scientific_name AS scientificName, Plant.common_name AS commonName, Region.name '
                               'FROM Plant '
                               'LEFT JOIN Region '
                               '    ON Plant.region = Region.abbr '
                               'ORDER BY Plant.scientificName;')
            plants = [dict(zip(response_keys, plant)) for plant in cursor.fetchall()]
    conn.close()
    return {
        'plants': plants
    }

@app.route('/plants/<scientific_name_raw>', methods=['GET'])
def plant_info(scientific_name_raw: str):
    """
    Endpoint for interaction #3:
    Returns the plant with the provided scientific name, including its past research,
    climates, and region.
    """
    scientific_name = escape(scientific_name_raw)
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            # Get the plant itself
            response_keys_basic = ['id', 'scientificName', 'commonName', 'region_name', 'region_abbr']
            cursor.execute('SELECT Plant.id, Plant.scientific_name AS scientificName, Plant.common_name AS commonName, '
                           '    Region.name AS region_name, Region.abbr AS region_abbr '
                           'FROM Plant '
                           'LEFT JOIN Region '
                           '    ON Plant.region = Region.abbr '
                           'WHERE Plant.scientific_name = %s;', (scientific_name,))
            plant_row = cursor.fetchone()
            if plant_row is None:
                abort(404)
            plant = dict(zip(response_keys_basic, plant_row))

            # Get the plant ID and remove it from the dictionary so that it doesn't
            # get returned to the user.
            plant_id = int(plant.pop('id'))

            # Get the plant's climates in a separate query, since we actually need
            # each climate record individually, rather than aggregated.
            cursor.execute('SELECT Climate.name '
                           'FROM Climate '
                           'JOIN PlantClimate '
                           '    ON Climate.id = PlantClimate.climate_id '
                           'WHERE PlantClimate.plant_id = %d;', (plant_id,))
            plant['climates'] = [climate[0] for climate in cursor.fetchall()]

            # Get all past research related to the plant.
            cursor.execute('SELECT Research.citation '
                           'FROM Research '
                           'JOIN PlantResearch '
                           '    ON Research.id = PlantResearch.research_id '
                           'WHERE PlantResearch.plant_id = %d;', (plant_id,))
            plant['research'] = [research[0] for research in cursor.fetchall()]
    conn.close()
    return plant

@app.route('/plants/<scientific_name_raw>/conditions', methods=['GET'])
def plant_conditions(scientific_name_raw: str):
    """
    Endpoint for interaction #4:
    Returns all conditions for the plant with the provided scientific name as an array.
    """
    scientific_name = escape(scientific_name_raw)
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            response_keys = ['illnessNumber', 'name', 'description']
            cursor.execute('SELECT illness_number AS illnessNumber, name, description '
                           'FROM PlantIllness '
                           'WHERE plant_id = '
                           '    (SELECT id FROM Plant WHERE scientific_name = %s);', (scientific_name,))
            conditions = [dict(zip(response_keys, condition)) for condition in cursor.fetchall()]
    conn.close()
    return {
        'conditions': conditions
    }