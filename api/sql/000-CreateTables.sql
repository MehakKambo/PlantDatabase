CREATE TABLE IF NOT EXISTS Symptom (
    id          SERIAL       NOT NULL,
    name        VARCHAR(30)  UNIQUE NOT NULL,
    description VARCHAR(500) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS HandlingProtocol (
    id              SERIAL        NOT NULL,
    protocolNumber SERIAL        UNIQUE NOT NULL,
    info            VARCHAR(1000) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Research (
    id          SERIAL       NOT NULL,
    citation    VARCHAR(100) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Region (
    abbr    VARCHAR(10)  NOT NULL,
    name    VARCHAR(100) UNIQUE NOT NULL,

    PRIMARY KEY (abbr)
);

CREATE TABLE IF NOT EXISTS Climate (
    id      SERIAL      NOT NULL,
    name    VARCHAR(20) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Plant (
    id                  SERIAL      NOT NULL,
    scientificName     VARCHAR(30) UNIQUE NOT NULL,
    commonName         VARCHAR(30) NOT NULL,
    region              VARCHAR(10) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (region) REFERENCES Region(abbr) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS PlantClimate (
    id          SERIAL NOT NULL,
    climateID  INTEGER NOT NULL,
    plantID    INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (climate_id) REFERENCES Climate(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (plant_id)   REFERENCES Plant(id)   DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS PlantResearch (
    id          SERIAL  NOT NULL,
    researchID INTEGER NOT NULL,
    plantID    INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (research_id) REFERENCES Research(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (plant_id)    REFERENCES Plant(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS PlantIllness (
    id             SERIAL       NOT NULL,
    illnessNumber SERIAL       UNIQUE NOT NULL,
    name           VARCHAR(30)  NOT NULL,
    description    VARCHAR(500) NOT NULL,
    plantID       INTEGER,
    protocolID    INTEGER,

    PRIMARY KEY (id),
    FOREIGN KEY (plant_id)    REFERENCES Plant(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (protocol_id) REFERENCES HandlingProtocol(id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS IllnessSymptom (
    id           SERIAL  NOT NULL,
    symptomID   INTEGER NOT NULL,
    conditionID INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (symptom_id)   REFERENCES Symptom(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (condition_id) REFERENCES PlantIllness(id) DEFERRABLE INITIALLY DEFERRED
);
