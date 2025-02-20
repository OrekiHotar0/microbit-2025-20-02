// Écoute les valeurs envoyées par le capteur via la radio
radio.onReceivedNumber(function (receivedNumber) {
    // Ajustement progressif de la vitesse (évite blocage)
    delayTime = Math.constrain(receivedNumber, 5, 100)
})
// Fonction pour obtenir la couleur du missile
function getColorForLed (ledIndex: number) {
    ratio = ledIndex / (numLeds - 1)
    red = Math.round(127.5 * (1 + Math.cos(ratio * Math.PI)))
    green = Math.round(127.5 * (1 - Math.cos(ratio * Math.PI)))
    return neopixel.rgb(red, green, 0)
}
let currentLed = 0
let fixedCount = 0
let green = 0
let red = 0
let ratio = 0
let numLeds = 0
let delayTime = 0
delayTime = 20
numLeds = 30
let strip = neopixel.create(DigitalPin.P0, numLeds, NeoPixelMode.RGB)
// Configuration de la radio
radio.setGroup(10)
basic.forever(function () {
    // Affiche la vitesse actuelle sur l'écran du micro:bit
    basic.showNumber(delayTime / Math.max(1, 30 - fixedCount))
    if (currentLed < numLeds - fixedCount) {
        // Animation du missile en mouvement
        strip.setPixelColor(currentLed, getColorForLed(currentLed))
        if (currentLed > 0) {
            // Efface derrière
            strip.setPixelColor(currentLed - 1, neopixel.colors(NeoPixelColors.Black))
        }
        strip.show()
        // Sécurité pour éviter division par 0
        basic.pause(delayTime / Math.max(1, 30 - fixedCount))
        currentLed += 1
    } else {
        // Une LED de plus devient fixe après chaque cycle
        fixedCount += 1
        // Repart du début
        currentLed = 0
        // Une fois toutes les LEDs allumées, on remet à zéro
        if (fixedCount >= numLeds) {
            fixedCount = 0
            strip.clear()
        }
    }
})
