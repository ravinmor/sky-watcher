import fetch from "node-fetch"

interface CoordinatesInterface {
	latitude: number,
	longitude: number
}

interface FlightRawDataIndexStructureInterface {
    icao24:          number
    callsign:        number
    origin_country:  number
    time_position:   number
    last_contact:    number
    longitude:       number
    latitude:        number
    baro_altitude:   number
    on_ground:       number
    velocity:        number
    true_track:      number
    vertical_rate:   number
    sensors:         number
    geo_altitude:    number
    squawk:          number
    spi:             number
    position_source: number
} 
interface FlightInfoStructureInterface {
    icao24:          string   // Unique ICAO 24-bit address of the transponder in hex string representation.
    callsign:        string   // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
    origin_country:  string   // Country name inferred from the ICAO 24-bit address.
    time_position:   number   // Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
    last_contact:    number   // Unix timestamp (seconds) for the last update in general. This field is updated for any new valid message received from the transponder.
    longitude:       number   // WGS-84 longitude in decimal degrees. Can be null.
    latitude:        number   // WGS-84 latitude in decimal degrees. Can be null.
    baro_altitude:   number   // Barometric altitude in meters. Can be null.
    on_ground:       boolean  // Boolean value which indicates if the position was retrieved from a surface position report.
    velocity:        number   // Velocity over ground in m/s. Can be null.
    true_track:      number   // True track in decimal degrees clockwise from north (north=0°). Can be null.
    vertical_rate:   number   // Vertical rate in m/s. A positive value indicates that the airplane is climbing a negative value indicates that it descends. Can be null.
    sensors:         number[] // Ds of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
    geo_altitude:    number   // Geometric altitude in meters. Can be null.
    squawk:          string   // The transponder code aka Squawk. Can be null.
    spi:             boolean  // The transponder code aka Squawk. Can be null.
    position_source: number   // Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
}

interface FlightRawStructureInterface {
    0:  string   // Unique ICAO 24-bit address of the transponder in hex string representation.
    1:  string   // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
    2:  string   // Country name inferred from the ICAO 24-bit address.
    3:  number   // Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
    4:  number   // Unix timestamp (seconds) for the last update in general. This field is updated for any new valid message received from the transponder.
    5:  number   // WGS-84 longitude in decimal degrees. Can be null.
    6:  number   // WGS-84 latitude in decimal degrees. Can be null.
    7:  number   // Barometric altitude in meters. Can be null.
    8:  boolean  // Boolean value which indicates if the position was retrieved from a surface position report.
    9:  number   // Velocity over ground in m/s. Can be null.
    10: number   // True track in decimal degrees clockwise from north (north=0°). Can be null.
    11: number   // Vertical rate in m/s. A positive value indicates that the airplane is climbing a negative value indicates that it descends. Can be null.
    12: number[] // Ds of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
    13: number   // Geometric altitude in meters. Can be null.
    14: string   // The transponder code aka Squawk. Can be null.
    15: boolean  // The transponder code aka Squawk. Can be null.
    16: number   // Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
}

class OpenSky {
    url: string
    lamin?: number
    lomin?: number
    lamax?: number
    lomax?: number
    laminUrl?: string
    lominUrl?: string
    lamaxUrl?: string
    lomaxUrl?: string
    header?: any
    obj?: any
    flightRawIndexStructure: {
        icao24:          number
        callsign:        number
		origin_country:  number
		time_position:   number
		last_contact:    number
		longitude:       number
		latitude:        number
        baro_altitude:   number
        on_ground:       number
        velocity:        number
        true_track:      number
        vertical_rate:   number
        sensors:         number
        geo_altitude:    number
        squawk:          number
        spi:             number
        position_source: number
    } 

    constructor() { 
        this.url = `https://opensky-network.org/api/states/all?`;
        this.header = {
            Accept: 'application/json'
        }
        this.obj = {
            method: 'GET',
            headers: this.header,
        }
        this.flightRawIndexStructure = {
            icao24: 0,
            callsign: 1,
            origin_country: 2,
            time_position: 3,
            last_contact: 4,
            longitude: 5,
            latitude: 6,
            baro_altitude: 7,
            on_ground: 8,
            velocity: 9,
            true_track: 10,
            vertical_rate: 11,
            sensors: 12,
            geo_altitude: 13,
            squawk: 14,
            spi: 15,
            position_source: 16,
        }
    }

    setMaxCoordinates(maxCoordinates: CoordinatesInterface): void {
		this.lamax = maxCoordinates.latitude
		this.lomax = maxCoordinates.longitude
		
        this.setMaxCoordinatesUrl()
    }
    
    setMinCoordinates(minCoordiantes: CoordinatesInterface): void {
		this.lamin = minCoordiantes.latitude
		this.lomin = minCoordiantes.longitude

        this.setMinCoordinatesUrl()
    }

    setMaxCoordinatesUrl(): void {
		this.lamaxUrl = `lamax=${this.lamax}&`
		this.lomaxUrl = `lomax=${this.lomax}`
    }

    setMinCoordinatesUrl(): void {
		this.laminUrl = `lamin=${this.lamin}&`
		this.lominUrl = `lomin=${this.lomin}&`
    }

    getMaxCoordinates() {
		return {
            lamax: this.lamax,
            lamin: this.lamin
        }
    }
    
    getMinCoordiantes() {
		return {
            lamin: this.lamin,
		    lomin: this.lomin
        }
    }

    getFullUrl() {
        return `${this.url}${this.lamin}${this.lomin}${this.lamax}${this.lomax}`
    }

    organizeApiResponseArray(apiArray: FlightRawStructureInterface[]): FlightInfoStructureInterface[] {
        const flights = apiArray.map((flight): FlightInfoStructureInterface => {
            return {
                icao24: flight[0],
                callsign: flight[1],
                origin_country: flight[2],
                time_position: flight[3],
                last_contact: flight[4],
                longitude: flight[5],
                latitude: flight[6],
                baro_altitude: flight[7],
                on_ground: flight[8],
                velocity: flight[9],
                true_track: flight[10],
                vertical_rate: flight[11],
                sensors: flight[12],
                geo_altitude: flight[13],
                squawk: flight[14],
                spi: flight[15],
                position_source: flight[16],
            }
        })

        return flights
    }

	getOpenSkyData(): Promise<FlightInfoStructureInterface[] | Error> {
		return fetch(this.getFullUrl())
        .then(async resp => {
            const json = await resp.json();
            return this.organizeApiResponseArray(json.states)
        })
        .catch(err => {
            console.log('error :', err)
            throw err
        })
	}
}

export default OpenSky