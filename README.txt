LIFELINE - GITHUB ILE APK
=========================

1) github.com'da yeni bir repo ac (Public veya Private olur).
2) Bu zip'in ICINDEKI her seyi repo'ya yukle
   (Add file > Upload files; .github klasoru dahil).
   Zip'i degil, icindeki dosyalari yukle.
3) Repo'da  Actions  sekmesine gir.
   "Build APK" > "Run workflow" butonuna bas.
4) 3-6 dakika sonra bitince calismanin icine gir,
   en altta "Artifacts" bolumunden  lifeline-apk  dosyasini indir.
5) Zip'i ac, app-debug.apk dosyasini telefona atip kur.

Not:
  - capacitor.config.json icindeki appId degerini degistirebilirsin.
  - Oyun www/index.html dosyasidir. Guncelleyip tekrar yuklersen
    Actions otomatik yeni APK derler.
  - Hata verirse Actions'taki kirmizi adimin loguna bak ve bana yapistir.
