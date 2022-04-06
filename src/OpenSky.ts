interface CoordinatesInterface {
	latitude: number,
	longitude: number
}

class OpenSky {
    url: string
    lamin?: number
    lomin?: number
    lamax?: number
    lomax?: number

    constructor() { 
        this.url = `https://opensky-network.org/api/states/all?`;
    }

}

export default OpenSky