### Kompajlanje i pokretanje s Apache Cordovom:

```sh
npm i -g cordova

mkdir www
cordova platform add android

# Dodat u PATH stvari koje nisu u PATHu https://cordova.apache.org/docs/en/11.x/guide/platforms/android/index.html

# Emuliranje
cordova emulate android

# Kompajlanje
cp -r js css img fonts index.html www
cordova build --release android

# Potpisivanje app bundlea
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore keystore.jks platforms/android/app/build/outputs/bundle/release/app-release.aab prod
```
