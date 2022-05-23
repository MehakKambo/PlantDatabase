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
                cursor.execute('SELECT Plant.scientificName AS scientificName, Plant.commonName AS commonName, Region.name '
                               'FROM Plant '
                               'LEFT JOIN Region '
                               '    ON Plant.region = Region.abbr '
                               'WHERE Plant.region = %s'
                               'ORDER BY Plant.scientificName;', (query_region,))
            else:
                cursor.execute('SELECT Plant.scientificName AS scientificName, Plant.commonName AS commonName, Region.name '
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
            cursor.execute('SELECT Plant.id, Plant.scientificName AS scientificName, Plant.commonName AS commonName, '
                           '    Region.name AS region_name, Region.abbr AS region_abbr '
                           'FROM Plant '
                           'LEFT JOIN Region '
                           '    ON Plant.region = Region.abbr '
                           'WHERE Plant.scientificName = %s;', (scientific_name,))
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
                           '    ON Climate.id = PlantClimate.climateID '
                           'WHERE PlantClimate.plantID = %d;', (plant_id,))
            plant['climates'] = [climate[0] for climate in cursor.fetchall()]

            # Get all past research related to the plant.
            cursor.execute('SELECT Research.citation '
                           'FROM Research '
                           'JOIN PlantResearch '
                           '    ON Research.id = PlantResearch.researchID '
                           'WHERE PlantResearch.plantID = %d;', (plant_id,))
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
            cursor.execute('SELECT illnessNumber AS illnessNumber, name, description '
                           'FROM PlantIllness '
                           'WHERE plantID = '
                           '    (SELECT id FROM Plant WHERE scientificName = %s);', (scientific_name,))
            conditions = [dict(zip(response_keys, condition)) for condition in cursor.fetchall()]
    conn.close()
    return {
        'conditions': conditions
    }

@app.route('/plants/<symptom_name_raw>/plantIllness', methods=['GET'])
def plant_illness(symptom_name_raw: str):
    """
    Endpoint for interaction #5:
    Returns all the PlantIllnesses related to the provided symptom name as an array.
    """
    symptom_name = escape(symptom_name_raw)
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            response_keys = ['illnessNumber', 'name', 'description']
            cursor.execute('SELECT illnessNumber AS illnessNumber, name, description '
                           'FROM PlantIllness '
                           'JOIN IllnessSympton IS ' 
	                        '   ON PI.ID = IS.conditionID '
                            'JOIN Symptom Symp '
	                        '   ON Symp.ID = IS.SymptomID '
                            'WHERE Symp.name = %s);', (symptom_name,))
            plantIllnesses = [dict(zip(response_keys, plantIllness)) for plantIllness in cursor.fetchall()]
    conn.close()
    return {
        'plantIllnesses': plantIllnesses 
    }

@app.route('/plants/<plantIllness_name_raw>/symptoms', methods=['GET'])
def plant_symptoms(plantIllness_name_raw: str):
    """
    Endpoint for interaction #6:
    Returns all the symptoms and handling protocols for the given plant illness
    """
    plantIllness_name = escape(plantIllness_name_raw)
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:

            # HandlingProtocol (hp) response keys
            # each plant illness has no more than one hp
            hp_response_keys = ['protocolNumber', 'info', 'conditionID']
            cursor.execute('SELECT HP.protocolNumber, HP.info, PI.ID as conditionID'
                            'FROM HandlingProtocol HP'
                            'JOIN PlantIllness PI'
	                        '   ON PI.ID = IS.ConditionID'
                            'WHERE PI.name = %s);', (plantIllness_name,))
            handProtocol_row = cursor.fetchone()
            handProtocol = dict(zip(hp_response_keys, handProtocol_row))

            # Use the conditionID to get all the symptoms and remove 
            # it from the dict so the user doesn't get it
            conditionID = int(handProtocol.pop('conditionID'))

            # Each plant illness has one to many symptoms
            # Get all the symptoms related to the illness
            symp_response_keys = ['name', 'description']
            cursor.execute('SELECT Symp.name, Symp.description'
                            'FROM Symptpm Symp'
                            'JOIN IllnessSymptom IS'
	                        '   ON IS.SymptomID = Symp.ID'
                            'WHERE IS.conditionID = %d;' (conditionID,)) 
            symptoms = [dict(zip(symp_response_keys, symptom)) for symptom in cursor.fetchall()]
    conn.close()
    return {
        'handlingProtocol': handProtocol,
        'symptoms': symptoms
    }

@app.route('/plants/<scientific_name_raw>,<common_name_raw>, <region_raw>/main', methods=['PUT'])
def update_plant_info(scientific_name_raw: str, common_name_raw: str, region_raw: str):
    """
    Endpoint for interaction #7
    Returns status code 200 if update was successful
    error message otherwise
    """
    scientific_name = escape(scientific_name_raw)
    common_name = escape(common_name_raw)
    region = escape(region_raw)

    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute('UPDATE Plant'
                                'SET (commonName = %s), (region = %s)'
                                'WHERE scientificName = %s;' 
                                (common_name, region, scientific_name))
            except (Exception, psycopg2.DatabaseError) as error:
                return {
                    'message': error
                }
    conn.close()
    return {
        'status': '200',
        'ok': 'true'
    }

@app.route('/plants/<scientific_name_raw>,<common_name_raw>, <region_raw>', methods=['POST'])
def add_plant_info(scientific_name_raw: str, common_name_raw: str, region_raw: str):
    """
    Endpoint for interaction #8
    Returns an error message if the insert is unsuccessful, 
    201 http status code otherwise
    """
    scientific_name = escape(scientific_name_raw)
    common_name = escape(common_name_raw)
    region = escape(region_raw)

    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute('INSERT INTO PLANT (scientificName, commonName, region)'
                                'VALUE (%s, %s, %s);' 
                                (scientific_name, common_name, region))
            except (Exception, psycopg2.DatabaseError) as error:
                return {
                    'message': error
                }
    conn.close()
    return {
        'status': '201',
        'ok': 'true'
    }