import OpenSky from '../../src/OpenSky'

describe('Request OpenSky API data', () => {
    it('request Open Sky Api using coordinates as parameters', async () => {
        const openSky = new OpenSky()

        openSky.setMaxCoordinates({latitude: 47.8229, longitude: 10.5226})
        openSky.setMinCoordinates({latitude: 45.8389, longitude: 5.9962})

        const openSkyData = await openSky.getOpenSkyData()

        expect(openSkyData).toEqual(expect.anything())
    })
})