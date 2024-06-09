-- Your SQL goes here
CREATE TABLE
    stop_times (
        trip_id VARCHAR(255) NOT NULL,
        arrival_time VARCHAR(255) NOT NULL,
        departure_time VARCHAR(255) NOT NULL,
        stop_id VARCHAR(255) NOT NULL,
        stop_sequence INTEGER NOT NULL,
        pickup_type INTEGER NOT NULL,
        drop_off_type INTEGER NOT NULL,
        local_zone_id VARCHAR(255),
        stop_headsign VARCHAR(255),
        timepoint INTEGER NOT NULL,
        PRIMARY KEY (
            trip_id,
            stop_id,
            stop_sequence,
            arrival_time,
            departure_time
        ),
        FOREIGN KEY (stop_id) REFERENCES stops (stop_id),
        FOREIGN KEY (trip_id) REFERENCES trips (trip_id)
    );