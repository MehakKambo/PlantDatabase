CREATE TABLE IF NOT EXISTS PlantResearch (
    id SERIAL NOT NULL,
    research_id INTEGER NOT NULL,
    plant_id INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (research_id) REFERENCES Research(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (plant_id)    REFERENCES Plant(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS HandlingProtocol (
    id   SERIAL NOT NULL,
    info VARCHAR(1000) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS PlantIllness (
    id          SERIAL       NOT NULL,
    name        VARCHAR(30)  NOT NULL,
    description VARCHAR(500) NOT NULL,
    plant_id    INTEGER,
    protocol_id INTEGER,

    PRIMARY KEY (id),
    FOREIGN KEY (plant_id)    REFERENCES Plant(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (protocol_id) REFERENCES HandlingProtocol(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS Symptom (
    id          SERIAL       NOT NULL,
    name        VARCHAR(30)  UNIQUE NOT NULL,
    description VARCHAR(500) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS IllnessSymptom (
    id           SERIAL  NOT NULL,
    symptom_id   INTEGER NOT NULL,
    condition_id INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (symptom_id)   REFERENCES Symptom(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (condition_id) REFERENCES PlantIllness(id) DEFERRABLE INITIALLY DEFERRED
);