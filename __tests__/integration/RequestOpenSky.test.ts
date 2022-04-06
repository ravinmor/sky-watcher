import OpenSky from '../../src/OpenSky'

describe('Request OpenSky API data', () => {
    it('request Open Sky Api', async () => {
        const openSky = new OpenSky()

        openSky.setMaxCoordinates({latitude: -16.545761, longitude: -41.638994})
        openSky.setMinCoordinates({latitude: -31.545761, longitude: -51.638994})

        const openSkyData = await openSky.getOpenSkyData()

        console.log(openSky)

        expect(openSkyData).toEqual(expect.anything())
    })

})