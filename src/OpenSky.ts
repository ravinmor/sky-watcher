import fetch from "node-fetch"

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
    laminUrl?: string
    lominUrl?: string
    lamaxUrl?: string
    lomaxUrl?: string
    header?: any
    obj?: any

    constructor() { 
        this.url = `https://opensky-network.org/api/states/all?`;
        this.header = {
            Accept: 'application/json'
        }
        this.obj = {
            method: 'GET',
            headers: this.header,
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
    
    getMinCoordiantes(){
		return {
            lamin: this.lamin,
		    lomin: this.lomin
        }
    }

    getFullUrl() {
        return `${this.url}${this.lamin}${this.lomin}${this.lamax}${this.lomax}`
    }

	getOpenSkyData() {
		return fetch(this.getFullUrl())
        .then(async resp => resp.json())
        .then(json => json)
        .catch(err => {
            console.log('error :', err)
            throw err
        })
	}
}

export default OpenSky