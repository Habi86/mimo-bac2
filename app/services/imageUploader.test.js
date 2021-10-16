const rewire = require("rewire")
const imageUploader = rewire("./imageUploader")
const ImageUploader = imageUploader.__get__("ImageUploader")
// @ponicode
describe("uploadNewImage", () => {
    let inst

    beforeEach(() => {
        inst = new ImageUploader()
    })

    test("0", () => {
        let callFunction = () => {
            inst.uploadNewImage({ filename: "image.png", source: { uri: "b'https://example.com:1234/foo?bar'" } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.uploadNewImage({ filename: "image.png", source: { uri: "b'http://example.com/'" } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.uploadNewImage({ filename: "image.png", source: { uri: "http://another.example.com/" } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.uploadNewImage({ filename: "image.png", source: { uri: "http://backend.userland.com/rss" } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst.uploadNewImage({ filename: "image.png", source: { uri: "b'http://example.com/foo;1234?bar#frag'" } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst.uploadNewImage(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
