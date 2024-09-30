
# PG6301 EKSAMEN

Heroku:
https://pg6301exam23-6e6e7a751b51.herokuapp.com/

Github repo:
https://github.com/kristiania-pg6301-2023/pg6301eksamen-danaithb

For å starte projekt:

Naviger til toppnivåprosjektmappen i terminalen.
Kjør npm install for å installere alle nødvendige avhengigheter.
Når installasjonen er fullført, kan du starte appen med npm run dev.

Svakheter:

WebSockets-implementeringen fungerer delvis. Meldinger fra andre brukere vises i sanntid i konsollen. Innholdet vises når siden oppdateres. Websockets opplever også problemer når localhost:3000 ikke runner samtidig, altså om man kun bruker heroku.
På grunn av tidsbegrensninger ble ikke testene feilsøkt fullstendig, men de er inkludert for å demonstrere kunnskap om testing. Håper det som ble oppnåd fremdeles kan bli tatt i betraktning når dere evaluerer karakter.
Login med OpenID Connect: Applikasjonen støtter kun Google som identity provider og ikke Microsoft Entra ID,

Styrker:

🟩Lage en app med Parcel, Express, Concurrently, Prettier

🟩React app med React Router, loading state og feilhåndtering - Dekket

🟩Express app med ruter i egen fil - Dekket

🟩Kommunikasjon mellom klient og server med GET, POST (og PUT?) - Dekket

🟩Deployment til Heroku - Dekket

🟩Lagring, henting og oppdatering av data i MongoDB - Dekket

🟧Login med OpenID Connect (bare Google) - Delvis dekket (kun Google, ikke Microsoft Entra ID)

🟩Web Sockets - Delvis dekket (meldinger uten innhold vises)

🟩man kan legge til nye chatroms, og det går ikke ann at dem har samme navn!

🟩 Anonyme brukere skal ikke kunne se chatloggen, men skal kunne logge seg inn.

🟩 Brukere kan logge seg inn. Det anbefales at du implementerer at brukerne logger seg inn med Google, men andre mekanismer er også akseptable.

🟩 En bruker som er logget inn kan se på sin profilside (userinfo fra Google).

🟩 Innloggede brukere skal kunne sende chatmeldinger.

🟩 Meldinger som sendes inn skal lagres i MongoDB.

🟧 Innloggede brukere skal kunne se chatmeldinger umiddelbart. Bruk websockets for å hente oppdateringer.

🟩 Chatmeldinger skal inneholde navnet på brukeren som skrev dem. Navnet skal hentes fra identity provider (Google, Entra ID).

🟩 Når bruker logger seg inn skal websiden hente eksisterende meldinger fra MongoDB.

Kreves for A/B:

🟩 Brukere som har logget på med Entra ID kan opprette chatroom med tittel og beskrivelse. Brukere må når de skrive chat meldinger velge chatroom for meldingen.

🟩 Systemet skal hindre brukere fra å opprette to chatroom med samme tittel.

🟩 Brukere skal forbli logget inn når de refresher websiden.

🟩 Alle feil fra serveren skal presenteres for brukeren på en pen måte, med mulighet for brukeren til å prøve igjen.
=======
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/pgC2zHhI)
>>>>>>> 04e0b2fd67358c4be6bb25fec4236d4bb521baf8
